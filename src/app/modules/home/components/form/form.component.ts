import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { ExchangeRatesService } from '../../../../core/services/exchange-rates/exchange-rates.service';
import { Exchange, Rate, DataUser } from '../../../../shared/models/models';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { retry } from 'rxjs/internal/operators/retry';
import * as converter from 'xml-js';
import { saveAs } from 'file-saver';
import { FileService } from '../../../../core/services/file/file.service';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { Settings } from '../../../../../environments/settings';
declare const require;
var xml2js = require('xml2js');


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  public arr = [];
  public xmlItems: any;
  currentDate = moment(new Date()).format('YYYY-MM-DD');
  mid: number;
  amountEURO: string;
  samplesForm: FormGroup;
  nameDownloadedFile = 'download.xml';
  searchValue: string;

  constructor(private exchangeRatesService: ExchangeRatesService,
    private fileService: FileService,
    private httpClient: HttpClient,
    private loggerService: LoggerService) { }

  ngOnInit(): void {
    this.loadXML();
    this.samplesForm = new FormGroup({
      userFirstName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Z]+[\s\p{L}]+$/u)
      ]),
      userLastName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Z]+[\s\p{L}]+$/u)
      ]),
      userTown: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Z]+[\s\p{L}]+$/u)
      ]),
      dateCompletingForm: new FormControl({ value: this.currentDate, disabled: true }, Validators.required),
      dailyAmountCommuting: new FormControl('', Validators.required),
    });
    this.samplesForm.get('dateCompletingForm').setValue(this.currentDate);
  }

  get f(): { [key: string]: AbstractControl; } {
    return this.samplesForm.controls;
  }

  changeAmount(event: { target: HTMLInputElement }): void {
    this.samplesForm.get('dailyAmountCommuting').setValue(Number(event.target.value).toPrecision(4));

    const respons = this.exchangeRatesService.getExchangeRatesEUR().subscribe({
      next: (Res: Exchange) => {
        if (Res && Res.rates) {
          const rowDataExchange: Rate[] = Res.rates;
          rowDataExchange.forEach(objRate => {
            if (objRate) {
              this.mid = objRate.mid;
              this.amountEURO = (this.samplesForm.get('dailyAmountCommuting').value * objRate.mid).toPrecision(4);
            }
          });
        }
      },
      error: (Error: Error) => {
        if (Error instanceof HttpErrorResponse) {
          switch (Error.status) {
            case 400: {
              this.loggerService.error(`Bad Request. Error code ${Error.statusText}`);
              retry(1);
              break;
            }
            case 404: {
              this.loggerService.error(`Not Found. Error code ${Error.statusText}`);
              retry(1);
              break;
            }
            case 503: {
              this.loggerService.error(`Service Unavailable. Error code ${Error.statusText}`);
              retry(1);
              break;
            }
            default: {
              this.loggerService.error('Error name: ' + Error.error);
              this.loggerService.error('Error status text: ' + Error.statusText);
              this.loggerService.error('Error status: ' + Error.status);
              break;
            }
          }
        }
      },
      complete(): void { }
    });
  }

  saveXML(): void {
    if (this.samplesForm.dirty && this.samplesForm.valid) {
      let euro = this.samplesForm.get('dailyAmountCommuting').value * this.mid;
      euro = +(euro).toPrecision(4);

      const dataUser: DataUser = {
        dailyAmountCommuting: '' + euro,
        dateCompletingForm: this.samplesForm.get('dateCompletingForm').value,
        userFirstName: this.samplesForm.get('userFirstName').value,
        userLastName: this.samplesForm.get('userLastName').value,
        userTown: this.samplesForm.get('userTown').value,
      };
      const jsonDataUser = JSON.stringify(dataUser);
      const outputXml = converter.json2xml(jsonDataUser, { compact: true, spaces: 4 });

      this.fileService.getFileXML(this.nameDownloadedFile, outputXml).subscribe(res => {
        saveAs(res, this.nameDownloadedFile);
      });
    }
  }

  printForm(): void {
    if (this.samplesForm.dirty && this.samplesForm.valid) {
      window.print();
    }
  }

  loadXML(): void {
    this.httpClient.get(Settings.GET_CITY,
      {
        headers: new HttpHeaders().set('Content-Type', 'text/xml'),
        responseType: 'text'
      })
      .subscribe((data) => {
        this.parseXML(data)
          .then((data) => {
            return this.xmlItems = data;
          });
      });
  }
  parseXML(data): Promise<any> {
    return new Promise(resolve => {
      this.arr = [];
      const parser = new xml2js.Parser({
        trim: true,
        explicitArray: true
      });
      parser.parseString(data, (err, result) => {

        const obj = result.teryt;

        for (const index of obj.row) {
          this.arr.push({
            NAZWA: index.NAZWA[0]
          });
        }
        resolve(this.arr);
      });
    });
  }

  search(value: string): void {
    this.searchValue = value;
    this.arr = this.arr.filter(valueFilter =>
      valueFilter.NAZWA.indexOf(this.searchValue) >= 0
    );
  }
}

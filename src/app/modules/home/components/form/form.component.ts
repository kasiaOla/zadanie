import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import { ExchangeRatesService } from '../../../../core/services/exchange-rates.service';
import { Exchange, Rate, DataUser } from '../../../../shared/models/models';
import { HttpErrorResponse } from '@angular/common/http';
import { retry } from 'rxjs/internal/operators/retry';
import * as converter from 'xml-js';
import { saveAs } from 'file-saver';
import { FileService } from '../../../../core/services/file.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  currentDate = moment(new Date()).format('YYYY-MM-DD');
  mid: number;
  amountEURO: string;
  samplesForm: FormGroup;
  fileInputLabel: string;
  nameDownloadedFile = 'download.xml';

  constructor(private fb: FormBuilder,
              private exchangeRatesService: ExchangeRatesService,
              private fileService: FileService) {}

  ngOnInit(): void {
    this.samplesForm = this.fb.group({
      userFirstName: this.fb.control('', [
        Validators.required,
        Validators.pattern(/^[A-Z]+[\s\p{L}]+$/u)
      ]),
      userLastName: this.fb.control('', [
        Validators.required,
        Validators.pattern(/^[A-Z]+[\s\p{L}]+$/u)
      ]),
      userTown: this.fb.control('', [
        Validators.required,
        Validators.pattern(/^[A-Z]+[\s\p{L}]+$/u)
      ]),
      dateCompletingForm: this.fb.control(this.currentDate, [Validators.required]),
      dailyAmountCommuting: this.fb.control('', [Validators.required]),
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
              console.error(`Bad Request. Error code ${Error.statusText}`);
              retry(1);
              break;
            }
            case 404: {
              console.error(`Not Found. Error code ${Error.statusText}`);
              retry(1);
              break;
            }
            case 503: {
              console.error(`Service Unavailable. Error code ${Error.statusText}`);
              retry(1);
              break;
            }
            default: {
              console.error('Error name: ' + Error.error);
              console.error('Error status text: ' + Error.statusText);
              console.error('Error status: ' + Error.status);
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
}

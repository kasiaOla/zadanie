import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Settings } from '../../../../environments/settings';
import { retryWhen, delay, tap, switchMap } from 'rxjs/operators';
import { LoggerService } from '../logger/logger.service';
declare const require;
var xml2js = require('xml2js');
@Injectable({
  providedIn: 'root'
})
export class FileService {
  public arr = [];
  public xmlItems: any;
  constructor(private httpClient: HttpClient,
    private loggerService: LoggerService) { }

  public getFileXML(fileName: string, fileContent: any): Observable<Blob> {
    return this.httpClient.post(Settings.GET_FILE, { name: fileName, content: fileContent }, {
      responseType: 'blob',
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }).set('Accept', 'application/xml, text/plain, */*')
    }).pipe(
      retryWhen(errors => errors.pipe(delay(1000),
        tap(errorStatus => {
          if (!errorStatus.startsWith('5')) {
            throw errorStatus;
          }
          this.loggerService.info('Retrying...');
        })
      )
      )
    );
  }

  loadXML() {
    return this.httpClient.get('../../../../assets/test.xml',
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'text/xml')
          .append('Access-Control-Allow-Methods', 'GET')
          .append('Access-Control-Allow-Origin', '*')
          // tslint:disable-next-line:max-line-length
          .append('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method'),
        responseType: 'text'
      })
      .subscribe((data) => {
        this.parseXML(data)
          .then((data) => {
            this.xmlItems = data;
          });
      });
  }
  parseXML(data) {
    return new Promise(resolve => {
      // tslint:disable-next-line:one-variable-per-declaration
      let k: string | number;
      let licznik = 0;
      this.arr = [];
      const parser = new xml2js.Parser({
        trim: true,
        explicitArray: true
      });
      parser.parseString(data, (err, result) => {

        const obj = result.Employees;

        for (let k of obj.row) {
          licznik++;
          if (licznik > 10) {
            this.arr.push({
              NAZWA: k.NAZWA
            });
          }

        }
        console.log('this.arr', this.arr)
        resolve(this.arr);
      });
    });
  }
}

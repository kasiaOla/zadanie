import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Settings } from '../../../../environments/settings';
import { retryWhen, delay, tap } from 'rxjs/operators';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

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
}

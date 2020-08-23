import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';
import { Settings } from '../../../environments/settings';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/xml'}).set(  'Accept' ,  'application/xml, text/plain, */*' )
  };

  constructor(private httpClient: HttpClient) { }

  public upload(fileName: string, fileContent: any): void {
    this.httpClient.put(Settings.FILES  , {name: fileName, content: fileContent}, this.httpOptions)
    .pipe()
    .subscribe(res => {
    }, error => {
    });
  }
  public download(fileName: string): Observable<Blob> {
    const body = { filename: fileName };
    return this.httpClient.post(Settings.DOWNLOAD, body, {
      responseType: 'blob',
      headers: new HttpHeaders({ 'Content-Type': 'application/xml'}).set(  'Accept' ,  'application/xml, text/plain, */*' )
    });
  }
}

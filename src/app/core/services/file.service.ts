import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Settings } from '../../../environments/settings';


@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private httpClient: HttpClient) { }

  public getFileXML(fileName: string, fileContent: any): Observable<Blob> {
   return this.httpClient.post(Settings.GET_FILE, { name: fileName, content: fileContent }, {
      responseType: 'blob',
      headers: new HttpHeaders({ 'Content-Type': 'application/xml' }).set('Accept', 'application/xml, text/plain, */*')
    });
  }
}

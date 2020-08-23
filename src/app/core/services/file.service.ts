import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { Settings } from '../../../environments/settings';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private fileList: string[] = new Array<string>();
  private fileList$: Subject<string[]> = new Subject<string[]>();
  private displayLoader$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/xml'}).set(  'Accept' ,  'application/xml, text/plain, */*' )
  };

  constructor(private httpClient: HttpClient) { }

  public upload(fileName: string, fileContent: any): void {
    this.displayLoader$.next(true);
    console.log('----fileContent ', fileContent)
    this.httpClient.put(Settings.FILES  , {name: fileName, content: fileContent}, this.httpOptions)
    .pipe(finalize(() => this.displayLoader$.next(false)))
    .subscribe(res => {
      console.log('-------', res)
      this.fileList.push(fileName);
      this.fileList$.next(this.fileList);

    }, error => {
      this.displayLoader$.next(false);
    });
  }
  public download(fileName: string) {
    const body = { filename: fileName };
    return this.httpClient.post(Settings.DOWNLOAD, body, {
      responseType: 'blob',
      headers: new HttpHeaders({ 'Content-Type': 'application/xml'}).set(  'Accept' ,  'application/xml, text/plain, */*' )

    });
  }

  public downloadReport(file): Observable<any> {
    // Create url
    let url = `http://localhost:3000/download`;
    var body = { filename: file };

    return this.httpClient.post(url, body, this.httpOptions);
  }


}

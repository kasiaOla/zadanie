import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, share } from 'rxjs/operators';
import { Exchange } from '../../shared/models/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRatesService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/xml' })
  };

  constructor(private httpClient: HttpClient) { }

  public getExchangeRatesEUR(): Observable<Exchange> {
    return this.httpClient.get<Exchange>('http://api.nbp.pl/api/exchangerates/rates/a/eur/last/1/',
      {
        params: {
          format: 'json',
        }
      },
    ).pipe(
      tap(announcements => {
        console.log('EUR!' + announcements)
      }), share()
    );
  }
}

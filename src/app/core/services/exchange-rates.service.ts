import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, share } from 'rxjs/operators';
import { Exchange } from '../../shared/models/models';
import { Observable } from 'rxjs';
import { Settings } from '../../../environments/settings';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRatesService {

  constructor(private httpClient: HttpClient) { }

  public getExchangeRatesEUR(): Observable<Exchange> {
    return this.httpClient.get<Exchange>(Settings.NBP_EXCHANGE_RATES,
      {
        params: {
          format: 'json',
        }
      },
    ).pipe(
      tap(exchangeRates => {
        console.log('EUR!' + exchangeRates);
      }), share()
    );
  }
}

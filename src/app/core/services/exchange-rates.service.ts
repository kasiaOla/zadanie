import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, share } from 'rxjs/operators';
import { Exchange } from '../../shared/models/models';
import { Observable } from 'rxjs';
import { Settings } from '../../../environments/settings';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRatesService {

  constructor(private httpClient: HttpClient,
              private loggerService: LoggerService) { }

  public getExchangeRatesEUR(): Observable<Exchange> {
    return this.httpClient.get<Exchange>(Settings.NBP_EXCHANGE_RATES,
      {
        params: {
          format: 'json',
        }
      },
    ).pipe(
      tap(exchangeRates => {
        this.loggerService.info('EUR!' + exchangeRates);
      }), share()
    );
  }
}

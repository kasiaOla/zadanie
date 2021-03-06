import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExchangeRatesService } from './services/exchange-rates/exchange-rates.service';
import { HttpClientModule } from '@angular/common/http';
import { FileService } from './services/file/file.service';
import { LoggerService } from './services/logger/logger.service';
import { envProdServiceLogger } from '../../environments/environment.prod';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    ExchangeRatesService,
    FileService,
    {
      provide: LoggerService,
      useClass: envProdServiceLogger,
    }
  ]
})
export class CoreModule {}

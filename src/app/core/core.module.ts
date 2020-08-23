import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExchangeRatesService } from './services/exchange-rates.service';
import { HttpClientModule } from '@angular/common/http';
import { FileService } from './services/file.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    ExchangeRatesService,
    FileService
  ]
})
export class CoreModule { }

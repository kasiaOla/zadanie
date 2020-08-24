import { TestBed } from '@angular/core/testing';
import { ExchangeRatesService } from './exchange-rates.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerService } from '../logger/logger.service';

describe('ExchangeRatesService', () => {
  let service: ExchangeRatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [LoggerService]
    });
    service = TestBed.inject(ExchangeRatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

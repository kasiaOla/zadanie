import { TestBed } from '@angular/core/testing';
import { FileService } from './file.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerService } from './logger.service';

describe('FileService', () => {
  let service: FileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [LoggerService]
    });
    service = TestBed.inject(FileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

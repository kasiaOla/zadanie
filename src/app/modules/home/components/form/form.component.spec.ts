import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as moment from 'moment';
import { FormComponent } from './form.component';
import { FormBuilder } from '@angular/forms';
import { FileService } from '../../../../core/services/file.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { LoggerService } from '../../../../core/services/logger/logger.service';

class MockFileService extends FileService { }

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let testElementHtmlButton: DebugElement;
  let elButton: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
          {
            provide: FileService,
            useClass: MockFileService
          },
          LoggerService
        ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as currentDate ${moment(new Date()).format('YYYY-MM-DD')}`, () => {
    fixture = TestBed.createComponent(FormComponent);
    const app = fixture.componentInstance;
    expect(app.currentDate).toEqual('' + moment(new Date()).format('YYYY-MM-DD'));
  });

  it('display text in h2', () => {
    fixture = TestBed.createComponent(FormComponent);
    const testElementHtmlH2 = fixture.debugElement.query(By.css('h2'));
    const elH2 = testElementHtmlH2.nativeElement;
    expect(elH2.textContent).toContain('Formularz');
  });

  it('display text in h3', () => {
    fixture = TestBed.createComponent(FormComponent);
    const testElementHtmlH2 = fixture.debugElement.query(By.css('h3'));
    const elH2 = testElementHtmlH2.nativeElement;
    expect(elH2.textContent).toContain('Wprowadź dane');
  });

  it('Unit test displaying the button name Zapisz jako XML', () => {
    fixture = TestBed.createComponent(FormComponent);
    testElementHtmlButton = fixture.debugElement.query(By.css('.btn-default'));
    elButton = testElementHtmlButton.nativeElement;
    expect(elButton.textContent).toContain('Zapisz jako XML');
  });

  it('Unit test displaying the button name Wydrukuj formularz', () => {
    fixture = TestBed.createComponent(FormComponent);
    testElementHtmlButton = fixture.debugElement.query(By.css('.btn-success'));
    elButton = testElementHtmlButton.nativeElement;
    expect(elButton.textContent).toContain('Wydrukuj formularz');
  });

  it('Unit test of the input type', async(() => {
    fixture = TestBed.createComponent(FormComponent);
    const compiled = fixture.debugElement;
    const routerLink = compiled.query(By.css('input[formControlName=dateCompletingForm]')).nativeElement.getAttribute('type');
    expect(routerLink).toEqual('date');
  }));
});

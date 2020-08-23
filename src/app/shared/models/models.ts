import { Data } from '@angular/router';

export interface Exchange {
  table: string;
  currency: string;
  code: string;
  rates: Rate[];
}

export interface Rate {

    no: string;
    effectiveDate: string;
    mid: number;
  }
export interface DataUser {
  dailyAmountCommuting: string;
  dateCompletingForm: Data;
  userFirstName: string;
  userLastName: string;
  userTown: string;
}

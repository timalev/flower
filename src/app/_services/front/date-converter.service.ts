import { Injectable } from '@angular/core';

@Injectable({
  providedIn: null,
})
export class DateConverterService {
  public convert(date: Date): Date {
    const UTCstring = date as unknown as string;
    // @ts-ignore
    const [y, m, d, hh, mm, ss, ms] = UTCstring.match(/\d+/g);
    return new Date(Date.UTC(y, m - 1, d, hh, mm, ss, ms));
  }
}

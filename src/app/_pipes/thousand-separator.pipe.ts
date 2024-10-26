import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'thousandSeparator',
})
export class ThousandSeparatorPipe extends DecimalPipe implements PipeTransform {
  public override transform(
    value: number | string | null | undefined,
    digitsInfo?: string,
    locale?: string,
  ): any {
    let result = super.transform(value, digitsInfo, locale);
    if (result) {
      result = result.split(',').join(' ');
    } else {
      result = '';
    }
    return result;
  }
}

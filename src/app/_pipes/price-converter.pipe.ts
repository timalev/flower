import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'priceConverter',
})
export class PriceConverterPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  public transform(
    value: number | string,
    dotOptions?: 'none' | 'one' | 'two',
    curr?: 'RUB' | 'rub' | 'full' | 'none',
  ): string {
    return this.decimalTransform(value, dotOptions, curr);
  }

  private decimalTransform(value: number | string, dotOptions?: string, curr?: string): string {
    let number = this.decimalPipe.transform(value);
    number = number?.split(',').join('\u00A0') || null;
    if (!number?.split('.')[1]) {
      switch (dotOptions) {
        case 'one':
          number += '.0';
          break;
        case 'two':
          number += '.00';
          break;
        default:
          break;
      }
    } else {
      if (!number?.split('.')[1][1] && number?.split('.')[1][0]) {
        number += '0';
      }
    }
    switch (curr) {
      case 'RUB':
        return `${number}\u20bd`;
      case 'rub':
        return `${number} руб`;
      case 'full':
        return `${number} рублей`;
      case 'none':
        return `${number}`;
      default:
        return `${number}\u20bd`;
    }
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cartCount',
})
export class CartCountPipe implements PipeTransform {
  public transform(value: number): string {
    return value % 10 === 1 && value % 100 !== 11
      ? `${value} товар`
      : value % 10 >= 2 && value % 10 <= 4 && (value % 100 < 10 || value % 100 >= 20)
      ? `${value} товара`
      : `${value} товаров`;
  }
}

import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Observable } from 'rxjs';
import { Order, OrderBox, OrderProduct } from '../../_models/order';
import { ProductItem } from '../../_models/product-item';

interface InvoiceGoods {
  name: string;
  count: number;
  volume?: string;
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService extends BaseApiService {
  protected override apiUrl = 'order';

  public getItems(skip: number, take: number, searchString?: string): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${this.baseUrl}/${this.apiUrl}/list?skip=${skip}&take=${take}${
        searchString ? '&searchString=' + searchString : ''
      }`,
    );
  }

  public generateInvoiceGoods(goods: ProductItem[]): InvoiceGoods[] {
    const filteredGoods: Map<number | string, ProductItem[]> = new Map<
      number | string,
      ProductItem[]
    >();
    const invoiceGoods: InvoiceGoods[] = [];
    goods.forEach((product) => {
      const currId = product.categories[0].id;
      const prevArr = filteredGoods.get(currId);
      if (prevArr) {
        const included = prevArr.find((item) => item.price === product.price);
        if (included) {
          prevArr.push(product);
        } else {
          // @ts-ignore
          filteredGoods.set(product.id, [product]);
        }
      } else {
        filteredGoods.set(currId, [product]);
      }
    });
    filteredGoods.forEach((item) => {
      const isTulip = item[0].categories[0].name.toLowerCase().includes('тюльпан');
      const categoryName =
        (isTulip ? 'Тюльпаны оптом' : item[0].categories[0].name) + ' (в ассортименте)';
      const price = item[0].price;
      const volume = item[0].volume as string;
      let count = 0;
      item.map((product) => {
        count += product.count;
      });
      invoiceGoods.push({ name: categoryName, count: count, volume: volume, price: price });
    });
    return invoiceGoods;
  }

  public generateOrderProducts(goods: OrderProduct[]): InvoiceGoods[] {
    const filteredGoods: Map<number | string, OrderProduct[]> = new Map<
      number | string,
      OrderProduct[]
    >();
    const invoiceGoods: InvoiceGoods[] = [];
    goods.forEach((product) => {
      const currId = product.product.categories[0].id;
      const prevArr = filteredGoods.get(currId);
      if (prevArr) {
        const included = prevArr.find((item) => item.price === product.price);
        if (included) {
          prevArr.push(product);
        } else {
          // @ts-ignore
          filteredGoods.set(product.id, [product]);
        }
      } else {
        filteredGoods.set(currId, [product]);
      }
    });
    filteredGoods.forEach((item) => {
      const categoryName = item[0].product.categories[0].name + ' (в ассортименте)';
      const price = item[0].price;
      const volume = item[0].product.volume as string;
      let count = 0;
      item.map((product) => {
        count += product.count;
      });
      invoiceGoods.push({ name: categoryName, count: count, volume: volume, price: price });
    });
    return invoiceGoods;
  }

  public generateInvoiceBoxes(boxes: OrderBox[]): InvoiceGoods[] {
    const filteredBoxes: Map<number, OrderBox[]> = new Map<number, OrderBox[]>();
    const invoiceBoxes: InvoiceGoods[] = [];
    boxes.forEach((box) => {
      const currEl = box.price;
      const prevArr = filteredBoxes.get(currEl);
      if (prevArr) {
        prevArr.push(box);
        // const included = prevArr.find((item) => item.price === product.price);
        // if (included) {
        //   prevArr.push(product);
        // } else {
        //   // @ts-ignore
        //   filteredGoods.set(product.id, [product]);
        // }
      } else {
        filteredBoxes.set(currEl, [box]);
      }
    });
    filteredBoxes.forEach((item) => {
      const name = 'Транспортировочная коробка (в ассортименте)';
      const price = item[0].price;
      let count = 0;
      item.map((box) => {
        count += box.count;
      });
      invoiceBoxes.push({ name, count, price });
    });
    return invoiceBoxes;
  }
}

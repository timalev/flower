import { Injectable } from '@angular/core';
import { EstimateGenerateService } from './estimate-generate.service';
import { OfferGenerateService } from './offer-generate.service';
import { Order } from '../../_models/order';
import { map, Observable } from 'rxjs';
import { Firm } from '../../_models/business-pack/firm';
import { PriceConverterPipe } from '../../_pipes/price-converter.pipe';
import { DocumentBox } from '../../_models/box';

@Injectable({
  providedIn: null,
})
export class DocumentGenerateService {
  constructor(
    private estimatePDF: EstimateGenerateService,
    private offerPDF: OfferGenerateService,
    private priceConvert: PriceConverterPipe,
  ) {}

  public getOffer(order: Order, firm: Firm): Observable<File> {
    let client = '';
    client += firm.FullName;
    client += `, ${firm.Address}`;
    client += `, ИНН: ${firm.INN}`;
    if (firm.KPP) {
      client += `, КПП: ${firm.KPP}`;
    }
    // @ts-ignore
    const orderNumber = order.id;
    // @ts-ignore
    const date = new Date(order.orderDate).toLocaleDateString() + 'г.';
    let sum: number = 0;
    // @ts-ignore
    const content: any[] = order.products
      // @ts-ignore
      .sort((a, b) => a.product.categoryId - b.product.categoryId)
      .map((product) => {
        sum += product.count * product.price;
        return [
          product.product.name,
          'шт.',
          product.count,
          this.priceConvert.transform(product.price, 'two', 'none'),
          this.priceConvert.transform(product.count * product.price, 'two', 'none'),
        ];
      });
    if (order.deliveryPrice) {
      sum += order.deliveryPrice;
      content.push([
        'Доставка',
        '-',
        1,
        this.priceConvert.transform(order.deliveryPrice, 'two', 'none'),
        this.priceConvert.transform(order.deliveryPrice, 'two', 'none'),
      ]);
    }
    this.offerPDF.getPDF(orderNumber, date, client, content, sum, false);
    return this.offerPDF.getGeneratedDocument().pipe(
      map((blob) => {
        return new File([blob], 'Коммерческое предложение.pdf');
      }),
    );
  }

  public getEstimate(order: Order): Observable<File> {
    const boxes: DocumentBox[] = [];
    let productsSum = 0;
    order.boxes.map((box) => {
      boxes.push({
        name: box.box.name,
        price: box.price,
        count: box.count,
      });
    });
    return this.estimatePDF
      .getClientPDF(
        order.products
          // @ts-ignore
          .sort((a, b) => a.product.categoryId - b.product.categoryId)
          .map((goods) => {
            productsSum += goods.price * goods.count;
            return [goods.product.name, goods.price, goods.count, goods.price * goods.count];
          }),
        this.priceConvert.transform(order.deliveryPrice, 'two', 'none'),
        boxes,
        this.priceConvert.transform(productsSum, 'two', 'rub'),
        this.priceConvert.transform(order.orderSum, 'two', 'none'),
        order,
        false,
      )
      .pipe(
        map((blob) => {
          return new File([blob], `Смета по заказу №${order.id}.pdf`);
        }),
      );
  }
}

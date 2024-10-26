import { Injectable } from '@angular/core';
import { HtmlToPdfService } from './html-to-pdf.service';
import { Observable } from 'rxjs';
import { DocumentBox } from '../../_models/box';
import { Order } from '../../_models/order';

@Injectable({
  providedIn: 'root',
})
export class EstimateGenerateService {
  private header: string[] = ['Товар', 'Цена ₽', 'Количество', 'Стоимость ₽'];
  constructor(private htmlToPdf: HtmlToPdfService) {}

  public getClientPDF(
    content: any[],
    delivery: string,
    boxes: DocumentBox[],
    productsSum: string,
    sum: string,
    order?: Order,
    isOpened: boolean = true,
  ): Observable<Blob> {
    this.htmlToPdf.getPDF(
      true,
      this.header,
      content,
      delivery,
      boxes,
      productsSum,
      sum,
      order,
      undefined,
      undefined,
      isOpened,
    );
    return this.htmlToPdf.getGeneratedDocument();
  }

  public getCompanyPDF(
    content: any[],
    delivery: string,
    boxes: DocumentBox[],
    productsSum: string,
    sum: string,
    order: Order,
    date: string | null,
    invoiceId: string | undefined,
    isOpened: boolean = true,
  ): Observable<Blob> {
    this.htmlToPdf.getPDF(
      false,
      this.header,
      content,
      delivery,
      boxes,
      productsSum,
      sum,
      order,
      date || undefined,
      invoiceId,
      isOpened,
    );
    return this.htmlToPdf.getGeneratedDocument();
  }
}

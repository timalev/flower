import { Inject, Injectable } from '@angular/core';
// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// @ts-ignore
import htmlToPdfmake from 'html-to-pdfmake';
import { Observable, Subject } from 'rxjs';
import { PriceConverterPipe } from '../../_pipes/price-converter.pipe';
import { DocumentBox } from '../../_models/box';
import { PRICE_CONVERT } from '../../_providers/price-convert.provider';
import { Header } from '../../_models/static-data/header';
import { Order, OrderDiscount } from '../../_models/order';
import { DatePipe } from '@angular/common';
import { DATE_CONVERT } from '../../_providers/date-convert.provider';

@Injectable({ providedIn: 'root' })
export class HtmlToPdfService {
  private header!: string[];
  private content!: any[];
  private delivery!: string;
  private boxes!: DocumentBox[];
  private productsSum!: string;
  private sum!: string;
  private order: Order | undefined;
  private date: string | undefined;
  private invoiceId: string | undefined;
  private _generatedDocument: Subject<Blob> = new Subject<Blob>();

  constructor(
    @Inject(PRICE_CONVERT) private priceConvert: PriceConverterPipe,
    @Inject(DATE_CONVERT) private dateConvert: DatePipe,
  ) {}

  public getPDF(
    isClient: boolean,
    header: string[],
    content: any[],
    delivery: string,
    boxes: DocumentBox[],
    productsSum: string,
    sum: string,
    order?: Order,
    date?: string,
    invoiceId?: string,
    isOpened: boolean = true,
  ): void {
    this.header = header;
    this.content = content;
    this.delivery = delivery;
    this.boxes = boxes;
    this.productsSum = productsSum;
    this.sum = sum;
    this.order = order;
    this.date = date;
    this.invoiceId = invoiceId;
    if (isClient) {
      HtmlToPdfService.getBase64ImageFromURL('assets/images/logo.png').then((res) => {
        const html = htmlToPdfmake(this.generateHTML(res).innerHTML, {
          tableAutoSize: true,
        });
        const documentDefinition = {
          content: html,
          info: { title: 'Смета Агрофирма Цветочная Долина' },
        };
        const document = pdfMake.createPdf(documentDefinition);
        if (isOpened) document.open();
        document.getBlob((blob: Blob) => {
          this._generatedDocument.next(blob);
        });
      });
    } else {
      const html = htmlToPdfmake(this.generateHTML().innerHTML, {
        tableAutoSize: true,
      });
      const documentDefinition = {
        content: html,
        info: { title: `Смета к заказу №${order?.id}` },
      };
      const document = pdfMake.createPdf(documentDefinition);
      if (isOpened) document.open();
      document.getBlob((blob: Blob) => {
        this._generatedDocument.next(blob);
      });
    }
  }

  private generateHTML(imgSrc?: unknown): HTMLElement {
    const div = document.createElement('div');
    const clientBlock = this.genClientBlock();
    div.append(clientBlock);
    if (this.date) {
      const h1 = document.createElement('h1');
      h1.innerText = `ВЫДАЧА ЗАКАЗА: ${this.date}`;
      h1.style.color = 'red';
      div.append(h1);
    }
    const h2 = document.createElement('h2');
    h2.innerText = 'Смета к заказу';
    if (this.order && this.order.id) {
      h2.innerText += ` №${this.order.id}`;
      if (this.invoiceId) {
        h2.innerText += ` по счету №${this.invoiceId}`;
      }
    }
    h2.style.textAlign = 'center';
    h2.style.margin = '0 0 20px 0';
    div.append(h2);
    const discount = this.calculateDiscount();
    if (discount) {
      const discountBlock = document.createElement('div');
      discountBlock.innerHTML = `Скидка на цветы: ${discount}%`;
      discountBlock.style.marginBottom = '10px';
      discountBlock.style.textAlign = 'right';
      div.append(discountBlock);
    }
    const table = this.genMainTable();
    div.append(table);
    if (imgSrc) {
      const headerTable = HtmlToPdfService.genHeaderTable(imgSrc);
      div.append(headerTable);
    }
    return div;
  }

  public static getBase64ImageFromURL(url: string) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);

        const dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = url;
    });
  }

  public static genHeaderTable(
    imgSrc: unknown,
    isDiscount = false,
    headerContent?: Header,
  ): HTMLTableElement {
    const img = document.createElement('img');
    if (typeof imgSrc === 'string') {
      img.setAttribute('src', imgSrc);
      img.setAttribute('width', isDiscount ? '150' : '100');
    }
    const title = document.createElement('div');
    if (headerContent?.title) {
      title.innerHTML = `<b>${headerContent.title}</b>`;
    } else {
      title.innerHTML = `<b>Агрофирма Цветочная<br/>Долина</b>`;
    }
    title.style.textAlign = 'left';
    title.style.marginTop = '30px';
    if (isDiscount) {
      title.style.fontSize = '25px';
    }
    const headerTable: HTMLTableElement = document.createElement('table');
    headerTable.style.border = '0';
    const htHead = headerTable.createTHead();
    const htBody = headerTable.createTBody();
    const row = htHead.insertRow(0);
    const leftCol = row.insertCell(0);
    const centerCol = row.insertCell(1);
    const rightCol = row.insertCell(2);
    leftCol.style.width = '15%';
    leftCol.style.border = '0';
    centerCol.style.width = isDiscount ? '35%' : '20%';
    centerCol.style.border = '0';
    rightCol.style.width = isDiscount ? '50%' : '65%';
    rightCol.style.border = '0';
    const headerTableBodyRow = htBody.insertRow(0);
    const image = headerTableBodyRow.insertCell(0);
    image.append(img);
    image.style.border = '0';
    const titleCell = headerTableBodyRow.insertCell(1);
    titleCell.append(title);
    titleCell.style.border = '0';
    const address = headerTableBodyRow.insertCell(2);
    address.style.marginTop = '30px';
    const addressInfo = document.createElement('div');
    if (headerContent?.address.length) {
      headerContent.address.map((addressData) => {
        addressInfo.innerHTML += addressData + '<br><br>';
      });
    } else {
      addressInfo.innerText =
        '140125, Моск. обл., Раменский р-н., д. Островцы, ул. Подмосковная д. 22 A теплица 109';
    }
    const email = document.createElement('div');
    if (headerContent?.mail) {
      email.innerText = headerContent.mail;
    } else {
      email.innerText = 'flowervalley@mail.ru';
    }
    email.style.margin = '10px 0';
    const phone = document.createElement('div');
    if (headerContent?.phone) {
      phone.innerText = headerContent.phone;
    } else {
      phone.innerText = '+7 915 109 1000';
    }
    address.append(addressInfo, email, phone);
    address.style.border = '0';
    address.style.textAlign = 'right';
    return headerTable;
  }

  private genMainTable(): HTMLTableElement {
    const table: HTMLTableElement = document.createElement('table');
    const tHead = table.createTHead();
    const tBody = table.createTBody();
    const headerRow = tHead.insertRow(0);
    const number = headerRow.insertCell(0);
    number.innerHTML = '№';
    number.style.width = '2%';
    number.style.textAlign = 'center';
    for (let i = 0; i < this.header.length; i++) {
      const cell = headerRow.insertCell(i + 1);
      cell.innerHTML = this.header[i];
      if (i === 0) {
        cell.style.width = '50%';
      } else {
        cell.style.width = '16%';
        cell.style.textAlign = 'center';
      }
    }
    let index = 1;
    for (let i = 0; i < this.content.length; i++) {
      const abstractRow = this.content[i];
      const bodyRow = tBody.insertRow(i);
      const indexCell = bodyRow.insertCell(0);
      indexCell.innerHTML = index.toString();
      indexCell.style.textAlign = 'center';
      index++;
      for (let j = 0; j < abstractRow.length; j++) {
        const cell = bodyRow.insertCell(j + 1);
        switch (j) {
          case 1:
          case 3:
            cell.innerHTML = this.priceConvert.transform(abstractRow[j], 'two', 'none');
            break;
          default:
            cell.innerHTML = abstractRow[j];
            break;
        }
        if (j > 0) {
          cell.style.textAlign = 'right';
        }
      }
    }
    let rowIndex = this.content.length;
    for (let i = 0; i < this.boxes.length; i++) {
      const abstractRow = this.boxes[i];
      const bodyRow = tBody.insertRow(rowIndex);
      rowIndex++;
      const box = [
        index.toString(),
        abstractRow.name,
        this.priceConvert.transform(abstractRow.price, 'two', 'none'),
        abstractRow.count,
        this.priceConvert.transform(abstractRow.price * abstractRow.count, 'two', 'none'),
      ];
      index++;
      for (let j = 0; j < box.length; j++) {
        const cell = bodyRow.insertCell(j);
        cell.innerHTML = box[j].toString();
        if (j > 1) {
          cell.style.textAlign = 'right';
        }
        if (j === 0) {
          cell.style.textAlign = 'center';
        }
      }
    }
    if (this.delivery !== '0.00') {
      const deliveryRow = tBody.insertRow(rowIndex);
      rowIndex++;
      const delivery = [index.toString(), 'Доставка', this.delivery, '1', this.delivery];
      index++;
      for (let i = 0; i < this.header.length + 1; i++) {
        const cell = deliveryRow.insertCell(i);
        cell.innerHTML = delivery[i];
        if (i > 1) {
          cell.style.textAlign = 'right';
        }
        if (i === 0) {
          cell.style.textAlign = 'center';
        }
      }
    }
    const amountRow = tBody.insertRow(rowIndex);
    const amountArray = ['', '', 'ИТОГО', this.sum];
    for (let i = 0; i < this.header.length + 1; i++) {
      const cell = amountRow.insertCell(i);
      cell.innerHTML = amountArray[i];
      if (i === 3) {
        cell.colSpan = 2;
      }
      if (i === 2) {
        cell.style.fontWeight = 'bold';
        cell.style.textAlign = 'center';
      } else {
        cell.style.textAlign = 'right';
      }
      cell.style.verticalAlign = 'middle';
    }
    return table;
  }

  private genClientBlock(): HTMLTableElement {
    const clientInfo: string[][] = [];
    if (this.order) {
      clientInfo.push(
        ['ФИО', this.order.clientName],
        ['Email', this.order.clientEmail],
        ['Телефон', this.order.clientPhone],
      );
      if (this.order?.clientAddress !== 'Самовывоз') {
        clientInfo.push(['Адрес доставки:', this.order.clientAddress]);
      }
      if (this.order && this.order.deliveryWishDateFrom && !this.date) {
        const dateFrom = this.dateConvert.transform(this.order.deliveryWishDateFrom, 'dd.MM.yyyy');
        const dateTo = this.dateConvert.transform(this.order.deliveryWishDateTo, 'dd.MM.yyyy');
        clientInfo.push([
          'Дата доставки:',
          `${dateFrom}${this.order.deliveryWishDateTo ? '-' + dateTo : ''}`,
        ]);
      }
    }
    const clientTable: HTMLTableElement = document.createElement('table');
    clientTable.style.border = '0';
    const htHead = clientTable.createTHead();
    const htBody = clientTable.createTBody();
    const row = htHead.insertRow(0);
    const leftCol = row.insertCell(0);
    const rightCol = row.insertCell(1);
    leftCol.style.width = '40%';
    leftCol.style.border = '0';
    rightCol.style.width = '60%';
    rightCol.style.border = '0';
    for (let i = 0; i < clientInfo.length; i++) {
      const abstractRow = clientInfo[i];
      const bodyRow = htBody.insertRow(i);
      for (let j = 0; j < abstractRow.length; j++) {
        const cell = bodyRow.insertCell(j);
        cell.innerHTML = abstractRow[j].toString();
        if (i === 4) {
          cell.style.fontSize = '30px';
        }
        cell.style.border = '0';
      }
    }
    return clientTable;
  }

  public getGeneratedDocument(): Observable<Blob> {
    return this._generatedDocument.asObservable();
  }

  private calculateDiscount(): number {
    let orderDiscount: OrderDiscount = {
      value: 0,
      percent: 0,
    };
    let productSum: number = 0;
    if (this.order) {
      this.order.products.map((product) => {
        const discount = product.product.price - product.price;
        if (discount > 0) {
          orderDiscount.value += discount * product.count;
        }
        productSum += product.price * product.count;
      });
      if (orderDiscount) {
        orderDiscount.percent = Math.round(
          (orderDiscount.value / (orderDiscount.value + productSum)) * 100,
        );
      }
    }
    return orderDiscount.percent;
  }
}

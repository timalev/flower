import { Inject, Injectable } from '@angular/core';
import { HtmlToPdfService } from './html-to-pdf.service';
// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// @ts-ignore
import htmlToPdfmake from 'html-to-pdfmake';
import { Observable, Subject } from 'rxjs';
import { PRICE_CONVERT } from '../../_providers/price-convert.provider';
import { PriceConverterPipe } from '../../_pipes/price-converter.pipe';

@Injectable({
  providedIn: 'root',
})
export class OfferGenerateService {
  private orderNumber!: number;
  private date!: string;
  private client!: string;
  private content!: any[];
  private sum!: number;
  private _generatedDocument: Subject<Blob> = new Subject<Blob>();

  constructor(@Inject(PRICE_CONVERT) private priceConvert: PriceConverterPipe) {}

  public getPDF(
    orderNumber: number,
    date: string,
    client: string,
    content: any[],
    sum: number,
    isOpened: boolean = true,
  ): void {
    this.orderNumber = orderNumber;
    this.date = date;
    this.client = client;
    this.content = content;
    this.sum = sum;
    HtmlToPdfService.getBase64ImageFromURL('assets/images/logo.png').then((logo) => {
      HtmlToPdfService.getBase64ImageFromURL('assets/images/sign.png').then((sign) => {
        const html = htmlToPdfmake(this.generateHTML(logo, sign).innerHTML, {
          tableAutoSize: true,
        });
        const documentDefinition = {
          content: html,
          info: { title: 'Коммерческое предложение' },
        };
        const document = pdfMake.createPdf(documentDefinition);
        if (isOpened) document.open();
        document.getBlob((blob: Blob) => {
          this._generatedDocument.next(blob);
        });
      });
    });
  }

  private generateHTML(logo: unknown, sign: unknown): HTMLElement {
    const div = document.createElement('div');
    const headerTable = OfferGenerateService.genHeaderTable(logo);
    div.append(headerTable);
    const bodyHeaderTable = this.genBodyTitle();
    div.append(bodyHeaderTable);
    const bodyTable = this.genBodyTable();
    div.append(bodyTable);
    const footerTable = OfferGenerateService.genFooterTable(sign);
    div.append(footerTable);
    return div;
  }

  private static genHeaderTable(logo: unknown): HTMLTableElement {
    const img = document.createElement('img');
    if (typeof logo === 'string') {
      img.setAttribute('src', logo);
      img.setAttribute('width', '150');
    }
    const headerTable: HTMLTableElement = document.createElement('table');
    headerTable.style.border = '0';
    const htHead = headerTable.createTHead();
    const htBody = headerTable.createTBody();
    const row = htHead.insertRow(0);
    const leftHead = row.insertCell(0);
    const rightHead = row.insertCell(1);
    leftHead.style.width = '25%';
    leftHead.style.border = '0';
    rightHead.style.width = '75%';
    rightHead.style.border = '0';
    const headerTableBodyRow1 = htBody.insertRow(0);
    const headerTableBodyRow2 = htBody.insertRow(1);
    const headerTableBodyRow3 = htBody.insertRow(2);
    const headerTableBodyRow4 = htBody.insertRow(3);
    const image = headerTableBodyRow1.insertCell(0);
    image.rowSpan = 4;
    image.append(img);
    image.style.border = '0';
    const title = headerTableBodyRow1.insertCell(1);
    title.innerHTML = this.getTitleText();
    title.style.border = '0';
    const address = headerTableBodyRow2.insertCell(0);
    address.innerHTML = this.getAddress();
    address.style.fontSize = '10px';
    address.style.border = '0';
    const contacts = headerTableBodyRow3.insertCell(0);
    contacts.innerHTML = this.getContacts();
    contacts.style.fontSize = '10px';
    contacts.style.border = '0';
    const payment = headerTableBodyRow4.insertCell(0);
    payment.innerHTML = this.getPaymentText();
    payment.style.border = '0';
    payment.style.fontSize = '10px';
    const headerTableBodyLine = htBody.insertRow(4);
    const lineCell = headerTableBodyLine.insertCell(0);
    lineCell.colSpan = 2;
    lineCell.style.borderLeft = '0';
    lineCell.style.borderRight = '0';
    return headerTable;
  }

  private static getPaymentText(): string {
    return `<b>ИП Большаков Олег Валентинович ИНН - 771601384607 ОГРНИП – 307770000627581<br/>
            Адрес - 129323, Москва, ул.Седова, дом 2, корп.2, оф.56<br/>
            БИК - 044525225 Банк - ПАО Сбербанк г. Москва Р/С – 40802810277010000460 К/С - 30101810145250000411</b>`;
  }

  private static getTitleText(): string {
    const title = document.createElement('b');
    title.innerHTML = `Агрофирма Цветочная Долина<br/>`;
    title.style.fontSize = '20px';
    const subTitle = document.createElement('span');
    subTitle.innerHTML = 'Тепличное хозяйство';
    subTitle.style.color = 'grey';
    const returned = document.createElement('div');
    returned.append(title, subTitle);
    return returned.innerHTML;
  }

  private static getContacts(): string {
    return `<b>Почта - flowervalley@mail.ru  Тел. – +7 (915) 109 10 00</b>`;
  }

  private static getAddress(): string {
    return `<b>Адрес - 140125, Моск. обл., Раменский р-н., д. Островцы, ул. Подмосковная д. 22 A теплица 109</b>`;
  }

  private genBodyTitle(): HTMLTableElement {
    const headerTitleTable = document.createElement('table');
    const head = headerTitleTable.createTHead();
    const body = headerTitleTable.createTBody();
    const row = head.insertRow(0);
    const headCell = row.insertCell(0);
    headCell.style.width = '100%';
    headCell.style.border = '0';
    const offerNumberRow = body.insertRow(0);
    const offerNumberCell = offerNumberRow.insertCell(0);
    offerNumberCell.innerHTML = `<b>№${this.orderNumber} от ${this.date}</b>`;
    offerNumberCell.style.border = '0';
    OfferGenerateService.insertSpaceRow(1, body, 1);
    const offerClientRow = body.insertRow(2);
    const offerClientCell = offerClientRow.insertCell(0);
    offerClientCell.innerHTML = `<b>${this.client}</b>`;
    offerClientCell.style.border = '0';
    OfferGenerateService.insertSpaceRow(4, body, 3);
    const offerTitleRow = body.insertRow(4);
    const offerTitleCell = offerTitleRow.insertCell(0);
    offerTitleCell.innerHTML = `<b>Коммерческое предложение</b>`;
    offerTitleCell.style.border = '0';
    offerTitleCell.style.fontSize = '24px';
    offerTitleCell.style.textAlign = 'center';
    OfferGenerateService.insertSpaceRow(1, body, 5);
    const offerTextRow = body.insertRow(6);
    const offerTextCell = offerTextRow.insertCell(0);
    offerTextCell.innerHTML =
      'Мы готовы поставить следующие товары, исходя из списка Вашей заявки.';
    offerTextCell.style.border = '0';
    offerTextCell.style.fontSize = '14px';
    offerTextCell.style.textAlign = 'center';
    OfferGenerateService.insertSpaceRow(1, body, 7);
    return headerTitleTable;
  }

  private genBodyTable(): HTMLTableElement {
    const header = ['№', 'Товар', 'Ед.', 'Кол-во', 'Цена, \u20bd', 'Сумма, \u20bd'];
    const table: HTMLTableElement = document.createElement('table');
    const tHead = table.createTHead();
    const tBody = table.createTBody();
    const headerRow = tHead.insertRow(0);
    for (let i = 0; i < header.length; i++) {
      const cell = headerRow.insertCell(i);
      cell.innerHTML = header[i];
      switch (i) {
        case 0:
          cell.style.width = '5%';
          break;
        case 1:
          cell.style.width = '45%';
          break;
        case 2:
          cell.style.width = '5%';
          break;
        case 3:
          cell.style.width = '10%';
          break;
        default:
          cell.style.width = '17.5%';
          break;
      }
      cell.style.textAlign = 'center';
      cell.style.fontWeight = 'bold';
    }
    for (let i = 0; i < this.content.length; i++) {
      const abstractRow = this.content[i];
      const bodyRow = tBody.insertRow(i);
      const index = bodyRow.insertCell(0);
      index.innerHTML = `${i + 1}`;
      index.style.textAlign = 'center';
      for (let j = 0; j < abstractRow.length; j++) {
        const cell = bodyRow.insertCell(j + 1);
        cell.innerHTML = `${abstractRow[j]}`;
        if (j > 0) {
          cell.style.textAlign = 'center';
        }
      }
    }
    const lastRow = tBody.insertRow(this.content.length);
    const emptyCell = lastRow.insertCell(0);
    emptyCell.colSpan = 4;
    emptyCell.style.border = '0';
    const labelCell = lastRow.insertCell(1);
    labelCell.innerHTML = `<b>Итого:</b>`;
    const sumCell = lastRow.insertCell(2);
    sumCell.innerHTML = this.priceConvert.transform(this.sum, 'two', 'rub');
    sumCell.style.textAlign = 'center';
    return table;
  }

  private static genFooterTable(sign: unknown) {
    const img = document.createElement('img');
    if (typeof sign === 'string') {
      img.setAttribute('src', sign);
      img.setAttribute('width', '600');
    }
    const footerTable: HTMLTableElement = document.createElement('table');
    footerTable.style.border = '0';
    const ftHead = footerTable.createTHead();
    const ftBody = footerTable.createTBody();
    const headRow = ftHead.insertRow(0);
    const headCell = headRow.insertCell(0);
    headCell.style.width = '100%';
    headCell.style.border = '0';
    const signRow = ftBody.insertRow(0);
    const signCell = signRow.insertCell(0);
    signCell.style.border = '0';
    signCell.style.textAlign = 'center';
    signCell.append(img);
    return footerTable;
  }

  private static insertSpaceRow(
    spaces: number,
    section: HTMLTableSectionElement,
    index: number,
    colSpan?: number,
  ) {
    const spaceRow = section.insertRow(index);
    const spaceCell = spaceRow.insertCell(0);
    if (colSpan) spaceCell.colSpan = colSpan;
    spaceCell.style.border = '0';
    let space = '';
    for (let i = 0; i < spaces; i++) {
      space += `<br/>`;
    }
    spaceCell.innerHTML = space;
  }

  public getGeneratedDocument(): Observable<Blob> {
    return this._generatedDocument.asObservable();
  }
}

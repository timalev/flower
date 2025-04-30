import { Inject, Injectable } from '@angular/core';
// @ts-ignore
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
// @ts-ignore
import htmlToPdfmake from 'html-to-pdfmake';
import { HtmlToPdfService } from './html-to-pdf.service';
import { Category } from '../../_models/category';
import { Product } from '../../_models/product';
import { ProductService } from '../back/product.service';
import { CatalogService } from '../back/catalog.service';
import { forkJoin, Observable, Subject } from 'rxjs';
import { DISCOUNT } from '../../_providers/discount.provider';
import { DiscountService } from '../back/discount.service';
import { Discount } from '../../_models/discount';
import { PRICE_CONVERT } from '../../_providers/price-convert.provider';
import { PriceConverterPipe } from '../../_pipes/price-converter.pipe';
import { PriceList } from '../../_models/static-data/price-list';
import { STATIC_DATA } from '../../_providers/static-data.provider';
import { StaticDataService } from '../back/static-data.service';
import { Header } from '../../_models/static-data/header';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PriceListGenerateService {
  private header!: string[];
  private headerContent: Header | undefined;
  private content!: any[];
  private _generatedDocument: Subject<Blob> = new Subject<Blob>();
  private discount: Discount[] = [];
  private hasDiscountColumns: boolean = false;
  private topText: string | undefined;
  private bottomText: string | undefined;

  constructor(
    @Inject(DISCOUNT) private discountService: DiscountService,
    @Inject(PRICE_CONVERT) private priceConvert: PriceConverterPipe,
    @Inject(STATIC_DATA) private staticData: StaticDataService,
    private productService: ProductService,
    private catalogService: CatalogService,
  ) {}

  public generatePriceList(categories?: Category[], products?: Product[], text?: PriceList): void {
    this.hasDiscountColumns = false;
    this.staticData.getPriceListHeaders().subscribe((priceListHeaders) => {
      const headers = [
        '№',
        priceListHeaders.name || 'Товар',
        priceListHeaders.pack || 'Тара',
        priceListHeaders.price || 'Цена за шт.',
      ];
      const pricesContent: any[] = [];
      this.staticData.getHeaderContent().subscribe((header) => {
        this.headerContent = header;
        this.discountService.getItems().subscribe((items) => {
          this.discount = items.filter((item) => item.addToPriceList).sort((a, b) => a.sum - b.sum);
          if (this.discount.length == 2) {
            const lowSum = this.priceConvert.transform(this.discount[0].sum, 'none', 'RUB');
            const highSum = this.priceConvert.transform(this.discount[1].sum, 'none', 'RUB');
            headers.push(`Малый опт (от ${lowSum})`, `Крупный опт (от ${highSum})`);
            this.hasDiscountColumns = true;
          }
          if (categories && products && text) {
            categories
              .sort((a, b) => a.id - b.id)
              .map((category) => {
                pricesContent.push([category.name], ...this.sortProducts(products, category));
              });
            this.topText = text.textTop;
            this.bottomText = text.textBottom;
            this.getPDF(headers, pricesContent);
          } else {
            const requests = [
              this.productService.getItems(),
              this.catalogService.getItems(),
              this.staticData.getPriceListText(),
            ];
            forkJoin(requests).subscribe(([loadedProducts, loadedCategories, loadedText]) => {
              (loadedCategories as Category[])
                .sort((a, b) => a.id - b.id)
                .filter((category) => category.id !== 1)
                .filter((category) => !category.parentId)
                .map((category) => {
                  pricesContent.push(
                    [category.name],
                    ...this.sortProducts(loadedProducts as Product[], category),
                  );
                });
              this.topText = (loadedText as PriceList).textTop;
              this.bottomText = (loadedText as PriceList).textBottom;
              this.getPDF(headers, pricesContent);
            });
          }
        });
      });
    });
  }

  private getPDF(header: string[], content: any[]): void {
    this.header = header;
    this.content = content;
    HtmlToPdfService.getBase64ImageFromURL(
      this.headerContent && this.headerContent.img && environment.production
        ? this.headerContent.img
        : 'assets/images/logo.png',
    ).then((res) => {
      const html = htmlToPdfmake(this.generateHTML(res).innerHTML, {
        tableAutoSize: true,
      });
      const documentDefinition = {
        content: html,
        info: { title: 'Прайс-лист Агрофирма Цветочная Долина' },
        pageOrientation: this.hasDiscountColumns ? 'landscape' : 'portrait',
        styles: {
          'ql-align-center': {
            alignment: 'center',
          },
          'ql-align-right': {
            alignment: 'right',
          },
        },
      };
      const document = pdfMake.createPdf(documentDefinition);
      
	  document.download('price-list.pdf');
	  //document.open();
     /*
	  document.getBlob((blob: Blob) => {
        this._generatedDocument.next(blob);
      });
	  */
    });
  }

  private generateHTML(imgSrc: unknown): HTMLElement {
    const div = document.createElement('div');
    const headerTable = HtmlToPdfService.genHeaderTable(
      imgSrc,
      this.hasDiscountColumns,
      this.headerContent,
    );
    div.append(headerTable);
    if (this.topText) {
      const topText = this.genTextTable(this.topText);
      div.append(topText);
    }
    const h2 = document.createElement('h2');
    h2.innerText = 'Прайс-лист';
    h2.style.textAlign = 'center';
    h2.style.margin = '0 0 20px 0';
    div.append(h2);
    const table = this.genMainTable();
    div.append(table);
    if (this.bottomText) {
      const bottomText = this.genTextTable(this.bottomText);
      div.append(bottomText);
    }
    return div;
  }

  private genTextTable(text: string): HTMLTableElement {
    const table: HTMLTableElement = document.createElement('table');
    const tHead = table.createTHead();
    const tBody = table.createTBody();
    const headerRow = tHead.insertRow(0);
    const headerCell = headerRow.insertCell(0);
    headerCell.style.width = '100%';
    const bodyRow = tBody.insertRow(0);
    const bodyCell = bodyRow.insertCell(0);
    bodyCell.innerHTML = text;
    table.style.border = '0';
    headerCell.style.border = '0';
    bodyCell.style.border = '0';
    return table;
  }

  private genMainTable(): HTMLTableElement {
    const table: HTMLTableElement = document.createElement('table');
    const tHead = table.createTHead();
    const tBody = table.createTBody();
    const headerRow = tHead.insertRow(0);
    for (let i = 0; i < this.header.length; i++) {
      const cell = headerRow.insertCell(i);
      cell.innerHTML = this.header[i];
      if (i === 0) {
        cell.style.width = '5%';
        cell.style.textAlign = 'center';
      } else if (i === 1) {
        cell.style.width = '55%';
      } else {
        cell.style.width = this.hasDiscountColumns ? '10%' : '20%';
        cell.style.textAlign = 'center';
      }
    }
    let count = 0;
    for (let i = 0; i < this.content.length; i++) {
      const abstractRow = this.content[i];
      const bodyRow = tBody.insertRow(i);
      const numberCell = bodyRow.insertCell(0);
      numberCell.style.textAlign = 'center';
      if (abstractRow.length !== 1) {
        count++;
        numberCell.innerHTML = count.toString();
      }
      for (let j = 0; j < abstractRow.length; j++) {
        const cell = bodyRow.insertCell(j + 1);
        cell.innerHTML = abstractRow[j];
        if (abstractRow.length === 1) {
          cell.colSpan = this.hasDiscountColumns ? 5 : 3;
          cell.style.textTransform = 'uppercase';
          cell.style.fontSize = '30px';
          cell.style.height = '40px';
        }
        if (j > 0) {
          cell.style.textAlign = 'right';
        }
      }
    }
    return table;
  }

  public getGeneratedDocument(): Observable<Blob> {
    return this._generatedDocument.asObservable();
  }

  private sortProducts(products: Product[], category: Category) {
    return products
      .filter((item) => Number(item.discountCategoryId) === category.id)
      .map((item) => {
        if (this.hasDiscountColumns) {
          const lowSale = item.price - (item.price / 100) * this.discount[0].discount;
          const highSale = item.price - (item.price / 100) * this.discount[1].discount;
          if (!category.hasNoDiscount) {
            return [
              item.name,
              item.coefficient,
              this.priceConvert.transform(item.price, 'two', 'none'),
              this.priceConvert.transform(lowSale, 'two', 'none'),
              this.priceConvert.transform(highSale, 'two', 'none'),
            ];
          }
          return [
            item.name,
            item.coefficient,
            this.priceConvert.transform(item.price, 'two', 'none'),
            '-',
            '-',
          ];
        }
        return [
          item.name,
          item.coefficient,
          this.priceConvert.transform(item.price, 'two', 'none'),
        ];
      })
      .sort((a, b) => {
        if (
          (a[0] as string).split(' ').join('').toLowerCase() >
          (b[0] as string).split(' ').join('').toLowerCase()
        )
          return 1;
        if (
          (a[0] as string).split(' ').join('').toLowerCase() <
          (b[0] as string).split(' ').join('').toLowerCase()
        )
          return -1;
        return 0;
      });
  }
}

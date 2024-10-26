import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../_services/back/order.service';
import { Order } from '../../../_models/order';
import { OfferGenerateService } from '../../../_services/front/offer-generate.service';
import { BusinessPackService } from '../../../_services/back/business-paсk.service';
import { ProductService } from '../../../_services/back/product.service';
import { PRICE_CONVERT } from '../../../_providers/price-convert.provider';
import { PriceConverterPipe } from '../../../_pipes/price-converter.pipe';
import { MessageService } from 'primeng/api';
import { StaticDataService } from '../../../_services/back/static-data.service';
import { DownloadInvoice } from '../../../_models/static-data/cart';
import { LoadingService } from '../../../_services/front/loading.service';

@Component({
  selector: 'flower-valley-download-invoice',
  templateUrl: './download-invoice.component.html',
  styleUrls: ['./download-invoice.component.scss'],
  providers: [OfferGenerateService],
})
export class DownloadInvoiceComponent implements OnInit {
  public window = window;
  public telepakId: string = '';
  public order: Order | undefined;
  public isFirmLoading: boolean = false;
  public content: DownloadInvoice | undefined;
  constructor(
    @Inject(PRICE_CONVERT) private priceConvert: PriceConverterPipe,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private offerService: OfferGenerateService,
    private productService: ProductService,
    private staticData: StaticDataService,
    private bpService: BusinessPackService,
    private ls: LoadingService,
    private ms: MessageService,
  ) {
    route.queryParams.subscribe((params) => {
      this.telepakId = params['invoice'];
      const orderNumber = params['order'];
      orderService.getItemById<Order>(orderNumber).subscribe((order) => {
        this.order = order;
      });
    });
  }

  ngOnInit(): void {
    const sub = this.staticData.getDownloadInvoiceContent().subscribe((data) => {
      this.content = data;
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }

  public getOffer(): void {
    this.isFirmLoading = true;
    this.bpService.getFirmById(this.order?.clientId || '').subscribe(
      (firm) => {
        let client = '';
        client += firm.FullName;
        client += `, ${firm.Address}`;
        client += `, ИНН: ${firm.INN}`;
        if (firm.KPP) {
          client += `, КПП: ${firm.KPP}`;
        }
        // @ts-ignore
        const orderNumber = this.order.id;
        // @ts-ignore
        const date = new Date(this.order.orderDate).toLocaleDateString() + 'г.';
        let sum: number = 0;
        // @ts-ignore
        const content: any[] = this.order.products.map((product) => {
          sum += product.count * product.price;
          return [
            product.product.name,
            'шт.',
            product.count,
            this.priceConvert.transform(product.price, 'two', 'none'),
            this.priceConvert.transform(product.count * product.price, 'two', 'none'),
          ];
        });
        if (this.order?.deliveryPrice) {
          sum += this.order.deliveryPrice;
          content.push([
            'Доставка',
            '-',
            1,
            this.priceConvert.transform(this.order.deliveryPrice, 'two', 'none'),
            this.priceConvert.transform(this.order.deliveryPrice, 'two', 'none'),
          ]);
        }
        this.isFirmLoading = false;
        this.offerService.getPDF(orderNumber, date, client, content, sum);
      },
      () => {
        this.isFirmLoading = false;
        this.ms.add({
          severity: 'error',
          summary: 'Ошибка сервера',
          detail: 'При получении данных произошла ошибка',
        });
      },
    );
  }
}

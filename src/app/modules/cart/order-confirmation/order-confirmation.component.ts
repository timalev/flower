import { ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DestroyService } from '../../../_services/front/destroy.service';
import { debounceTime, forkJoin, map, Observable, of, takeUntil } from 'rxjs';
import { YaMapService } from '../../../_services/front/ya-map.service';
import { BusinessPackService } from '../../../_services/back/business-paсk.service';
import { ProductItem } from '../../../_models/product-item';
import { Message, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { isFormInvalid } from '../../../_utils/formValidCheck';
import { Invoice } from '../../../_models/business-pack/invoice';
import { GoodsInvoice } from '../../../_models/business-pack/goods-invoice';
import { CartService } from '../../../_services/front/cart.service';
import { ProductService } from '../../../_services/back/product.service';
import { Order, OrderItem } from '../../../_models/order';
import { BoxGenerateService } from '../../../_services/front/box-generate.service';
import { OrderService } from '../../../_services/back/order.service';
import { MailService } from '../../../_services/back/mail.service';
import { DocumentGenerateService } from '../../../_services/front/document-generate.service';
import { Firm, Individual } from '../../../_models/business-pack/firm';
import { orderWarnMessage } from '../../../_utils/constants';
import { CartVariables } from '../../../_models/static-data/variables';
import { OrderStatus } from '../../../_utils/order-status.enum';

@Component({
  selector: 'flower-valley-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss'],
  providers: [DestroyService, YaMapService, DocumentGenerateService],
})
export class OrderConfirmationComponent implements OnDestroy {
  @Input()
  public cartVariables: CartVariables | undefined;
  public goods: ProductItem[] = [];
  public clientType: 'individual' | 'entity' = 'individual';
  public pickUp: FormControl;
  public deliveryDate: FormControl;
  public comment: FormControl;
  public currentDate = new Date();
  public contacts: FormGroup;
  public entityData!: FormGroup;
  private entityId: string | undefined;
  public shippingCost: number | undefined = 0;
  public delivery_error: string = '';
  public showDelivery = false;
  public orderId: number | undefined;
  public order: Order | undefined;
  public clientDataVerified: boolean = false;
  public isInvoiceLoading: boolean = false;
  private isEntityDataChanged: boolean = false;
  public isOrderConfirmed: boolean = false;
  public message: Message[] = [];

  constructor(
    private fb: FormBuilder,
    private $destroy: DestroyService,
    private yaMap: YaMapService,
    private cdr: ChangeDetectorRef,
    private bpService: BusinessPackService,
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private boxService: BoxGenerateService,
    private mailService: MailService,
    private documentService: DocumentGenerateService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.pickUp = fb.control(false);
    this.deliveryDate = fb.control(null);
    this.comment = fb.control('');
    this.contacts = fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      deliveryWishDateFrom: [''],
      deliveryWishDateTo: [''],
      comment: [''],
      orderSum: [null, Validators.required],
    });
    this.contacts.controls['address'].valueChanges
      .pipe(takeUntil($destroy), debounceTime(1000))
      .subscribe((address) => {
        this.shippingCost = 0;
        this.showDelivery = false;
        this.delivery_error = '';
        if (address) {
          yaMap.addressChanged.next(address);
        } else {
          cdr.detectChanges();
        }
      });
    yaMap
      .calculateShippingCost()
      .pipe(takeUntil(this.$destroy))
      .subscribe((calculationResult) => {
        this.shippingCost = calculationResult;
        if (this.shippingCost === 0) {
          this.delivery_error = 'Адрес не найден';
        }
        this.cdr.detectChanges();
      });
    if (this.cartService.isTulipsInclude) {
      this.pickUp.setValue(true);
      this.pickUp.disable();
      this.contacts.controls['address'].disable();
    }
    this.pickUp.valueChanges.subscribe((value) => {
      if (value) {
        this.shippingCost = 0;
        this.showDelivery = false;
        this.contacts.controls['address'].setValue('');
        this.contacts.controls['address'].disable();
      } else {
        this.contacts.controls['address'].enable();
      }
    });
    this.deliveryDate.valueChanges.subscribe((dates: Date[] | null) => {
      this.contacts.controls['deliveryWishDateFrom'].setValue(dates ? dates[0] : null);
      this.contacts.controls['deliveryWishDateTo'].setValue(dates ? dates[0] : null);
    });
    this.comment.valueChanges.subscribe((comment: string) => {
      this.contacts.controls['comment'].setValue(comment);
    });
    this.cartService.cartUpdate().subscribe((goods) => {
      this.goods = goods;
    });
  }

  public ngOnDestroy(): void {
    if (this.isOrderConfirmed) {
      this.cartService.clearCart();
      this.message = [];
    }
  }

  public deliveryButtonClick(): void {
    this.showDelivery = true;
    this.cdr.detectChanges();
  }

  public get isConfirmOrderDisabled(): boolean {
    if (this.contacts.invalid) return true;
    if (this.contacts.getRawValue().address && !this.pickUp.value) {
      return !(this.showDelivery || (!this.showDelivery && this.shippingCost === undefined));
    }
    return !(!this.contacts.getRawValue().address && this.pickUp.value);
  }

  public confirmOrder(): void {
    if (isFormInvalid(this.contacts)) return;
    if (this.isConfirmOrderDisabled) return;
    const order = this.getOrderData();
    if (this.clientType === 'entity') {
      if (isFormInvalid(this.entityData)) return;
      this.isInvoiceLoading = true;
      this.messageService.add(orderWarnMessage);
      this.entityData.disable();
      if (order.deliveryPrice === this.cartVariables?.moscowDelivery || this.pickUp.value) {
        this.createBusinessInvoice(order);
      } else {
        order.status = OrderStatus.Calculate_Delivery;
        this.getPartner().subscribe(({ partnerId, inn }) => {
          order.clientId = partnerId;
          order.clientInn = inn;
          this.createOrder(order);
        });
      }
    } else {
      this.isInvoiceLoading = true;
      this.messageService.add(orderWarnMessage);
      if (order.deliveryPrice === this.cartVariables?.moscowDelivery || this.pickUp.value) {
        this.createIndividualInvoice(order);
      } else {
        order.status = OrderStatus.Calculate_Delivery;
        this.createOrder(order);
      }
    }
  }

  private createOrder(order: Order): void {
    this.orderService.addItem(order).subscribe(
      (id: number) => {
        this.orderId = id;
        this.sendBusinessNotification(id);
      },
      ({ error }) => {
        this.isInvoiceLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Что-то пошло не так',
          detail: error.message,
        });
      },
      () => {
        this.isInvoiceLoading = false;
      },
    );
  }

  private createIndividualInvoice(order: Order): void {
    this.createIndividualEntity(order).subscribe((partnerId) => {
      this.createInvoice(order, partnerId, false);
    });
  }

  private createBusinessInvoice(order: Order): void {
    this.getPartner().subscribe(({ partnerId, inn }) => {
      order.clientId = partnerId;
      order.clientInn = inn;
      this.createInvoice(order, partnerId, true);
    });
  }

  private createInvoice(order: Order, partnerId: string, isBusiness: boolean): void {
    order.clientId = partnerId;
    const firmId = this.bpService.selfId;
    const goods: GoodsInvoice[] = [];
    this.orderService.generateInvoiceGoods(this.goods).map((product) => {
      goods.push({
        volume_id: product.volume || '',
        model_name: product.name,
        qname: product.name,
        nds: 0,
        nds_mode: 0,
        count: product.count,
        price: product.price,
      });
    });
    this.orderService.generateInvoiceBoxes(order.boxes || []).map((box) => {
      goods.push({
        model_id: this.bpService.boxId,
        volume_id: this.bpService.boxVolume,
        nds: 0,
        nds_mode: 0,
        count: box.count,
        price: box.price,
        qname: box.name,
      });
    });
    if (order.deliveryPrice) {
      goods.push({
        model_id: this.bpService.deliveryId,
        volume_id: this.bpService.deliveryVolume,
        nds: 0,
        nds_mode: 0,
        count: 1,
        price: order.deliveryPrice,
        qname: 'Доставка',
      });
    }
    const invoice: Invoice = {
      firm_id: firmId,
      partner_id: partnerId,
      goods: goods,
      partner_flag: 'A',
    };
    this.bpService.createInvoice(invoice).subscribe((response) => {
      const invoiceId = response.Object;
      order.invoiceId = invoiceId;
      this.bpService
        .sendInvoiceToTelepak(invoiceId, {
          report_name: 'Счет с образцом п. п. + печать подпись',
          send_with_stamp: true,
        })
        .subscribe(({ id }) => {
          if (id) {
            order.accountNumber = id;
            if (!order.deliveryPrice && !this.pickUp.value) {
              order.status = OrderStatus.Calculate_Delivery;
            }
            this.orderService.addItem(order).subscribe((orderId) => {
              this.sendInvoiceMail(invoiceId, partnerId, orderId, isBusiness);
            });
          }
        });
    });
  }

  private getPartner(): Observable<{ partnerId: string; inn: string }> {
    if (this.entityId) {
      if (this.isEntityDataChanged) {
        return this.bpService
          .updateFirm({ ...this.entityData.getRawValue(), Object: this.entityId })
          .pipe(
            map((firm) => {
              return {
                partnerId: firm.Object,
                inn: this.entityData.getRawValue().INN,
              };
            }),
          );
      } else return of({ partnerId: this.entityId, inn: this.entityData.getRawValue().INN });
    } else {
      return this.bpService.createFirm(this.entityData.getRawValue()).pipe(
        map((firm) => {
          return {
            partnerId: firm.Object,
            inn: this.entityData.getRawValue().INN,
          };
        }),
      );
    }
  }

  public createIndividualEntity(order: Order): Observable<string> {
    const entity = this.contacts.getRawValue();
    return this.bpService
      .createFirm({
        FullName: entity.name,
        Address: `${entity.address ? entity.address + ',' : ''} ${entity.phone}, ${entity.email}`,
      } as Individual)
      .pipe(
        map((firm) => {
          order.clientId = firm.Object;
          return firm.Object;
        }),
      );
  }

  public entityDataChanges(data: FormGroup | { id: string; isChanged: boolean }): void {
    if (OrderConfirmationComponent.instanceOfId(data)) {
      this.entityId = data.id;
      this.isEntityDataChanged = data.isChanged;
    } else {
      this.entityData = data;
      if (!this.isEntityDataChanged) this.entityId = undefined;
    }
  }

  private static instanceOfId(data: any): data is { id: string; isChanged: boolean } {
    return 'id' in data;
  }

  public setClientType(i: number): void {
    if (i === 0) {
      this.clientType = 'individual';
    }
    if (i === 1) {
      this.clientType = 'entity';
    }
  }

  private getOrderData(): Order {
    const contacts = this.contacts.getRawValue();
    const products: OrderItem[] = [];
    this.goods.map((product) => {
      products.push(<OrderItem>{
        id: product.id,
        price: product.price,
        count: product.count,
      });
    });
    let orderBoxes: OrderItem[] = [];
    this.boxService.getBoxes().subscribe((boxes) => {
      boxes.map((box) => {
        orderBoxes.push(<OrderItem>{
          id: box.id,
          price: box.price,
          count: box.count,
        });
      });
    });
    const order = {
      clientEmail: contacts.email,
      clientName: contacts.name,
      clientPhone: contacts.phone,
      clientAddress: contacts.address ? contacts.address : 'Самовывоз',
      comment: contacts.comment,
      deliveryWishDateFrom: contacts.deliveryWishDateFrom
        ? contacts.deliveryWishDateFrom.toISOString()
        : null,
      deliveryWishDateTo: contacts.deliveryWishDateTo
        ? contacts.deliveryWishDateTo.toISOString()
        : null,
      orderSum: contacts.orderSum,
      products: products,
      boxes: orderBoxes,
      deliveryPrice: 0,
    };
    if (this.shippingCost) order.deliveryPrice = this.shippingCost;
    return <Order>order;
  }

  public setOrderSum(sum: number): void {
    this.contacts.controls['orderSum'].setValue(sum);
  }

  private sendInvoiceMail(
    invoiceId: string,
    firmId: string,
    orderId: number,
    isBusiness: boolean,
  ): void {
    const requests = [
      this.bpService.getInvoiceById(invoiceId),
      this.bpService.getFirmById(firmId),
      this.orderService.getItemById<Order>(orderId),
    ];
    forkJoin(requests).subscribe(([invoice, firm, orderItem]) => {
      invoice = invoice as any;
      firm = firm as Firm;
      const order = orderItem as Order;
      const formData = new FormData();
      formData.append('billNumber', invoice.Name);
      formData.append('billDate', invoice.Date);
      // @ts-ignore
      formData.append('accountNumber', order.accountNumber);
      formData.append('email', order.clientEmail);
      formData.append('orderId', orderId.toString());
      if (isBusiness) {
        const docSub = this.documentService.getOffer(order, firm).subscribe((file) => {
          docSub.unsubscribe();
          formData.append('file', file);
          this.mailService.sendBusinessMail(formData, order, firm.FullName).subscribe(() => {
            this.messageService.clear();
            this.messageService.add({
              severity: 'success',
              summary: `Заявка №${orderId} принята`,
              detail: `Инструкции с дальнейшими действиями отправлены на почту ${order.clientEmail}`,
              life: 10000,
            });
            this.isInvoiceLoading = false;
            this.isOrderConfirmed = true;
            this.router.navigate(['download-invoice'], {
              relativeTo: this.route,
              queryParams: {
                invoice: order.accountNumber,
                order: orderId,
              },
            });
          });
        });
      } else {
        this.mailService.sendIndividualMail(formData, order).subscribe(() => {
          this.messageService.clear();
          const message: Message = {
            severity: 'success',
            summary: 'Заказ оформлен',
            detail: `Данные заказа №${orderId} отправлены на почту ${order.clientEmail}`,
            life: 10000,
            key: 'orderMessage',
          };
          this.messageService.add(message);
          this.isInvoiceLoading = false;
          this.isOrderConfirmed = true;
        });
      }
    });
  }

  private sendBusinessNotification(orderId: number): void {
    this.orderService.getItemById<Order>(orderId).subscribe((order) => {
      this.mailService.sendBusinessNotificationMail(order).subscribe(() => {
        this.messageService.clear();
        this.messageService.add({
          severity: 'success',
          summary: `Заявка №${orderId} принята`,
          detail: `Вам на почту отправлена инструкция с дальнейшими действиями`,
          life: 10000,
          key: 'orderMessage',
        });
        this.isInvoiceLoading = false;
        this.isOrderConfirmed = true;
      });
    });
  }

  public get shippingCostInput(): number | undefined {
    if (this.showDelivery || this.shippingCost === undefined) return this.shippingCost;
    return 0;
  }
}

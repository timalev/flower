import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../../../_services/back/order.service';
import { Order, OrderBox, OrderItem, OrderProduct } from '../../../../../_models/order';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isFormInvalid } from '../../../../../_utils/formValidCheck';
import { forkJoin, map, Observable, of } from 'rxjs';
import { LoadingService } from '../../../../../_services/front/loading.service';
import { BusinessPackService } from '../../../../../_services/back/business-paсk.service';
import { Firm } from '../../../../../_models/business-pack/firm';
import { MessageService } from 'primeng/api';
import { GoodsInvoice } from '../../../../../_models/business-pack/goods-invoice';
import { Invoice } from '../../../../../_models/business-pack/invoice';
import { ProductService } from '../../../../../_services/back/product.service';
import { MailService } from '../../../../../_services/back/mail.service';
import { DocumentGenerateService } from '../../../../../_services/front/document-generate.service';

@Component({
  selector: 'flower-valley-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss'],
  providers: [DocumentGenerateService],
})
export class NewOrderComponent implements OnInit {
  private orderId: number | undefined;
  public order: Order | undefined;
  public products: OrderProduct[] = [];
  public boxes: OrderBox[] = [];
  public entity: Firm | undefined;
  public entityData!: FormGroup;
  private entityId: string | undefined;
  private isEntityDataChanged: boolean = false;
  public contactsGroup: FormGroup;
  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private bpService: BusinessPackService,
    private mailService: MailService,
    private documentService: DocumentGenerateService,
    private fb: FormBuilder,
    private ls: LoadingService,
    private route: ActivatedRoute,
    private router: Router,
    private ms: MessageService,
  ) {
    this.contactsGroup = fb.group({
      requestNumber: [''],
      clientName: ['', Validators.required],
      clientPhone: ['', Validators.required],
      clientEmail: ['', Validators.required],
      clientAddress: [''],
      deliveryPrice: [0],
    });
    route.queryParams.subscribe((params) => {
      this.orderId = params['orderId'];
    });
  }

  ngOnInit(): void {
    if (this.orderId) {
      const sub = this.orderService.getItemById<Order>(this.orderId).subscribe((order) => {
        this.products = order.products;
        this.boxes = order.boxes;
        this.order = order;
        this.contactsGroup.patchValue(order);
        if (order.clientId) {
          const bpSub = this.bpService.getFirmById(order.clientId).subscribe((firm) => {
            this.entity = firm;
            this.ls.removeSubscription(bpSub);
          });
          this.ls.addSubscription(bpSub);
        }
        this.ls.removeSubscription(sub);
      });
      this.ls.addSubscription(sub);
    }
  }

  public entityDataChanges(data: FormGroup | { id: string; isChanged: boolean }): void {
    if (NewOrderComponent.instanceOfId(data)) {
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

  public createOrder(): void {
    if (isFormInvalid(this.contactsGroup)) return;
    const order = this.getOrderData();
    if (order.requestNumber || this.order?.clientId) {
      if (isFormInvalid(this.entityData)) return;
      this.entityData.disable();
      this.createInvoice(order);
    } else {
      const products: OrderItem[] = [];
      order.products.map((product: any) => {
        products.push(<OrderItem>{
          id: product.product.id,
          count: product.count,
          price: product.price,
        });
      });
      const sub = this.orderService.addItem({ ...order, products: products }).subscribe(
        (orderId) => {
          this.sendIndividualMail(orderId);
          this.ls.removeSubscription(sub);
        },
        ({ error }) => {
          this.ms.add({
            severity: 'error',
            summary: 'Что-то пошло не так',
            detail: error.message,
          });
        },
      );
      this.ls.addSubscription(sub);
    }
  }

  private getOrderData(): Order {
    const contacts = this.contactsGroup.getRawValue();
    let orderBoxes: OrderItem[] = [];
    this.boxes.map((box) => {
      orderBoxes.push(<OrderItem>{
        id: box.box.id,
        price: box.price,
        count: box.count,
      });
    });
    const order = <Order>{
      clientEmail: contacts.clientEmail,
      clientName: contacts.clientName,
      clientPhone: contacts.clientPhone,
      clientAddress: contacts.clientAddress ? contacts.clientAddress : 'Самовывоз',
      products: this.products,
      boxes: orderBoxes,
      deliveryPrice: contacts.deliveryPrice,
      orderSum: this.getOrderSum(),
    };
    if (contacts.requestNumber) order.requestNumber = contacts.requestNumber;
    return <Order>order;
  }

  private createInvoice(order: Order): void {
    this.getPartner().subscribe(({ partnerId, inn }) => {
      if (partnerId) {
        order.clientId = partnerId;
        order.clientInn = inn;
        const firmId = this.bpService.selfId;
        const goods: GoodsInvoice[] = [];
        // @ts-ignore
        this.order.products.map((product) => {
          if (product.product.id && product.product.volume) {
            goods.push({
              model_id: product.product.id,
              volume_id: product.product.volume,
              nds: 0,
              nds_mode: 0,
              count: product.count,
              price: product.price,
              qname: product.product.name,
            });
          }
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
        const invoiceSub = this.bpService.createInvoice(invoice).subscribe((response) => {
          const invoiceId = response.Object;
          const sendSub = this.bpService
            .sendInvoiceToTelepak(invoiceId, {
              report_name: 'Счет с образцом п. п. + печать подпись',
              send_with_stamp: true,
            })
            .subscribe(({ id }) => {
              if (id) {
                order.accountNumber = id;
                const products: OrderItem[] = [];
                order.products.map((product: any) => {
                  products.push(<OrderItem>{
                    id: product.product.id,
                    count: product.count,
                    price: product.price,
                  });
                });
                const orderSub = this.orderService
                  .addItem({ ...order, products: products })
                  .subscribe((orderId) => {
                    this.ls.removeSubscription(orderSub);
                    this.sendBusinessMail(invoiceId, partnerId, orderId);
                  });
                this.ls.addSubscription(orderSub);
              }
              this.ls.removeSubscription(sendSub);
            });
          this.ls.addSubscription(sendSub);
          this.ls.removeSubscription(invoiceSub);
        });
        this.ls.addSubscription(invoiceSub);
      }
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

  private sendIndividualMail(orderId: number): void {
    const orderSub = this.orderService.getItemById<Order>(orderId).subscribe((order) => {
      const docSub = this.documentService.getEstimate(order).subscribe((file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('orderId', orderId.toString());
        formData.append('email', order.clientEmail);
        const mailSub = this.mailService.sendIndividualMail(formData, order).subscribe(() => {
          this.ls.removeSubscription(mailSub);
          this.ms.add({
            severity: 'success',
            summary: 'Заказ оформлен',
            detail: `Данные заказа отправлены на почту ${order.clientEmail}`,
          });
          this.router.navigate(['admin/orders']);
        });
        this.ls.addSubscription(mailSub);
        this.ls.removeSubscription(docSub);
        docSub.unsubscribe();
      });
      this.ls.addSubscription(docSub);
      this.ls.removeSubscription(orderSub);
    });
    this.ls.addSubscription(orderSub);
  }

  private sendBusinessMail(invoiceId: string, firmId: string, orderId: number): void {
    const requests = [
      this.bpService.getInvoiceById(invoiceId),
      this.bpService.getFirmById(firmId),
      this.orderService.getItemById<Order>(orderId),
    ];
    const subs = forkJoin(requests).subscribe(([invoice, firm, orderItem]) => {
      invoice = invoice as any;
      firm = firm as Firm;
      const order = orderItem as Order;
      const sub = this.documentService.getOffer(order, firm).subscribe((file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('billNumber', invoice.Name);
        formData.append('billDate', invoice.Date);
        // @ts-ignore
        formData.append('accountNumber', order.accountNumber);
        if (order.requestNumber) {
          formData.append('requestNumber', order.requestNumber);
        }
        formData.append('email', order.clientEmail);
        const mailSub = this.mailService
          .sendBusinessMail(formData, order, firm.FullName)
          .subscribe(() => {
            this.ls.removeSubscription(mailSub);
            this.ms.add({
              severity: 'success',
              summary: 'Заявка принята',
              detail: `Инструкции с дальнейшими действиями отправлены на почту ${order.clientEmail}`,
            });
            this.router.navigate(['admin/orders']);
          });
        this.ls.addSubscription(mailSub);
        this.ls.removeSubscription(sub);
        sub.unsubscribe();
      });
      this.ls.addSubscription(sub);
      this.ls.removeSubscription(subs);
    });
    this.ls.addSubscription(subs);
  }

  private getOrderSum(): number {
    let sum = 0;
    this.boxes.map((box) => {
      sum += box.price * box.count;
    });
    this.products.map((product) => {
      sum += product.price * product.count;
    });
    const delivery = this.contactsGroup.get('deliveryPrice')?.value;
    if (delivery) {
      sum += delivery;
    }
    return sum;
  }
}

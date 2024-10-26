import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../_services/back/order.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Order } from '../../../_models/order';
import { Router } from '@angular/router';
import { OrderStatus } from '../../../_utils/order-status.enum';
import { getOrderStatus, statusOptions } from '../../../_utils/constants';
import { Inplace } from 'primeng/inplace';
import { FormBuilder, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'flower-valley-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  public orders: Order[] = [];
  public statusDropdown = statusOptions;
  private skip: number = 0;
  public isLoading: boolean = false;
  public searchControl: FormControl;
  private searchString: string = '';
  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private cs: ConfirmationService,
    private ms: MessageService,
    private router: Router,
  ) {
    this.searchControl = fb.control('');
    this.searchControl.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
      this.searchString = value;
      this.skip = 0;
      this.orders = [];
      this.getOrders();
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 1);
    window.scrollTo(0, 0);
  }

  public getOrders(): void {
    this.isLoading = true;
    this.orderService.getItems(this.skip, 10, this.searchString).subscribe((data) => {
      this.orders = this.orders.concat(data);
      this.skip += 10;
      this.isLoading = false;
    });
  }

  public showOrder(id: number): void {
    this.router.navigate(['admin/orders', id]);
  }

  public repeatOrder(id: number): void {
    this.router.navigate(['admin/orders/create'], {
      queryParams: {
        orderId: id,
      },
    });
  }

  public newOrder(): void {
    this.router.navigate(['admin/orders/create']);
  }

  public getStatus(status: OrderStatus): { label: string; severity: string } {
    return getOrderStatus(status);
  }

  public changeStatus(order: Order, inplace: Inplace): void {
    this.orderService.updateItem({ id: order.id, status: order.status }).subscribe();
    inplace.deactivate();
    this.ms.add({
      severity: 'success',
      summary: `Заказ обновлен`,
      detail: `Заказу №${order.id} присвоен статус ${this.getStatus(order.status).label}`,
    });
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { OrderComponent } from './order/order.component';
import { NewOrderComponent } from './order/new-order/new-order.component';

const routes: Routes = [
  { path: '', component: OrdersComponent },
  { path: 'create', component: NewOrderComponent },
  { path: ':id', component: OrderComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}

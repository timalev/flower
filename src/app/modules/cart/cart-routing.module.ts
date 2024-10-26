import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart.component';
import { DownloadInvoiceComponent } from './download-invoice/download-invoice.component';

const routes: Routes = [
  {
    path: '',
    component: CartComponent,
    data: {
      title: 'Корзина',
      description: 'Купить выбранные товары и оформить доставку',
      keywords: 'цветы, рассады, рассада, агрофирма, корзина, покупки, купить, доставка',
    },
  },
  {
    path: 'download-invoice',
    component: DownloadInvoiceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartRoutingModule {}

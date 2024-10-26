import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { PanelComponent } from './panel/panel.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    data: {
      title: 'Панель администратора',
    },
    children: [
      { path: '', component: PanelComponent },
      { path: 'add', loadChildren: () => import('./add/add.module').then((m) => m.AddModule) },
      { path: 'edit', loadChildren: () => import('./edit/edit.module').then((m) => m.EditModule) },
      {
        path: 'boxes',
        loadChildren: () => import('./boxes/boxes.module').then((m) => m.BoxesModule),
      },

      {
        path: 'orders',
        loadChildren: () => import('./orders/orders.module').then((m) => m.OrdersModule),
      },
      {
        path: 'static-data',
        loadChildren: () =>
          import('./static-data/static-data.module').then((m) => m.StaticDataModule),
      },
      {
        path: 'prices',
        loadChildren: () => import('./prices/prices.module').then((m) => m.PricesModule),
      },
      {
        path: 'discount',
        loadChildren: () => import('./discount/discount.module').then((m) => m.DiscountModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}

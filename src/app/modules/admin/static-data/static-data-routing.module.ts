import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaticDataComponent } from './static-data.component';
import { MainComponent } from './main/main.component';
import { AboutComponent } from './components/about/about.component';
import { AdvantagesComponent } from './components/advantages/advantages.component';
import { HeaderAndFooterComponent } from './components/header-and-footer/header-and-footer.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { CartComponent } from './components/cart/cart.component';
import { OtherComponent } from './components/other/other.component';
import { AnimationComponent } from './components/animation/animation.component';
import { ProductComponent } from './components/product/product.component';
import { PrivatePolicyComponent } from './components/private-policy/private-policy.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { DownloadInvoiceComponent } from './components/download-invoice/download-invoice.component';
import { MailsComponent } from './components/mails/mails.component';
import { SeoComponent } from './components/seo/seo.component';
import { BranchComponent } from './components/branch/branch.component';


const routes: Routes = [
  {
    path: '',
    component: StaticDataComponent,
    children: [
      {
        path: '',
        component: MainComponent,
      },
      {
        path: 'main-menu',
        component: MainMenuComponent,
      },
      {
        path: 'header-and-footer',
        component: HeaderAndFooterComponent,
      },
      {
        path: 'animation',
        component: AnimationComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'advantages',
        component: AdvantagesComponent,
      },
      {
        path: 'product',
        component: ProductComponent,
      },
      {
        path: 'contacts',
        component: ContactsComponent,
      },
      {
        path: 'cart',
        component: CartComponent,
      },
      {
        path: 'download-invoice',
        component: DownloadInvoiceComponent,
      },
      {
        path: 'other',
        component: OtherComponent,
      },
      {
        path: 'private-policy',
        component: PrivatePolicyComponent,
      },
	  {
        path: 'seo',
        component: SeoComponent,
      },
	  {
        path: 'branch',
        component: BranchComponent,
      },
      {
        path: 'mails',
        component: MailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaticDataRoutingModule {}

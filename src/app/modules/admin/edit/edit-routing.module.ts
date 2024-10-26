import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { CategoryComponent } from './category/category.component';
import { BannerComponent } from './banner/banner.component';
import { SalesComponent } from './sales/sales.component';
import { SettingsComponent } from './sales/settings/settings.component';
import { ClientsComponent } from './clients/clients.component';
import { VideoComponent } from './video/video.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { MediaComponent } from './media/media.component';

const routes: Routes = [
  { path: 'product/:id', component: ProductComponent },
  { path: 'category/:id', component: CategoryComponent },
  { path: 'sale/settings', component: SettingsComponent },
  { path: 'sale/:id', component: SalesComponent },
  { path: 'clients', component: ClientsComponent },
  { path: 'reviews', component: ReviewsComponent },
  { path: 'video/:id', component: VideoComponent },
  { path: 'media/:id', component: MediaComponent },
  { path: 'banner', component: BannerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditRoutingModule {}

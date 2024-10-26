import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogRoutingModule } from './catalog-routing.module';
import { CatalogComponent } from './catalog.component';
import { FlowerValleySharedModule } from '../../shared/shared.module';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { CarouselModule } from 'primeng/carousel';
import { ImageModule } from 'primeng/image';
import { GalleriaModule } from 'primeng/galleria';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PipesModule } from '../../_pipes/pipes.module';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DragDropModule } from 'primeng/dragdrop';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { CategoryMenuComponent } from './category/category-menu/category-menu.component';
import { OrderListModule } from 'primeng/orderlist';
import { SeedlingsComponent } from './seedlings/seedlings.component';
import { DeliveryComponent } from './product/delivery/delivery.component';
import { InputNumberModule } from '../../components/input-number/input-number.module';

@NgModule({
  declarations: [
    CatalogComponent,
    CategoryComponent,
    ProductComponent,
    CategoryMenuComponent,
    SeedlingsComponent,
    DeliveryComponent,
  ],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    FlowerValleySharedModule,
    CarouselModule,
    ImageModule,
    GalleriaModule,
    FormsModule,
    ButtonModule,
    PipesModule,
    SplitButtonModule,
    InputNumberModule,
    DragDropModule,
    TieredMenuModule,
    OrderListModule,
  ],
  exports: [DeliveryComponent],
})
export class CatalogModule {}

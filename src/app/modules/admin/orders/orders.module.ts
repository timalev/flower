import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { OrderComponent } from './order/order.component';
import { NewOrderComponent } from './order/new-order/new-order.component';
import { DropdownModule } from 'primeng/dropdown';
import { PipesModule } from '../../../_pipes/pipes.module';
import { TagModule } from 'primeng/tag';
import { InplaceModule } from 'primeng/inplace';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FlowerValleySharedModule } from '../../../shared/shared.module';
import { InputTextModule } from 'primeng/inputtext';
import { ProductsOrderComponent } from './order/products-order/products-order.component';
import { BoxesOrderComponent } from './order/boxes-order/boxes-order.component';
import { CalendarModule } from 'primeng/calendar';
import { PriceConverterPipe } from '../../../_pipes/price-converter.pipe';
import { AccordionModule } from 'primeng/accordion';
import { InputNumberModule } from '../../../components/input-number/input-number.module';
import { ImageModule } from 'primeng/image';

@NgModule({
  declarations: [
    OrdersComponent,
    OrderComponent,
    NewOrderComponent,
    ProductsOrderComponent,
    BoxesOrderComponent,
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    PipesModule,
    TagModule,
    InplaceModule,
    FormsModule,
    InfiniteScrollModule,
    FlowerValleySharedModule,
    InputTextModule,
    InputNumberModule,
    ReactiveFormsModule,
    CalendarModule,
    AccordionModule,
    ImageModule,
  ],
  providers: [PriceConverterPipe],
})
export class OrdersModule {}

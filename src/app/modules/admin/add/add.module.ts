import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddRoutingModule } from './add-routing.module';
import { AddComponent } from './add.component';
import { ProductComponent } from './product/product.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { EditorModule } from 'primeng/editor';
import { FlowerValleySharedModule } from '../../../shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { CategoryComponent } from './category/category.component';
import { SalesComponent } from './sales/sales.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { VideoComponent } from './video/video.component';
import { PipesModule } from '../../../_pipes/pipes.module';
import { BoxComponent } from './box/box.component';
import { CardModule } from 'primeng/card';
import { MediaComponent } from './media/media.component';
import { CalendarModule } from 'primeng/calendar';
import { DiscountComponent } from './discount/discount.component';
import { InputNumberModule } from '../../../components/input-number/input-number.module';

@NgModule({
  declarations: [
    AddComponent,
    ProductComponent,
    CategoryComponent,
    SalesComponent,
    VideoComponent,
    BoxComponent,
    MediaComponent,
    DiscountComponent,
  ],
  imports: [
    CommonModule,
    AddRoutingModule,
    AutoCompleteModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,

    InputNumberModule,
    CheckboxModule,
    MultiSelectModule,
    EditorModule,
    FlowerValleySharedModule,
    ButtonModule,
    FormsModule,
    InputTextareaModule,
    PipesModule,
    CardModule,
    CalendarModule,
  ],
})
export class AddModule {}

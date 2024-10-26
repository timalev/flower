import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscountRoutingModule } from './discount-routing.module';
import { DiscountComponent } from './discount.component';
import { FlowerValleySharedModule } from '../../../shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../../../_pipes/pipes.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from '../../../components/input-number/input-number.module';

@NgModule({
  declarations: [DiscountComponent],
  imports: [
    CommonModule,
    DiscountRoutingModule,
    FlowerValleySharedModule,
    ButtonModule,
    TableModule,
    InputNumberModule,
    FormsModule,
    PipesModule,
    MultiSelectModule,
    CheckboxModule,
  ],
})
export class DiscountModule {}

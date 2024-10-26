import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoxesRoutingModule } from './boxes-routing.module';
import { BoxesComponent } from './boxes.component';
import { FlowerValleySharedModule } from '../../../shared/shared.module';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from '../../../components/input-number/input-number.module';

@NgModule({
  declarations: [BoxesComponent],
  imports: [
    CommonModule,
    BoxesRoutingModule,
    FlowerValleySharedModule,
    TableModule,
    FormsModule,
    InputNumberModule,
    ButtonModule,
    InputTextModule,
  ],
})
export class BoxesModule {}

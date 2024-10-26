import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumber } from './input-number';

@NgModule({
  imports: [CommonModule, InputTextModule, ButtonModule],
  exports: [InputNumber],
  declarations: [InputNumber],
})
export class InputNumberModule {}

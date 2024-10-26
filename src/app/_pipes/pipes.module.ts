import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { SafeUrlPipe } from './safe-url.pipe';
import { PriceConverterPipe } from './price-converter.pipe';
import { CartCountPipe } from './cart-count.pipe';
import { ThousandSeparatorPipe } from './thousand-separator.pipe';

@NgModule({
  declarations: [SafeUrlPipe, PriceConverterPipe, CartCountPipe, ThousandSeparatorPipe],
  imports: [CommonModule],
  exports: [SafeUrlPipe, PriceConverterPipe, CartCountPipe],
  providers: [DecimalPipe],
})
export class PipesModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivatePolicyRoutingModule } from './private-policy-routing.module';
import { PrivatePolicyComponent } from './private-policy.component';
import { FlowerValleySharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [PrivatePolicyComponent],
  imports: [CommonModule, PrivatePolicyRoutingModule, FlowerValleySharedModule],
})
export class PrivatePolicyModule {}

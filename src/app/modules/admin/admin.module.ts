import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { FlowerValleySharedModule } from '../../shared/shared.module';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PanelComponent } from './panel/panel.component';
import { MenubarModule } from 'primeng/menubar';

@NgModule({
  declarations: [AdminComponent, PanelComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FlowerValleySharedModule,
    CardModule,
    ButtonModule,
    MenubarModule,
  ],
})
export class AdminModule {}

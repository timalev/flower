import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchRoutingModule } from './branch-routing.module';
import { BranchComponent } from './branch.component';
import { FlowerValleySharedModule } from '../../shared/shared.module';

import { LightgalleryModule } from 'lightgallery/angular/13';

import { ImageModule } from 'primeng/image';
import { GalleriaModule } from 'primeng/galleria';

//import { ImageModule } from 'primeng/image';
//import { GalleriaModule } from 'primeng/galleria';
//import { ButtonModule } from 'primeng/button';
//import { ContextMenuModule } from 'primeng/contextmenu';
//import { DragDropModule } from 'primeng/dragdrop';

@NgModule({
  declarations: [BranchComponent],
  imports: [
    CommonModule,
    BranchRoutingModule,
    FlowerValleySharedModule,
	LightgalleryModule,
	   ImageModule,
    GalleriaModule
  ],
})
export class BranchModule {}

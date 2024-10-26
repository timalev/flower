import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainPageRoutingModule } from './main-page-routing.module';
import { MainPageComponent } from './main-page.component';
import { BannerComponent } from './banner/banner.component';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { CarouselModule } from 'primeng/carousel';
import { FlowerValleySharedModule } from '../../shared/shared.module';
import { SalesComponent } from './sales/sales.component';
import { AboutComponent } from './about/about.component';
import { AdvantagesComponent } from './advantages/advantages.component';
import { VideoComponent } from './video/video.component';
import { PipesModule } from '../../_pipes/pipes.module';
import { ReviewsComponent } from './reviews/reviews.component';
import { ClientsComponent } from './clients/clients.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { GalleriaModule } from 'primeng/galleria';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ImageModule } from 'primeng/image';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { SkeletonModule } from 'primeng/skeleton';
import { MediaComponent } from './media/media.component';
import { DragDropModule } from 'primeng/dragdrop';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { InputNumberModule } from '../../components/input-number/input-number.module';

@NgModule({
  declarations: [
    MainPageComponent,
    BannerComponent,
    SalesComponent,
    AboutComponent,
    AdvantagesComponent,
    VideoComponent,
    ReviewsComponent,
    ClientsComponent,
    MediaComponent,
  ],
  imports: [
    CommonModule,
    MainPageRoutingModule,
    ButtonModule,
    SharedModule,
    RippleModule,
    InputTextModule,
    CarouselModule,
    FlowerValleySharedModule,
    PipesModule,
    ReactiveFormsModule,
    InputTextareaModule,
    GalleriaModule,
    CheckboxModule,
    DropdownModule,
    InputNumberModule,
    SplitButtonModule,
    ImageModule,
    TooltipModule,
    DialogModule,
    EditorModule,
    SkeletonModule,
    FormsModule,
    DragDropModule,
    InfiniteScrollModule,
  ],
  exports: [AboutComponent, AdvantagesComponent],
})
export class MainPageModule {}

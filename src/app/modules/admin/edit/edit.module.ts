import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditRoutingModule } from './edit-routing.module';
import { ProductComponent } from './product/product.component';
import { FlowerValleySharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { EditorModule } from 'primeng/editor';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { CategoryComponent } from './category/category.component';
import { BannerComponent } from './banner/banner.component';
import { SalesComponent } from './sales/sales.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SettingsComponent } from './sales/settings/settings.component';
import { ClientsComponent } from './clients/clients.component';
import { VideoComponent } from './video/video.component';
import { PipesModule } from '../../../_pipes/pipes.module';
import { ReviewsComponent } from './reviews/reviews.component';
import { MediaComponent } from './media/media.component';
import { CalendarModule } from 'primeng/calendar';
import { DragDropModule } from 'primeng/dragdrop';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberModule } from '../../../components/input-number/input-number.module';

@NgModule({
  declarations: [
    ProductComponent,
    CategoryComponent,
    BannerComponent,
    SalesComponent,
    SettingsComponent,
    ClientsComponent,
    VideoComponent,
    ReviewsComponent,
    MediaComponent,
  ],
  imports: [
    CommonModule,
    EditRoutingModule,
    FlowerValleySharedModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    CheckboxModule,
    MultiSelectModule,
    EditorModule,
    ImageModule,
    ButtonModule,
    InputTextareaModule,
    PipesModule,
    CalendarModule,
    DragDropModule,
    TableModule,
    InputSwitchModule,
    FormsModule,
  ],
})
export class EditModule {}

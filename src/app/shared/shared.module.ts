import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogItemComponent } from './catalog-item/catalog-item.component';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { ProductItemComponent } from './product-item/product-item.component';
import { ContainerComponent } from './container/container.component';
import { LeafButtonComponent } from './leaf-button/leaf-button.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { MenuModule } from 'primeng/menu';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { ImageModule } from 'primeng/image';
import { FilesUploadComponent } from './files-upload/files-upload.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { SearchComponent } from './search/search.component';
import { CheckboxModule } from 'primeng/checkbox';
import { PipesModule } from '../_pipes/pipes.module';
import { LoaderComponent } from './loader/loader.component';
import { YandexMapComponent } from './yandex-map/yandex-map.component';
import { DialogModule } from 'primeng/dialog';
import { EntityFormComponent } from './entity-form/entity-form.component';
import { AccordionModule } from 'primeng/accordion';
import { InputNumberModule } from '../components/input-number/input-number.module';

@NgModule({
  declarations: [
    CatalogItemComponent,
    ProductItemComponent,
    ContainerComponent,
    LeafButtonComponent,
    FilesUploadComponent,
    SearchComponent,
    LoaderComponent,
    YandexMapComponent,
    EntityFormComponent,
  ],
  imports: [
    CommonModule,
    ButtonModule,
    SharedModule,
    RouterModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    PasswordModule,
    MenuModule,
    AutoCompleteModule,
    EditorModule,
    FileUploadModule,
    HttpClientModule,
    ImageModule,
    MultiSelectModule,
    InputNumberModule,
    TableModule,
    CheckboxModule,
    PipesModule,
    DialogModule,
    AccordionModule,
  ],
  exports: [
    CatalogItemComponent,
    ContainerComponent,
    ProductItemComponent,
    LeafButtonComponent,
    SearchComponent,
    FilesUploadComponent,
    LoaderComponent,
    YandexMapComponent,
    EntityFormComponent,
  ],
})
export class FlowerValleySharedModule {}

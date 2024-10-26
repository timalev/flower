import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FlowerValleySharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { BreadcrumbService } from './components/breadcrumb/breadcrumb.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CartModalComponent } from './components/cart-modal/cart-modal.component';
import { PipesModule } from './_pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BpRequestInterceptor } from './_interceptors/bp-request.interceptor';
import { BusinessPackService } from './_services/back/business-paсk.service';
import { TokenInterceptor } from './_interceptors/token.interceptor';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { DadataInterceptor } from './_interceptors/dadata.interceptor';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { PasswordModule } from 'primeng/password';
import { LoadingService } from './_services/front/loading.service';
import { PriceConverterPipe } from './_pipes/price-converter.pipe';
import { PRICE_CONVERT } from './_providers/price-convert.provider';
import { DISCOUNT } from './_providers/discount.provider';
import { DiscountService } from './_services/back/discount.service';
import { STATIC_DATA } from './_providers/static-data.provider';
import { StaticDataService } from './_services/back/static-data.service';
import { DATE_CONVERT } from './_providers/date-convert.provider';
import { DatePipe } from '@angular/common';
import { InputNumberModule } from './components/input-number/input-number.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    CartModalComponent,
    BreadcrumbComponent,
    SignInComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    ButtonModule,
    FlowerValleySharedModule,
    ImageModule,
    DialogModule,
    OverlayPanelModule,
    PipesModule,
    FormsModule,
    HttpClientModule,
    ConfirmDialogModule,
    ToastModule,
    InputTextModule,
    InputNumberModule,
    ReactiveFormsModule,
    PasswordModule,
  ],
  providers: [
    BreadcrumbService,
    LoadingService,
    BusinessPackService,
    ConfirmationService,
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BpRequestInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DadataInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: PRICE_CONVERT,
      useClass: PriceConverterPipe,
    },
    {
      provide: STATIC_DATA,
      useClass: StaticDataService,
    },
    {
      provide: DISCOUNT,
      useClass: DiscountService,
    },
    {
      provide: DATE_CONVERT,
      useClass: DatePipe,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

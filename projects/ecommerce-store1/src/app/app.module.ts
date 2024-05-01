import { HTTP_INTERCEPTORS ,HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LanguageInterceptor } from './interceptors/language.interceptor';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { ValidatorComponent } from './pages/validator/validator.component';
import { Routes, RouterModule } from '@angular/router';
import { ViewItemComponent } from './pages/view-item/view-item.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { CartViewComponent } from './pages/cart-view/cart-view.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumberDirective } from './_directives/only-number.directive';
import { CardNameDirective } from './_directives/card-name.directive';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

import { ToastService, AngularToastifyModule } from 'angular-toastify';
import { LoaderComponent } from './components/loader/loader.component';
import { SpinnerOverlayWrapperComponent } from './components/spinner-overlay-wrapper/spinner-overlay-wrapper.component';
import { SpinnerOverlayComponent } from './components/spinner-overlay/spinner-overlay.component'; 
// import {OVERLAY_PROVIDERS} from "@angular/material";
import { OverlayModule } from '@angular/cdk/overlay';
import { ThankyouPageComponent } from './pages/thankyou-page/thankyou-page.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ItemSearchComponent } from './components/item-search/item-search.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../environments/environment';

const config: SocketIoConfig = {
	url: environment.apiBaseUrl, // socket server url;
	options: {
		transports: ['websocket']
	}
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ValidatorComponent,
    ViewItemComponent,
    CheckoutComponent,
    CartViewComponent,
    NumberDirective,
    CardNameDirective,
    FileUploadComponent,
    LoaderComponent,
    SpinnerOverlayWrapperComponent,
    SpinnerOverlayComponent,
    ThankyouPageComponent,
    ItemSearchComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularToastifyModule,
    OverlayModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatSnackBarModule,
    ClipboardModule,
    BrowserModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config), 
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LanguageInterceptor,
      multi: true,
      
    },
    HttpClient,
    ToastService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

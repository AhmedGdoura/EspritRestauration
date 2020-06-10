import { NgModule, ErrorHandler } from "@angular/core";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { AngularFireModule } from "@angular/fire";
import { MyApp } from "./app.component";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { firebaseConfig } from "./firebase.config";
import { CartService } from "../pages/cart.service";
import {  MenusService } from "../services/menu.service";
import {  ProductDetailsService } from "../services/product-details.service";
import {  AuthService } from "../services/auth.service";
import {  UpdateProfileService } from "../services/updateProfile.service";
import {  SocketService } from "../services/socket.service";
import {  ChatService } from "../services/chat.service";
import {  FormService } from "../services/form.service";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { BrowserModule } from "@angular/platform-browser";
import "firebase/storage";
import { DatePicker } from "@ionic-native/date-picker";
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { ReactiveFormsModule } from '@angular/forms';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      return localStorage.getItem("token");
    },
    whitelistedDomains: ['localhost:8080']
  }
}

@NgModule({
  declarations: [MyApp],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps:[],
      },
    })
  ],
  exports: [BrowserModule],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    CartService,
    DatePicker,
    MenusService,
    ProductDetailsService,
    AuthService,
    UpdateProfileService,
    SocketService,
    ChatService,
    FormService,
  ]
})
export class AppModule { }

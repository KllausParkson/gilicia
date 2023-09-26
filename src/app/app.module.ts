import { Injectable, LOCALE_ID, NgModule } from "@angular/core";
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
} from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { environment } from "environments/environment";

// Pipes
import { TelefonePipe } from "./core/pipes/telefone.pipe";

// Plugins
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { Calendar } from "@ionic-native/calendar/ngx";

// Tradução
import { TranslateModule } from "@ngx-translate/core";
import { HttpClientModule } from "@angular/common/http";
import { IntlModule } from "@progress/kendo-angular-intl";
import { registerLocaleData } from "@angular/common";

import "@progress/kendo-angular-intl/locales/pt/all";
import "@progress/kendo-angular-intl/locales/pt-PT/all";

import "@progress/kendo-angular-intl/locales/es/all";
import "@progress/kendo-angular-intl/locales/es-PY/all";
import "@progress/kendo-angular-intl/locales/es-AR/all";
import "@progress/kendo-angular-intl/locales/es-CL/all";
import "@progress/kendo-angular-intl/locales/ja/all";

import "@progress/kendo-angular-intl/locales/en/all";
import "@progress/kendo-angular-intl/locales/en-GB/all";
import "@progress/kendo-angular-intl/locales/en-CA/all";
import "@progress/kendo-angular-intl/locales/en-AU/all";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { ChartsModule } from "@progress/kendo-angular-charts";
import "hammerjs";
import { IonicGestureConfig } from "./shared/utils/IonicGestureConfig";
import { DatePipe } from "@angular/common";

import localeJa from "@angular/common/locales/ja";

registerLocaleData(localeJa);

@Injectable()
export class DynamicLocaleId extends String {
  constructor() {
    super("");
  }

  toString() {
    return localStorage.getItem("one.lang") != "" &&
      localStorage.getItem("one.lang") != undefined &&
      localStorage.getItem("one.lang") != null &&
      localStorage.getItem("one.lang") != "null"
      ? localStorage.getItem("one.lang")
      : navigator.language;
  }
}

@NgModule({
    declarations: [AppComponent, TelefonePipe],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        IntlModule,
        BrowserAnimationsModule,
        InputsModule,
        ChartsModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFirestoreModule,
    ],
    providers: [
        StatusBar,
        Geolocation,
        AndroidPermissions,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: LOCALE_ID, useClass: DynamicLocaleId },
        TelefonePipe,
        NativeStorage,
        DatePipe,
        Calendar,
        { provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig },
    ],
    bootstrap: [AppComponent],
    exports: [TelefonePipe]
})
export class AppModule {}

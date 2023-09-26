import { Component, Inject, LOCALE_ID, Renderer2 } from "@angular/core";

import { Platform } from "@ionic/angular";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { CldrIntlService, IntlService } from "@progress/kendo-angular-intl";
import { registerLocaleData } from "@angular/common";

import localePt from "@angular/common/locales/pt";
import localePtPT from "@angular/common/locales/pt-PT";

import localeEs from "@angular/common/locales/es";
import localeEsPY from "@angular/common/locales/es-PY";
import localeEsAR from "@angular/common/locales/es-AR";
import localeEsCL from "@angular/common/locales/es-CL";

import localeEn from "@angular/common/locales/en";
import localeEnGB from "@angular/common/locales/en-GB";
import localeEnCA from "@angular/common/locales/en-CA";
import localeEnAU from "@angular/common/locales/en-AU";
import { NotificationService } from "./core/services/notification.service";
import { SplashScreen } from '@capacitor/splash-screen';
import { Plugins } from "@capacitor/core";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
  providers: [
    CldrIntlService,
    {
      provide: IntlService,
      useExisting: CldrIntlService,
    },
  ],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    public intl: IntlService,
    private renderer: Renderer2,
    private notification: NotificationService,
    @Inject(LOCALE_ID) public localeId: string
  ) {
    this.initializeApp();
  }

  public onLocaleChange(locale: string): void {
    this.localeId = locale;
    (this.intl as CldrIntlService).localeId = locale;

    this.onChangeAngularLocale(locale);
  }

  public onChangeAngularLocale(locale: string): void {
    registerLocaleData(localePt, "pt-BR");
    registerLocaleData(localePtPT, "pt-PT");
    registerLocaleData(localeEs, "es-ES");
    registerLocaleData(localeEsPY, "es-PY");
    registerLocaleData(localeEsAR, "es-AR");
    registerLocaleData(localeEsCL, "es-CL");
    registerLocaleData(localeEn, "en-US");
    registerLocaleData(localeEnGB, "en-GB");
    registerLocaleData(localeEnCA, "en-CA");
    registerLocaleData(localeEnAU, "en-AU");
    registerLocaleData(localePt, "pt-BR");
  }

  async initializeApp() {
    if(localStorage.getItem('basehref') == null){
      localStorage.setItem('appId', '1');
    localStorage.setItem('basehref', 'OneApp');
    localStorage.setItem('appNameLogin', 'ONE BELEZA');
    }

    if(localStorage.getItem('tema') != undefined || localStorage.getItem('tema') != null){
      if( localStorage.getItem('tema') == 'dark'){
        this.renderer.setAttribute(document.body, 'color-theme', 'dark')
      }
      else{
        this.renderer.setAttribute(document.body, 'color-theme', 'light')
      }
  }
    
    this.platform.ready().then(async() => {
      // this.statusBar.styleDefault();
      this.statusBar.styleLightContent();
      await SplashScreen.hide()
      //await Plugins.SplashScreen.hide()
      // inicia push notification
      this.notification.initPush();

      this.onChangeAngularLocale(
        localStorage.getItem("one.lang") !== "" &&
          localStorage.getItem("one.lang") !== undefined &&
          localStorage.getItem("one.lang") != null &&
          localStorage.getItem("one.lang") !== "null"
          ? localStorage.getItem("one.lang")
          : navigator.language
      );
    });
  }
}

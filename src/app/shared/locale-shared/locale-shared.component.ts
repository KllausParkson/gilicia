import {Component, OnInit, ViewChild} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {I18nUtils} from '../../core/common/i18n/i18nUtils';
import {AppComponent} from '../../app.component';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-locale-shared',
  templateUrl: './locale-shared.component.html',
  styleUrls: ['./locale-shared.component.scss'],
})
export class LocaleSharedComponent implements OnInit {

  @ViewChild("dropdownlist") public dropdownlist: DropDownListComponent;
  public iconCountry: string = 'globe';
  public menuCountries: Array<any> = this.loadCountries();
  public selectedValue: any;

  constructor(
    private translate: TranslateService,
    private appComponent: AppComponent) {
    this.loadDefaultLanguage();
  }

  ngOnInit() {
  }

  switchLanguage(language: string) {
    switch (language) {
      case 'pt-PT':
        return 'pt-PT';
      default:
        return language.substring(0, 2);
    }
  }

  loadDefaultLanguage() {
    this.translate.addLangs(I18nUtils.Languages());

    let userLang = localStorage.getItem('one.lang');

    if (userLang != '' && userLang != undefined && userLang != null && userLang != 'null') {
      this.translate.setDefaultLang(this.switchLanguage(userLang));
      this.translate.reloadLang(this.switchLanguage(userLang));
      this.appComponent.onLocaleChange(userLang);

      this.iconCountry = 'flag-icon flag-icon-' + userLang.substring(3, 5).toLocaleLowerCase() + ' flag-icon-squared';

      this.selectedValue = {
        text: userLang.substring(3, 5),
        icon: this.iconCountry,
        language: userLang
      };

    } else {
      let browserLang = navigator.language;

      let lang = (I18nUtils.Internationalizations()).includes(browserLang) ? browserLang : 'pt-BR';

      this.translate.setDefaultLang(this.switchLanguage(lang));
      this.translate.reloadLang(this.switchLanguage(lang));
      this.appComponent.onLocaleChange(lang);

      this.iconCountry = 'flag-icon flag-icon-' + lang.substring(3, 5).toLocaleLowerCase() + ' flag-icon-squared';

      this.selectedValue = {
        text: browserLang.substring(3, 5),
        icon: this.iconCountry,
        language: browserLang
      };

    }

  }

  loadCountries(): Array<any> {

    let countries = I18nUtils.Internationalizations();
    let arrayCountries: Array<any> = new Array<any>();

    countries.forEach(element => {
      arrayCountries.push(
        {
          text: element.substring(3, 5),
          icon: 'flag-icon flag-icon-' + element.substring(3, 5).toLocaleLowerCase() + ' flag-icon-squared',
          language: element
        }
      );
    });

    return arrayCountries;
  }

  changeLanguage(event: any) {
    this.selectedValue = event;
    localStorage.setItem('one.lang', this.selectedValue.language);
    this.translate.setDefaultLang(this.switchLanguage(this.selectedValue.language));
    this.appComponent.onLocaleChange(this.selectedValue.language);
    this.iconCountry = 'flag-icon flag-icon-' + this.selectedValue.language.substring(3, 5).toLocaleLowerCase() + ' flag-icon-squared';
    window.location.reload();
  }
}

import { Pipe, PipeTransform, LOCALE_ID, Inject } from '@angular/core';
import { formatCurrency, getLocaleCurrencyCode, getLocaleCurrencySymbol } from '@angular/common';

@Pipe({
  name: 'currencyGlobal'
})
export class CurrencyGlobalPipe implements PipeTransform {

  constructor(
    @Inject( LOCALE_ID ) private _localeId: string
  ) {}

  transform(value: number, currencyCode?: string, digitInfo?: string): any {
    let user = JSON.parse(localStorage.getItem('one.user'));
    let filial = user.authenticatedBranch;
    let linguaPais = filial.linguaPais;
    let code = getLocaleCurrencyCode(linguaPais);
    return formatCurrency(value, linguaPais, getLocaleCurrencySymbol(linguaPais), code, digitInfo);
  }

}
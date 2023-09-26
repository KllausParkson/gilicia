import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefone'
})
export class TelefonePipe implements PipeTransform {

  transform(telefone: string, lg?: any): string {
    
    if (!telefone) { return null; }
    return this.phoneMask(telefone, lg);
  }
  limite(){

  }

  private phoneMask(value: any, lg?: any): string {
    //debugger
    let formValue = value.replace(/\D/g, "");
    let length;
    let mask;
    //let user = JSON.parse(localStorage.getItem('one.user'));
    //let filial = user.authenticatedBranch;
    //let linguaPais = filial.linguaPais;
    let linguaPais = localStorage.getItem('one.lang') != "" && localStorage.getItem('one.lang') != undefined 
               && localStorage.getItem('one.lang') != null && localStorage.getItem('one.lang') != "null"
               ? localStorage.getItem('one.lang') 
               : navigator.language;
    linguaPais = lg ? lg : linguaPais
  
    switch (linguaPais){ 
      case "pt-BR":
        if(formValue?.length <= 8) {
          length = 9;
          mask = '9999-9999'
          formValue = formValue.replace(/\D/gi, '');
          formValue = formValue.replace(/(\d{4})(\d)/gi, '$1-$2');
        }
        else if(formValue?.length === 9) {
          length = 10;
          mask = '99999-9999'
          formValue = formValue.replace(/\D/gi, '');
          formValue = formValue.replace(/(\d{5})(\d)/gi, '$1-$2');
        }
        else if(formValue?.length === 10) {
          length = 14;
          mask = '(99) 9999-9999';
          formValue = formValue.replace(/\D/gi, '');
          formValue = formValue.replace(/(\d{2})(\d)/gi, '$1 $2');
          formValue = formValue.replace(/(\d{4})(\d)/gi, '$1-$2');
          formValue = formValue.replace(/(\d{4})(\d)/gi, '$1$2');
        }
        else if (formValue?.length === 11){
          length = 15;
          mask = '(99) 99999-9999';
          formValue = formValue.replace(/\D/gi, '');
          formValue = formValue.replace(/(\d{2})(\d)/gi, '$1 $2');
          formValue = formValue.replace(/(\d{5})(\d)/gi, '$1-$2');
          formValue = formValue.replace(/(\d{4})(\d)/gi, '$1$2');
        }
        else {
          length = 16;
          mask = '99 999-9999-9999'
        }
        return this.formatField(formValue, mask, length);
      case "en-US":
        //debugger
        if(formValue?.length <= 6) {
          length = 7;
          mask = '999-9999'
          formValue = formValue.replace(/\D/gi, '');
          formValue = formValue.replace(/(\d{3})(\d)/gi, '$1-$2');
        }
        else {
          length = 14;
          mask = '(999) 999-9999'
          formValue = formValue.replace(/\D/gi, '');
          formValue = formValue.replace(/(\d{3})(\d)/gi, '$1 $2');
          formValue = formValue.replace(/(\d{3})(\d)/gi, '$1-$2');
          formValue = formValue.replace(/(\d{4})(\d)/gi, '$1$2');
        }
        return this.formatField(formValue, mask, length);
      case "pt-PT":
        if(formValue?.length <= 6) {
          length = 7;
          mask = '999 999'
          formValue = formValue.replace(/\D/gi, '');
          formValue = formValue.replace(/(\d{3})(\d)/gi, '$1-$2');
        }
        else {
          length = 11;
          mask = '999 999 999'
          formValue = formValue.replace(/\D/gi, '');
          formValue = formValue.replace(/(\d{3})(\d)/gi, '$1 $2');
          formValue = formValue.replace(/(\d{3})(\d)/gi, '$1-$2');
          formValue = formValue.replace(/(\d{4})(\d)/gi, '$1$2');
        }
        return this.formatField(formValue, mask, length);
      case "ja-JP":
        if(formValue?.length <= 7) {
          length = 8;
          mask = '999-9999'
          formValue = formValue.replace(/\D/gi, '');
          formValue = formValue.replace(/(\d{3})(\d)/gi, '$1-$2');
        }
        else {
          length = 13;
          mask = '999-9999-9999'
          formValue = formValue.replace(/\D/gi, '');
          formValue = formValue.replace(/(\d{3})(\d)/gi, '$1 $2');
          formValue = formValue.replace(/(\d{3})(\d)/gi, '$1-$2');
          formValue = formValue.replace(/(\d{4})(\d)/gi, '$1$2');
        }
        return this.formatField(formValue, mask, length);
      case "es-PY":{
        if(formValue?.length <= 4) {
          length = 5;
          mask = '(9999)'
          formValue = formValue.replace(/\D/gi, '');
          formValue = formValue.replace(/(\d{3})(\d)/gi, '$1-$2');
        }
        else {
          length = 12;
          mask = '(9999)999999'
          formValue = formValue.replace(/\D/gi, '');
          formValue = formValue.replace(/(\d{3})(\d)/gi, '$1 $2');
          formValue = formValue.replace(/(\d{3})(\d)/gi, '$1-$2');
          formValue = formValue.replace(/(\d{4})(\d)/gi, '$1$2');
        }
        return this.formatField(formValue, mask, length);
      }
      default:
        
        return formValue;
    }
  }

  private formatField(field: string, mask: string, size: number): any {
      
    if (!size) { size = 99999999999; }
    let booleanMask;
    const exp = /\_|\-|\.|\/|\(|\)|\,|\*|\+|\@|\#|\$|\&|\%|\:| /gi;
    const numbersOfField = field.toString().replace(exp, '');
    let fieldPosition = 0;
    let newFieldValue = '';
    let maskLength = numbersOfField?.length;
    for (let i = 0; i < maskLength; i++) {
      if (i < size) {
        booleanMask = (mask.charAt(i) === '-') || (mask.charAt(i) === '.') || (mask.charAt(i) === '/');
        booleanMask = booleanMask || mask.charAt(i) === '_';
        booleanMask = booleanMask || ((mask.charAt(i) === '(') || (mask.charAt(i) === ')') || (mask.charAt(i) === ' '));
        booleanMask = booleanMask || ((mask.charAt(i) === ',') || (mask.charAt(i) === '*') || (mask.charAt(i) === '+'));
        booleanMask = booleanMask || ((mask.charAt(i) === '@') || (mask.charAt(i) === '#') || (mask.charAt(i) === ':'));
        booleanMask = booleanMask || ((mask.charAt(i) === '$') || (mask.charAt(i) === '&') || (mask.charAt(i) === '%'));
        if (booleanMask) {
          newFieldValue += mask.charAt(i);
          maskLength++;
        } else {
          newFieldValue += numbersOfField.charAt(fieldPosition);
          fieldPosition++;
        }
      }
    }
    return newFieldValue;
  }
}

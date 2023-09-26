import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpfcnpj'
})
export class CpfcnpjPipe implements PipeTransform {

  transform(value: string): string {
    if(!value) {
      return null;
    }

    let lang = localStorage.getItem('one.lang') != "" && localStorage.getItem('one.lang') != undefined 
              && localStorage.getItem('one.lang') != null && localStorage.getItem('one.lang') != "null"
              ? localStorage.getItem('one.lang') 
              : navigator.language;

    switch (lang){ 
      case "pt-BR":
        return this.mask(value);
      default:
        return value.replace(/\D/gi, '');;
    }
  }

  private mask(value: string): string {
    let formatValue: string = value;
    
    formatValue = formatValue.replace(/\D/gi, '');
    
    if(formatValue?.length < 12) { //CPF
      formatValue = formatValue.replace(/(\d{3})(\d)/,"$1.$2");
      formatValue = formatValue.replace(/(\d{3})(\d)/,"$1.$2");
      formatValue = formatValue.replace(/(\d{3})(\d{1,2})$/,"$1-$2")
  
    } else { //CNPJ
      formatValue = formatValue.replace(/^(\d{2})(\d)/,"$1.$2");
      formatValue = formatValue.replace(/(\d{3})(\d)/, "$1.$2");
      formatValue = formatValue.replace(/(\d{3})(\d)/, "$1/$2");
      formatValue = formatValue.replace(/(\d{4})(\d)/, "$1-$2");
    }
    
    return formatValue;
  }

}

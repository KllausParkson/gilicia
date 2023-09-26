export class DateUtils {
    //#region Tratamento de datas
  public static AgendaDateToSchedularDate(agData: Date, agHora: string): Date {

    let date = new Date(agData);
    let year = String(date.getFullYear());
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');

    let dateTimezone = new Date(year + '-' + month + '-' + day + 'T' + agHora + 'Z');

    //Tratamento para retirar diferença timezone
    var userTimezoneOffset = dateTimezone.getTimezoneOffset() * 60000;
    return new Date(dateTimezone.getTime() - (userTimezoneOffset * -1));
  }

  public static DateNowToSchedularDate(): string {

    let year = String(new Date().getFullYear());
    let month = String(new Date().getMonth() + 1).padStart(2, '0');
    let day = String(new Date().getDate()).padStart(2, '0');

    let hours = String(new Date().getHours()).padStart(2, '0');
    let minutes = String(new Date().getMinutes()).padStart(2, '0');
    let seconds = String(new Date().getSeconds()).padStart(2, '0');

    return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + 'Z';
  }

  public static DateToHours(date: Date): string {

    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');

    return hours + ':' + minutes + ':' + seconds;
  }

  public static DateToString(date: Date): string {

    let year = String(date.getFullYear());
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');

    return year + '-' + month + '-' + day;
  }
//#endregion
}

import { Injectable } from '@angular/core';
import { HttpHeaders } from "@angular/common/http";

import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BaseService {

    protected urlService = 'https://oneapiapp.azurewebsites.net/api/';

    protected urlServiceCritica = 'https://oneapiappfuncoescriticas.azurewebsites.net/api/';

    protected urlServiceAux2 = 'https://oneapiappaux.azurewebsites.net/api/';
    
    protected urlServiceReports = 'https://oneapiappreports.azurewebsites.net/api/';

    protected urlServiceAux = 'https://oneapiappaux.azurewebsites.net/api/';

    protected ObterHeaderJson(){
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }

    protected ObterAuthHeaderJson(){
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.obterTokenUsuario()}`
            })
        };
    }

    protected ObterAuthHeaderUpload(){
        return {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${this.obterTokenUsuario()}`
            })
        };
    }

    public obterUsuario() {
        return JSON.parse(localStorage.getItem('one.user'));
    }

    protected obterTokenUsuario(): string {
        return localStorage.getItem('one.token');
    }

    protected extractData(response: any){
        return response.data || {};
    }

    protected serviceError(error: Response | any){
        let errMsg: string;

        if (error instanceof Response) {

            errMsg = `${error.status} - ${error.statusText || ''}`;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(error);
        return throwError(error);
    }
}

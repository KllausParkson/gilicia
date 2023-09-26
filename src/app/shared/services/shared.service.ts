import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'app/core/services/base.service';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MobilidadeModel } from '../models/mobilidade-model';
import { BugModel } from '../models/bug-model'
import { NotificationCacheModel } from '../models/notification-cache-model';

@Injectable({
  providedIn: 'root'
})
export class SharedService extends BaseService {

  constructor(private http: HttpClient) { super() }

  adicionarAvaliacao(avaliacao: any[]) {
    return this.http
      .post(this.urlService + 'AvaliacoesClientes/AdicionarAvaliacaoCliente', avaliacao, super.ObterAuthHeaderJson())
  }

  getDadosEmpresa(): Observable<MobilidadeModel>{
    return this.http
      .get<MobilidadeModel>(this.urlService + 'Mobilidades/GetDadosEmpresa',
      super.ObterAuthHeaderJson()).pipe(catchError(super.serviceError));
  }

  reportarBug(bug: BugModel) {
    return this.http
    .post<Array<BugModel>>(this.urlService + "OUsuario/EnviarRelatorioDeProblemas", bug, super.ObterAuthHeaderJson())
    .pipe(catchError(super.serviceError))
  }

  uploadFotoBug(file: FormData): any {
    return this.http
      .post(this.urlService + 'OUsuario/EnviarFotoDeProblemas', file, super.ObterAuthHeaderUpload())
      .pipe(catchError(super.serviceError));
  }
  getNotifications(empresaId: number, filiaisId: number, cliForColsId: number): any{
    return this.http
      .get<any>(this.urlService + 'Notification/GetCacheNotification?empresaId=' + empresaId + '&filiaisId=' + filiaisId + '&cliForColsId=' + cliForColsId).pipe(catchError(super.serviceError));
  }

  clearNotifications(notification: NotificationCacheModel)
  {
    return this.http
    .put(this.urlService + 'Notification/ClearCacheNotification',notification)
    .pipe(map(super.extractData))
    .pipe(catchError(super.serviceError));
  }
  clearNotificationByNotification(notification: NotificationCacheModel): Observable<any>
  {
    let response = this.http
    .put(this.urlService + 'Notification/ClearCacheNotificationByNotification',notification)
    .pipe(map(super.extractData))
    .pipe(catchError(super.serviceError));

    return response;
  }

  getAssinaturaClientes() {
    return this.http.get(this.urlService + "AssinaturaClientes/AssinaturaClientes", super.ObterAuthHeaderJson()).pipe(catchError(super.serviceError))
  }
  buscaCPF() {
    let response = this.http
      .get<string>(this.urlService + 'OCliForCols/BuscarCPF', super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))

    return response;
  }
  atualizaCPF(CPF: string){
    return this.http
    .post(this.urlService + 'OCliForCols/AtualizarCPF?novoCpf=' + CPF, CPF, super.ObterAuthHeaderUpload())
    .pipe(map(super.extractData))
    .pipe(catchError(super.serviceError));
  }
  getClienteTemAssinatura(): Observable<boolean> {
    return this.http
      .get<boolean>(this.urlService + 'AssinaturaClientes/GetClienteTemAssinatura', super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))
  }
}

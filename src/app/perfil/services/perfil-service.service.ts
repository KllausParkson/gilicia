import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'app/core/services/base.service';
import { LoginUsuarioModel } from 'app/login/models/login-usuario-model';
import { HistoricoModel } from '../models/historico-model';
import { MilhagensModel } from '../models/milhagens-model';
import { PerfilColaboradorModel } from '../models/perfil-colaborador-model';
import { PerfilModel } from '../models/perfil-model';
import { ServicoFidelidadeModel } from '../models/servico-fidelidade-model';
import { AssinaturaClientesModel } from '../models/assinatura-clientes-model';

@Injectable({
  providedIn: 'root'
})
export class PerfilServiceService extends BaseService {

  constructor(private http: HttpClient) { super() }

  getUsuarioPerfil() {
    let response = this.http
      .get<PerfilModel>(this.urlService + 'UsuariosMob/UsuarioInfoPerfil', super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))

    return response
  }

  editarPerfil(perfil: PerfilModel) {
    return this.http
      .put(this.urlService + 'OUsuario/UpdateUsuarioInfoPerfil', perfil, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData))
      .pipe(catchError(super.serviceError));
  }

  alteraSenhaInterno(email: string, senhaAntiga: string, senha: string, confirmarSenha: string): any {
    let body = { email, senhaAntiga, senha, confirmarSenha }
    return this.http
      .patch(this.urlService + "OSecurity/AlteraSenhaInterno", body, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }


  getMilhagens(): Observable<MilhagensModel> {
    return this.http
      .get<MilhagensModel>(this.urlService + 'OMilhagensMovs/GetPontosMilhagemCliente', super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))
  }

  getHistorico(ordem: number): Observable<Array<HistoricoModel>> {
    return this.http
      .get<Array<HistoricoModel>>(this.urlService + `OAgendaCliProdServ/GetHistoricoAgendamentosCliente/${ordem}`, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))
  }

  getColaborador(): Observable<PerfilColaboradorModel> {
    return this.http
      .get<PerfilColaboradorModel>(this.urlService + 'OProfissionalPerfil/ProfissionalInfoPerfil', super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))
  }

  getAvaliacaoColaborador(dataInicial: string, dataFinal: string): Observable<any> {
    return this.http
      .get(this.urlService + 'OAvaliacoes/GetAvalicaoProfissional?dataInicial=' + dataInicial + '&dataFinal=' + dataFinal, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))
  }

  setFoto(): any {
    return { UrlSave: this.urlService + "OUsuario/Foto", Headers: super.ObterAuthHeaderUpload() }
  }

  uploadFoto(file: FormData) {
    return this.http
      .post(this.urlService + 'OUsuario/Foto', file, super.ObterAuthHeaderUpload())
      .pipe(catchError(super.serviceError));
  }

  uploadImages(formData: FormData, url: string) {
    return this.http
      .post<any>(url, formData, super.ObterAuthHeaderUpload())
      .pipe(catchError(super.serviceError));
  }

  getUltimosAcessos(email: string): Observable<LoginUsuarioModel> {
    return this.http.get<LoginUsuarioModel>(this.urlService + 'OLoginUsuario/GetUltimosAcessos?email='
      + email, super.ObterAuthHeaderJson()).pipe(catchError(super.serviceError));
  }

  getServicosFidelidade(): Observable<ServicoFidelidadeModel> {
    return this.http
      .get<ServicoFidelidadeModel>(this.urlService + 'OFidelidade/GetServicosFidelidadeCliente', super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))
  }
  deleteFotoProfissional() {
    return this.http
      .delete(this.urlService + 'CliForCols/DeleteFotoProfissional', super.ObterAuthHeaderJson())
      .pipe(map(super.extractData))
      .pipe(catchError(super.serviceError));
  }

  getAssinaturaClientes(): Observable<Array<AssinaturaClientesModel>> {
    return this.http
      .get<Array<AssinaturaClientesModel>>(this.urlService + 'AssinaturaClientes/GetAssinaturasPorCliForColsId', super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))
  }

  getServicosAssinatura(assinaturaClientesId: number): Observable<Array<any>> {
    return this.http
      .get<Array<any>>(this.urlService + 'AssinaturaClientes/GetServicosPorAssinaturaClientesId?assinaturaClienteId=' + assinaturaClientesId, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))
  }

  getClienteTemAssinatura(): Observable<boolean> {
    return this.http
      .get<boolean>(this.urlService + 'AssinaturaClientes/GetClienteTemAssinatura', super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))
  }

  getDisponibilidadeOrcamentos() {
    return this.http.get(this.urlService + "AssinaturaClientes/GetDisponibilidadeOrcamentos", super.ObterAuthHeaderJson()).pipe(catchError(super.serviceError))
  }

  getCredDebtDisponivel() {
    return this.http.get(this.urlService + "CredDebtDisponiveis/GetCredDebtDisponivel", super.ObterAuthHeaderJson()).pipe(catchError(super.serviceError))
  }

  getCredAntecipadoFilial(): Promise<number> {
    let promise = new Promise<number>((resolve, reject) => {
      let url = `${this.urlService}CredDebtDisponiveis/GetCreditoAntecipadoFilial`
      this.http.get<number>(url, super.ObterAuthHeaderJson()).pipe(catchError(super.serviceError)).toPromise().then(res => {
        resolve(res);
      }, error => {
        reject(error);
      });
    })
    return promise;
  }

}

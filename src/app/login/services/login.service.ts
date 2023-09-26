import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from 'app/core/services/base.service';
import {LoginUsuarioModel} from '../models/login-usuario-model';
import {MobilidadeCompleta, MobilidadeModel} from '../models/mobilidade-model';
import {Observable} from 'rxjs';
import {NovaContaModel} from '../models/nova-conta-model';
import {map, catchError} from 'rxjs/operators';
import {LoginModel} from '../models/login-model';
import {RecuperarContaModel} from '../models/recuperar-conta-model';
import {FacebookLightModel, FacebookModel} from '../models/facebook-light-model';
import {GoogleLightModel, GoogleModel} from '../models/google-light-model';
import { AppleLightModel, AppleModel } from '../models/apple-light-model';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  userLogin(email: string, senha: string, appId: any, basehref: any): any {
    const req = {email, senha, appId, basehref};
    return this.http
      .post(this.urlService + 'OLoginUsuario', req)
      .pipe(catchError(super.serviceError));
  }
  userLoginEmail(email: string, senha: string, appId: any, basehref: any): any {
    const req = {email, senha, appId, basehref};
    return this.http
      .post(this.urlService + 'OLoginUsuario/LoginAppAntigo', req)
      .pipe(catchError(super.serviceError));
  }

  pesquisarEmpresaPorNome(empresa: string): Observable<Array<MobilidadeModel>> {
    return this.http
      .get<Array<MobilidadeModel>>(this.urlService + 'Mobilidades/PesquisarEmpresaFilialPorNome?searchterm=' + empresa)
      .pipe(catchError(super.serviceError));
  }

  desvincularAcesso(empresaId: number, filialId: number, usuarioId: number) {
    return this.http
      .delete(this.urlService + `OAcesso/DesvincularAcesso?usuarioId=${usuarioId}&empresaId=${empresaId}&filialId=${filialId}`,
        super.ObterHeaderJson())
      .pipe(map(super.extractData));
  }

  buscarEmpresasProximas(latitude: string, longitude: string): Observable<Array<MobilidadeModel>> {
    const url = `${this.urlService}Mobilidades/BuscarEmpresasMaisProximas?latitude=${latitude}&longitude=${longitude}`;
    return this.http
      .get<Array<MobilidadeModel>>(url)
      .pipe(catchError(super.serviceError));
  }

  cadastrarConta(novaConta: NovaContaModel) {
    return this.http
      .post(this.urlService + 'OSecurity/CadastrarConta', novaConta, super.ObterHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  enviarEmail(email: string, AppId?: number) {
    if (!AppId) {
      AppId = 0;

    }

    return this.http
      .post(this.urlService + 'OSecurity/EnviaCodigoRecuperacaoSenha', {email, AppId})
      .pipe(catchError(super.serviceError));
  }

  verificarCodigo(email: string, codigo: string): Observable<boolean> {
    return this.http
      .get<boolean>(this.urlService + `/OSecurity/VerificaCodigoRecuperacaoSenha/${email}/${codigo}`)
      .pipe(catchError(super.serviceError));
  }

  alteraSenha(email: string, codigo: string, senha: string, confirmarSenha: string) {
    const body = {codigo, email, senha, confirmarSenha};
    return this.http
      .patch(this.urlService + 'OSecurity/AlteraSenha', body, super.ObterHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  login(loginModel: LoginModel, flagHash: boolean) {
    return this.http
      .post(this.urlService + 'OLoginEmpresa?empresaId=' + loginModel.empresaId + '&filialId=' + loginModel.filialId +
        '&flagHash=' + flagHash, loginModel, super.ObterHeaderJson())
      .pipe(map(super.extractData))
      .pipe(catchError(super.serviceError));
  }

  loginInterno(loginModel: LoginModel) {
    return this.http
      .post(this.urlService + 'OLoginEmpresa/LoginInterno?empresaId=' + loginModel.empresaId + '&filialId=' + loginModel.filialId,
        loginModel, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData))
      .pipe(catchError(super.serviceError));
  }

  ativarConta(codigo: string, email: string) {
    const body = {email, codigo};
    return this.http
      .patch(this.urlService + 'OSecurity/AtivarConta', body, super.ObterHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  cancelarInscricao(email: string) {
    return this.http
      .post(this.urlService + 'OSecurity/CancelarInscricao/' + email, super.ObterHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  recuperarConta(recuperarConta: RecuperarContaModel) {
    return this.http
      .patch(this.urlService + 'OSecurity/RecuperarConta', recuperarConta, super.ObterHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  buscarListaFiliais() {
    return this.http
      .post(this.urlService + 'Mobilidades/BuscarListaFiliais', [0], super.ObterHeaderJson())
      .pipe(map(super.extractData))
      .pipe(catchError(super.serviceError));
  }

  alterarSenhaTemporaria(body: any) {
    return this.http
      .post(this.urlService + 'UsuariosMob/AlteraSenhaUsuarioLogado', body, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData))
      .pipe(catchError(super.serviceError));

  }

  buscaEmpresaMobilidadeId(mobilidadeId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
      .get<MobilidadeCompleta>(this.urlService + 'Mobilidades/BuscaEmpresaPorMobilidade?mobilidadeId=' + mobilidadeId,
        super.ObterAuthHeaderJson()).toPromise().then(response =>{
          resolve(response)
        }, error => {
          reject(error)
        })
    }) 
  }

  loginFacebook(dadosFacebook: FacebookLightModel): any {
    return this.http
      .post(this.urlService + 'OLoginUsuario/LoginFacebook', dadosFacebook)
      .pipe(catchError(super.serviceError));
  }

  criarContaFacebook(criarContaFacebook: FacebookModel): any {
    return this.http
      .post(this.urlService + 'OLoginUsuario/LoginFacebookCriarConta', criarContaFacebook)
      .pipe(catchError(super.serviceError));
  }

  loginGoogle(dadosGoogle: GoogleLightModel): any {
    return this.http
      .post(this.urlService + 'OLoginUsuario/LoginGoogle', dadosGoogle)
      .pipe(catchError(super.serviceError));
  }

  criarContaGoogle(criarContaGoogle: GoogleModel): any {
    return this.http
      .post(this.urlService + 'OLoginUsuario/LoginGoogleCriarConta', criarContaGoogle)
      .pipe(catchError(super.serviceError));
  }
  loginApple(dadosApple: AppleLightModel): any {
    return this.http
      .post(this.urlService + 'OLoginUsuario/LoginApple', dadosApple)
      .pipe(catchError(super.serviceError));
  }

  criarContaApple(criarContaApple: AppleModel): any {
    return this.http
      .post(this.urlService + 'OLoginUsuario/LoginAppleCriarConta', criarContaApple)
      .pipe(catchError(super.serviceError));
  }
  logout(tipoDispositivo: string) {
    return this.http
      .post(this.urlService + 'OLoginUsuario/Logout?tipoDispositivo='+ tipoDispositivo, null ,super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }
  atualizarNomeCadastro(nome: string, email: string) {
    return this.http
      .post(this.urlService + 'OLoginUsuario/AtualizarNomeCadastro?nome='+ nome + '&email='+ email, null ,super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }
  buscarEmpresasPorAppId(appId: any){
    return this.http
    .get(this.urlService + 'Mobilidades/BuscarEmpresasPorAppId?appId=' + appId,
      super.ObterAuthHeaderJson())
    .pipe(catchError(super.serviceError));
  }
  excluirConta() {
    return this.http
      .delete(this.urlService + `OUsuario/DeleteUsuario`, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData));
  }
}

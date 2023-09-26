import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'app/core/services/base.service';
import { Observable, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { GServicosModel } from '../models/gServicosModel'
import { ProximosAgendamentosModel } from '../models/proximosAgendamentosModel'
import { ProfissionalResumoModel } from '../models/profissionalResumoModel'
import { HorariosDisponiveisModel } from '../models/proximosAgendamentosModel'
import { AgendamentoModel } from '../models/agendamentoModel'
import { AgendamentoClienteDependenteModel } from '../models/agendamentoClienteDependenteModel'
import { ProfissionaisAgendamentosModel } from '../models/profissionaisAgendamentosModel'
import { ProfissionalBloqueioLigthModel, ProfissionalBloqueioModel } from '../models/profissionalBloqueioModel'
import { HorarioDisponivelBloqModel } from '../models/horarioDisponivelBloqModel'
import { InfoProfissionaleAgendaModel } from '../models/infoProfissionaleAgendaModel'
import { ClientePesquisadoModel } from '../models/clientePesquisadoModel'
import { AgendamentoProfissionalModel } from '../models/agendamentoProfissionalModel'
import { ProdutoModel } from '../models/produtoModel'
import { SobrePrecoDescontoModel } from '../models/sobrePrecoDescontoModel'
import { EditarRegistroProdutoModel } from '../models/editarRegistroProdutoModel'
import { EditarRegistroServicoModel } from '../models/editarRegistroServicoModel'

import { RegistrarProdutoModel } from '../models/registrarProdutoModel'
import { RegistrarServicoModel } from '../models/registrarServicoModel'
import { GetServicoProfissionalModel } from '../models/getServicoProfissionalModel'

import { GetRegistroServicoModel } from '../models/getRegistroServicoModel'
import { GetRegistroProdutoModel } from '../models/getRegistroProdutoModel'

import { ColaboradorPesquisadoModel } from '../models/colaboradorPesquisadoModel'
import { CadastroRapidoModel } from '../models/cadastroRapidoModel'
import { ParametrosLightModel } from '../models/parametrosLightModel'
import { HorariosProfissionaisModel } from '../models/horariosProfissionaisModel';
import { HorariosPorProfissionaisModel } from '../models/horariosPorProfissionaisModel'
import { QtdAgProfsModel } from '../models/qtdAgProfsModel';
import { MobilidadeModel } from 'app/shared/models/mobilidade-model';
import { PerfilModel } from 'app/perfil/models/perfil-model';
import { cliforColsAssociacaoModel } from '../models/cliforColsAssociacaoModel';
import { BehaviorSubject } from 'rxjs';
import { cpfClienteModel } from '../models/cpfClienteModel';
import { detalhesClienteModel } from '../models/detalhesClienteModel';

@Injectable({
  providedIn: 'root'
})
export class AgendaService extends BaseService {

  private subjectName = new Subject<any>();
  public i=0;
  public listModais:any = []

  constructor(private http: HttpClient) { super() }

  private messageSource = new BehaviorSubject('default message');
  public currentMessage = this.messageSource.asObservable();


  storyModal(modal:any){
    this.listModais[this.i]=modal
    this.i++
}

  //Funções Criticas
  editarAgentamentoCliente(agendamentoModel: AgendamentoModel) {
    return this.http.put(this.urlServiceCritica + 'OAgendamento/AlterarAgendamentoCliente/' + agendamentoModel.agendasId,
      agendamentoModel, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData)).pipe(catchError(super.serviceError));
  }

  criarAgendamento(agendamentoModel: AgendamentoModel) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.urlServiceCritica + "OAgendamento/MarcarAgendamentoCliente", agendamentoModel, super.ObterAuthHeaderJson()).toPromise().then(res => {
          resolve(res)
        }, error => {
          reject(error)
        })
    })

  }
  buscaCPF(): Observable<cpfClienteModel> {
    return this.http
      .get<cpfClienteModel>(this.urlServiceCritica + 'OCliForCols/BuscarCPF', super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))

  }
  getClienteTemAssinatura(): Observable<boolean> {
    return this.http
      .get<boolean>(this.urlServiceCritica + 'AssinaturaClientes/GetClienteTemAssinatura', super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))
  }
  criarAgendamentoDependente(agendamentoModel: AgendamentoClienteDependenteModel) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.urlServiceCritica + "OAgendamento/MarcarAgendamentoClienteDependente", agendamentoModel, super.ObterAuthHeaderJson()).toPromise().then(res => {
          resolve(res)
        }, error => {
          reject(error)
        })
    })
  }
  criarAgendamentoProfissional(agendamento: AgendamentoProfissionalModel) {
    return this.http
      .post(this.urlServiceCritica + "OAgendamento/MarcarAgendamentoProfissional", agendamento, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData))
      .pipe(catchError(super.serviceError))
  }
  
  getTodosProfissionais(){
    return this.http
    .get<Array<ColaboradorPesquisadoModel>>(this.urlService + "OProfissionais/TodosProfissionaisDisponiveis", super.ObterAuthHeaderJson())
    .pipe(catchError(super.serviceError))
  }
  
  updateAgendamento(agendasId: number, editarAgendamentoProfissionalModel: AgendamentoProfissionalModel): Observable<any> {
    let response = this.http
      .put(this.urlServiceCritica + "OAgendamento/AlterarAgendamentoProfissional/" + agendasId, editarAgendamentoProfissionalModel, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData))
      .pipe(catchError(super.serviceError))
    return response;
  }
  
  patchGestorConfirmaAgendamento(agendasId: number) {
    let response = this.http
      .post(this.urlServiceCritica + 'OAgendamento/ConfirmarAgendamento/' + agendasId, agendasId, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData))
      .pipe(catchError(super.serviceError))

    return response
  }


  //Funções Testadas
  getProximosAgendamentos(): Observable<Array<ProximosAgendamentosModel>> {
    return this.http
      .get<Array<ProximosAgendamentosModel>>(this.urlServiceCritica + "OAgenda/ProximosAgendamentosCliente", super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  getProximosAgendamentosDependente(dependente: number): Observable<Array<ProximosAgendamentosModel>> {
    return this.http
      .get<Array<ProximosAgendamentosModel>>(this.urlServiceCritica + "OAgenda/ProximosAgendamentosClienteDependente?dependenteId=" + dependente.toString(), super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }


    getUsuarioPerfil() {
      let response = this.http
        .get<PerfilModel>(this.urlServiceCritica + 'UsuariosMob/UsuarioInfoPerfil', super.ObterAuthHeaderJson())
        .pipe(catchError(super.serviceError))
  
      return response
    }
  getProfissionalAgendamentos(dataInicial: string, dataFinal: string, profissionalId?: number): Observable<Array<ProfissionaisAgendamentosModel>> {
    return this.http
      .get<Array<ProfissionaisAgendamentosModel>>(this.urlServiceCritica + "OAgenda/GetAgendamentosProfissional?dataInicial=" + dataInicial + "&dataFinal=" + dataFinal + (profissionalId ? '&profissionalId=' + profissionalId : ''), super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  desmarcarBloqueioProfissional(agendasId: number) {
    let response = this.http
      .delete(this.urlServiceCritica + "OAgendasLogAgenda/DesmarcarBloqueio/" + agendasId, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData))
      .pipe(catchError(super.serviceError))

    return response
  }

  getQuantidadeAgendamentosProfissional(data: Date, profissionalId?: number) {
    let promise = new Promise((resolve, reject) => {
      let url = this.urlServiceCritica + "OAgenda/GetQuantidadeAgendamentosProfissional?data=" + data + (profissionalId ? '&profissionalId=' + profissionalId : '')
      this.http.get(url, super.ObterAuthHeaderJson()).toPromise().then(res => {
        resolve(res);
      }, error => {
        reject(error);
      })
    })
    return promise;
  }

  createCadastroRapido(cadastro: CadastroRapidoModel) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.urlServiceCritica + "OCliForColsUsuarioPerfil/CadastroRapidoClientes", cadastro, super.ObterAuthHeaderJson())
        .toPromise().then(res => {
          resolve(res)
        }, error => {
          reject(error)
        })
    })
  }

  getObterAgendamentoDoCliente(data, clienteId): Observable<Array<any>> {
    return this.http
      .get<Array<any>>(this.urlServiceCritica + "OAgenda/ObterAgendamentoDoClienteAA?data=" + data + "&clienteid=" + clienteId, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  getObterQuantidadeAgendamentoDoCliente(data, clienteId): any {
    return this.http
      .get(this.urlServiceCritica + "OAgenda/ObterQuantidadeAgendamentosdoCliente?data=" + data + "&clienteid=" + clienteId, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }



  //Funções Não Testadas

  changeMessage(message: string) {
    this.messageSource.next(message)
  }

  sendUpdate(data: any, profId: any) { //the component that wants to update something, calls this fn
    this.subjectName.next({ data: data, profId: profId }); //next() will feed the value in Subject
  }

  getUpdate(): Observable<any> { //the receiver component calls this function 
    return this.subjectName.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
  }

  deleteAppointment(agendasId: Number) {
    let response = this.http
      .delete(this.urlServiceReports + "OAgendaParamServCli/DesmarcarAgendamentoCliente/" + agendasId, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData))
      .pipe(catchError(super.serviceError))

    return response
  }


  getServicosDisponiveis(): Observable<Array<GServicosModel>> {
    return this.http
      .get<Array<GServicosModel>>(this.urlServiceCritica + "OServicos/GruposServicosDisponiveis", super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }



  getProfissionaisDisponiveis(servicoId: number, dia: string): Observable<Array<ProfissionalResumoModel>> {
    return this.http
      .get<Array<ProfissionalResumoModel>>(this.urlServiceCritica + "OProfissionais/ProfissionaisDisponiveis?servicoId=" + servicoId + "&dia=" + dia, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  getHorariosProfissionaisDisponiveis(profissionaisIds: Array<number>, servicoId: number, dia: string, clienteId?: number): Observable<Array<HorariosProfissionaisModel>> {
    return this.http
      .post<Array<HorariosProfissionaisModel>>(this.urlServiceCritica + "OHorarios/HorariosDisponiveisPorProfissionaisIds?servicoId=" + servicoId + "&dia=" + dia + "&clienteId" + clienteId, profissionaisIds, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))
  }

  getONiboBoletoApp(): Observable<boolean> {
    return this.http
      .get<boolean>(this.urlServiceCritica + 'ONibo/BoletoNiboApp',
        super.ObterAuthHeaderJson()).pipe(catchError(super.serviceError));
  }
  getHorariosProfissionaisDia(servicosId: Array<number>, dia: string): Observable<Array<HorariosPorProfissionaisModel>> {
    return this.http
      .post<Array<HorariosPorProfissionaisModel>>(this.urlService + "OProfissionais/HorariosTodosProfissionaisDia?dia=" + dia, servicosId, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))
  }

  getHorariosDisponiveis(profissionalId: number, servicoId: number, dia: string, clienteId?: number): Observable<Array<HorariosDisponiveisModel>> {
    if (clienteId) {
      return this.http
        .get<Array<HorariosDisponiveisModel>>(this.urlServiceCritica + "OHorarios/HorariosDisponiveis?profissionalId=" + profissionalId + "&servicoId=" + servicoId + "&dia=" + dia + "&clienteId=" + clienteId, super.ObterAuthHeaderJson())
        .pipe(catchError(super.serviceError));
    }
    else {
      return this.http
        .get<Array<HorariosDisponiveisModel>>(this.urlServiceCritica + "OHorarios/HorariosDisponiveis?profissionalId=" + profissionalId + "&servicoId=" + servicoId + "&dia=" + dia, super.ObterAuthHeaderJson())
        .pipe(catchError(super.serviceError));
    }

  }
  

  deleteProfessionalAppointment(agendasId: number) {
    let response = this.http
      .delete(this.urlServiceReports + "OAgendaParamServCli/DesmarcarAgendamentoProfissional/" + agendasId, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData))
      .pipe(catchError(super.serviceError))

    return response
  }


  statusEmAtendimento(agendasId: number) {
    let body = { agendasId }
    return this.http
      .patch(this.urlServiceReports + "Agendas/ClienteEmAtendimento/" + agendasId, body, super.ObterAuthHeaderJson())
  }






  /* getProfissionalBloqueio(dataInicial: string, dataFinal: string, profissionalId?: number): Observable <Array<ProfissionalBloqueioModel>>{
    return this.http
        .get<Array<ProfissionalBloqueioModel>>(this.urlServiceAux + "Agendas/GetBloqueiosProfissional?dataInicial="+ dataInicial+ "&dataFinal=" + dataFinal + (profissionalId? '&profissionalId=' + profissionalId: ''), super.ObterAuthHeaderJson())
        .pipe(catchError(super.serviceError));
} */


  getProfissionalBloqueio(dataInicial: string, dataFinal: string, profissionalId?: number) {
    let promise = new Promise((resolve, reject) => {
      let url = this.urlServiceReports + "Agendas/GetBloqueiosProfissional?dataInicial=" + dataInicial + "&dataFinal=" + dataFinal + (profissionalId ? '&profissionalId=' + profissionalId : '')
      this.http.get<Array<ProfissionalBloqueioModel>>(url, super.ObterAuthHeaderJson())
        .pipe(catchError(super.serviceError)).toPromise().then(res => {
          resolve(res);
        }, error => {
          reject(error);
        });
    })
    return promise;
  }




  criarBloqueio(bloqueioModel: ProfissionalBloqueioModel) {
    return this.http
      .post(this.urlServiceReports + "OBloqueio/CreateBloqueio", bloqueioModel, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData))
      .pipe(catchError(super.serviceError))
  }

  editarObsBloqueio(bloqueioModel: ProfissionalBloqueioLigthModel) {
    return this.http
      .patch(this.urlServiceReports + 'Agendas/UpdateObservacaoBloqueio', bloqueioModel, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData))
      .pipe(catchError(super.serviceError));
  }


  

  getHorarioDispBloqueio(data: string, profissionalId?: number): Observable<Array<HorarioDisponivelBloqModel>> {
    return this.http
      .get<Array<HorarioDisponivelBloqModel>>(this.urlServiceAux2 + "OAgendaParamFiliCli/GetHorariosDispBloqueio?data=" + data + (profissionalId ? '&profissionalId=' + profissionalId : ''), super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }


  getinfoProfissionaleAgenda(data: string, profissionalId?: number): Observable<InfoProfissionaleAgendaModel> {
    return this.http
      .get<InfoProfissionaleAgendaModel>(this.urlServiceAux2 + "OParametrosFiliCli/GetHorarioInicioFimAg?data=" + data + (profissionalId ? '&profissionalId=' + profissionalId : ''), super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }



  

  getClientesPesquisados(searchTerm: string): Observable<Array<ClientePesquisadoModel>> {
    return this.http
      .get<Array<ClientePesquisadoModel>>(this.urlServiceAux2 + "CliForCols/PesquisarClientesAtivos?searchTerm=" + searchTerm, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  getClientesPesquisadosPresentes(searchTerm: string): Observable<Array<ClientePesquisadoModel>> {
    return this.http
      .get<Array<ClientePesquisadoModel>>(this.urlServiceAux2 + "CliForCols/PesquisarClientesAtivosePresentes?searchTerm=" + searchTerm, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  getClientesPresentes(): Observable<Array<ClientePesquisadoModel>> {
    return this.http
      .get<Array<ClientePesquisadoModel>>(this.urlServiceAux2 + "OAgendaCliForCols/GetClientesPresentes", super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  getServicosProfissionalCliente(profissionalId?: number): Observable<Array<GetServicoProfissionalModel>> { //ClientePesquisadoModel
    return this.http
      .get<Array<GetServicoProfissionalModel>>(this.urlService + "OServicoComiGserv/GetServicosProfissional" + (profissionalId ? "?profissionalId=" + profissionalId : ""), super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  getServicosProfissional(profissionalId?: number): Observable<Array<GetServicoProfissionalModel>> { //ClientePesquisadoModel
    return this.http
      .get<Array<GetServicoProfissionalModel>>(this.urlService + "OServicoComiGserv/GetServicosProfissionalCliente" + (profissionalId ? "?profissionalId=" + profissionalId : ""), super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }
  updateTokenNotification(tokens: any): Observable<any> {
    let response = this.http
      .put(this.urlServiceAux2 + "Notification/UpdateTokenNotification", tokens, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData))
      .pipe(catchError(super.serviceError))
    return response;
  }



  getPrecosProdutos(): Observable<Array<ProdutoModel>> {
    return this.http
      .get<Array<ProdutoModel>>(this.urlServiceAux2 + "OProduto/GetProdutosPrecos", super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }


  registrarProduto(agendamento: RegistrarProdutoModel) {
    return this.http
      .post(this.urlServiceAux + "ORegistroProdutos/RegistrarProduto", agendamento, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData))
      .pipe(catchError(super.serviceError))
  }

  registrarServico(agendamento: RegistrarServicoModel) {
    return this.http
      .post(this.urlServiceAux + "ORegistroServicos/RegistrarServico", agendamento, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData))
      .pipe(catchError(super.serviceError))
  }



  updateRegistroProduto(editarRegistroProdutoModel: EditarRegistroProdutoModel): Observable<any> {
    let response = this.http
      .put(this.urlServiceAux2 + "ORegistroProdutos/EditarRegistroProduto", editarRegistroProdutoModel, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData))
      .pipe(catchError(super.serviceError))
    return response;
  }


  updateRegistroServico(editarRegistroServicoModel: EditarRegistroServicoModel): Observable<any> {
    let response = this.http
      .put(this.urlServiceAux2 + "ORegistroServicos/EditarRegistroServico", editarRegistroServicoModel, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData))
      .pipe(catchError(super.serviceError))
    return response;
  }


  deleteRegistroProduto(registroProdutoId: Number) {
    let response = this.http
      .delete(this.urlServiceAux + "ORegistroProdutos/RemoverRegistroProduto/" + registroProdutoId, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData))
      .pipe(catchError(super.serviceError))

    return response
  }

  deleteRegistroServico(registroServicoId: Number) {
    let response = this.http
      .delete(this.urlServiceAux + "ORegistroServicos/RemoverRegistroServico/" + registroServicoId, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData))
      .pipe(catchError(super.serviceError))

    return response
  }


  getRegistrosProdutos(clienteId: number): Observable<Array<GetRegistroProdutoModel>> {
    return this.http
      .get<Array<GetRegistroProdutoModel>>(this.urlServiceAux2 + "ORegistroProd/GetRegistroProdutos?clienteId=" + clienteId, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  getRegistroServicos(clienteId: number): Observable<Array<GetRegistroServicoModel>> {
    return this.http
      .get<Array<GetRegistroServicoModel>>(this.urlServiceAux2 + "ORegistroServ/GetRegistroServicos?clienteId=" + clienteId, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  setExecByProf(agendaId: number) {
    let body = { agendaId }
    return this.http
      .patch(this.urlServiceAux + "Agendas/ExecutadoPeloProfissional/" + agendaId, body, super.ObterAuthHeaderJson())
  }

  getColaboradoresAgendaveisPesquisados(searchTerm: string, agendavel?: boolean): Observable<Array<ColaboradorPesquisadoModel>> {
    return this.http
      .get<Array<ColaboradorPesquisadoModel>>(this.urlServiceAux2 + "CliForCols/PesquisarProfissionaisAtivos?searchTerm=" + searchTerm + (agendavel ? "&agendavel=" + agendavel : ""), super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  getColaboradoresAgendaveisPesquisadosComoGestor(searchTerm: string, agendavel?: boolean): Observable<Array<ColaboradorPesquisadoModel>> {
    return this.http
      .get<Array<ColaboradorPesquisadoModel>>(this.urlServiceAux2 + "CliForCols/PesquisarProfissionaisAtivosComoGestor?searchTerm=" + searchTerm + (agendavel ? "&agendavel=" + agendavel : ""), super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  

  getParametrosLight(): Observable<ParametrosLightModel> {
    return this.http
      .get<ParametrosLightModel>(this.urlServiceAux2 + "Parametros/ParametrosLight", super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  



  getClaims(empresaId, filialId): any {
    return this.http
      .get(this.urlServiceAux + "OLoginEmpresa/GetClaims?empresaId=" + empresaId + "&filialId=" + filialId, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  getQuantidadeBloqueiosProfissional(data: Date, profissionalId?: number): Observable<Array<QtdAgProfsModel>> {
    return this.http
      .get<Array<QtdAgProfsModel>>(this.urlServiceAux2 + "Agendas/GetQuantidadeBloqueiosProfissional?data=" + data + (profissionalId ? '&profissionalId=' + profissionalId : ''), super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  getComiservs(servicoid, clienteId): any {
    return this.http
      .get(this.urlServiceAux + "OComissaoProfissional/GetComiservs?servicoid=" + servicoid + "&clienteid=" + clienteId, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  

  getBuscaInfoCliente(clienteId): any{
    return this.http
    .get(this.urlServiceAux + "OCliForCols/BuscaInfoCliente?clientesId=" + clienteId, super.ObterAuthHeaderJson())
    .pipe(catchError(super.serviceError));
  }

  updateInfoCliente(detalhesCliente: detalhesClienteModel): Observable<any> {
    let response = this.http
      .post(this.urlServiceCritica + "OCliForCols/UpdateInfoCliente", detalhesCliente, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData))
      .pipe(catchError(super.serviceError))
    return response;
  }

  atualizarAppId() {
    return this.http.put(this.urlServiceAux + 'OLoginUsuario/AtualizarAppId', null, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData)).pipe(catchError(super.serviceError));
  }

  getNumerosInvalidos(filiaisId): any {
    return this.http
      .get(this.urlServiceAux + "OUsuario/GetCacheClientesNumeroInvalido?filiaisId=" + filiaisId, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  atualizaCelular(email, celular) {
    return this.http.put(this.urlServiceAux + 'OUsuario/UpdateCadastroByPhone?email=' + email + "&celular=" + celular, null, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData)).pipe(catchError(super.serviceError));
  }

  getClienteAsssinaturaJaMarcado(servicosId) : Promise<any>{
    return new Promise((resolve,reject)=>{
      this.http.post(this.urlService + "OProfissionais/ClienteAssinanteJaMarcado", servicosId, super.ObterAuthHeaderJson()).toPromise().then(res => {
        resolve(res);
      },error =>{
        reject(error);
      }) 
    })
  }

  getNomeServicoAgendamento(agendasId?: number): Promise<any> {
 return new Promise((resolve,reject)=>{
  this.http.get(this.urlService+"OServicos/GetServicoAgenda?" + "agendasId="+agendasId, super.ObterAuthHeaderJson()).toPromise().then(res =>{
    resolve(res);
  }, error =>{
    reject(error);
  })
 })
}

  removerNumeroInvalidoCache(filiaisId, email): Observable<any> {
    let response = this.http
      .put(this.urlServiceCritica + "OUsuario/ClearCacheClientesNumeroInvalidoByClienteNumeroInvalido?filiaisId=" + filiaisId + "&email=" + email, null, super.ObterAuthHeaderJson())
      .pipe(map(super.extractData))
      .pipe(catchError(super.serviceError))
    return response;
  }

  getEmpresaPorMobilidade(empresaId, filialId): Observable<boolean> {
    return this.http
      .get<boolean>(this.urlServiceCritica + "Mobilidades/MobilidadeInadimplente?empresaId=" + empresaId + "&filialId=" + filialId, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  getGetServicosAgendados(clienteid): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      let url = this.urlServiceAux + "ORegistroServicos/GetServicosAgendados?clienteid=" + clienteid
      this.http.get(url, super.ObterAuthHeaderJson()).toPromise().then(res => {
        resolve(res);
      }, error => {
        reject(error);
      })
    })
    return promise;
  }


  getVersaoAtual(os, linkLoja, mobilidade): any {
    return this.http
      .get(this.urlServiceAux + "OUtil/VersaoAtual?OS=" + os + "&linkLoja=" + linkLoja + "&mobilidade=" + mobilidade, super.ObterHeaderJson())
      .pipe(map(super.extractData))
      .pipe(catchError(super.serviceError));
  }

  getAssociacoesUsuario(cliforcolsId: number, dependentes: boolean = true): Promise<Array<cliforColsAssociacaoModel>> {
    let promise = new Promise<Array<cliforColsAssociacaoModel>>((resolve, reject) => {
      let url = this.urlServiceAux + "OCliForColsUsuarioPerfil/GetAssociacoesUsuario?cliforcolsid=" + cliforcolsId.toString() + (dependentes == false ? "&dependentes=" + dependentes : "")
      this.http.get<Array<cliforColsAssociacaoModel>>(url, super.ObterAuthHeaderJson()).toPromise().then(res => {
        resolve(res);
      }, error => {
        reject(error);
      })
    })
    return promise;
  }

}
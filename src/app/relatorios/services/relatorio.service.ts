import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { BaseService } from 'app/core/services/base.service';
import { ReceitasApuradasModel } from '../models/receitas-apuradas-model';
import { TopClientesModel } from '../models/topClientesModel'
import { Observable } from 'rxjs';
import { TopProdutosModel } from '../models/top-produtos-model';
import { TopServicosModel } from '../models/top-servicos-model';
import { TopFaturamentoModel } from '../models/top-faturamento-model';
import { LucratividadeGeralModel } from '../models/lucratividade-geral-model';
import { AvaliacoesModel } from '../models/avaliacoes-model';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService extends BaseService {

  constructor(private http: HttpClient) { super() }

  getReceitasApuradas(dataInicial: string, dataFinal: string) {
    return this.http
      .get<ReceitasApuradasModel>(this.urlServiceReports + 'OFichaclisProdsServs/GetReceitasApuradas?dataInicial=' + dataInicial + '&dataFinal=' + dataFinal, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))
  }

  getTopClientes(dataInicial: string, dataFinal: string): Observable<TopClientesModel> {
    return this.http
      .get<TopClientesModel>(this.urlServiceReports + "OFichaclis/GetTopClientes?dataInicial=" + dataInicial + '&dataFinal=' + dataFinal, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  getReceitasEstimadas(dataInicial: string, dataFinal: string) {
    return this.http
      .get(this.urlServiceReports + 'OAgendaComiservs/GetReceitaEstimada?dataInicial=' + dataInicial + '&dataFinal=' + dataFinal, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))
  }

  getTopProdutos(dataInicial: string, dataFinal: string) {
    return this.http
      .get<TopProdutosModel>(this.urlServiceReports + 'OFichaclisProduto/GetTopProdutos?dataInicial=' + dataInicial + '&dataFinal=' + dataFinal, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))
  }

  getTopServicos(dataInicial: string, dataFinal: string) {
    return this.http
      .get<TopServicosModel>(this.urlServiceReports + 'OFichaclisServico/GetTopServicos?dataInicial=' + dataInicial + '&dataFinal=' + dataFinal, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))
  }

  getTopFaturamento(dataInicial: string, dataFinal: string) {
    return this.http
      .get<TopFaturamentoModel>(this.urlServiceReports + 'OFichaclis/GetTopFaturamento?dataInicial=' + dataInicial + '&dataFinal=' + dataFinal, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))
  }

  getTopLucratividade(dataInicial: string, dataFinal: string) {
    return this.http
      .get<TopFaturamentoModel>(this.urlServiceReports + 'OFichaclis/GetTopLucratividade?dataInicial=' + dataInicial + '&dataFinal=' + dataFinal, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))
  }

  getLucratividadeGeral(dataInicial: string, dataFinal: string) {
    return this.http
      .get<Array<LucratividadeGeralModel>>(this.urlServiceReports + 'OFichaclis/GetLucratividadeGeral?dataInicial=' + dataInicial + '&dataFinal=' + dataFinal, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))
  }

  getAvaliacoes(dataInicial: string, dataFinal: string) {
    return this.http
      .get<AvaliacoesModel>(this.urlServiceReports + 'OAvaliacoes/GetAvaliacoes?dataInicial=' + dataInicial + '&dataFinal=' + dataFinal, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))
  }

  getMovimentacoesPorData(dataInicio: String, dataFim: String): any {
    return this.http
      .get(this.urlServiceReports + "OLojaWhatsApp/GetMovimentacoesPorData?dataInicio=" + dataInicio + "&dataFim=" + dataFim, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError));
  }

  ExisteEmpresaComWhatsapp(): any {
    return this.http.get(this.urlServiceReports + "OLojaWhatsApp/ExisteEmpresa", super.ObterAuthHeaderJson()).pipe(catchError(super.serviceError));
  }


  getFichasProdutivade(dataInicio, dataFim):any {
    return this.http.get(this.urlServiceReports + "OCliForCols/DetalhesProdutividadeProfissional?dataInicial=" + dataInicio + "&dataFinal=" + dataFim, super.ObterAuthHeaderJson())
    .pipe(catchError(super.serviceError))
  }

  getRelatoriosAssinaturas(dataInicio, dataFim) {
    return this.http.get(this.urlServiceReports + "ORelatorioAssinatura/RelatorioAssinaturas?dataInicial="+ dataInicio + "&dataFinal=" + dataFim, super.ObterAuthHeaderJson()).pipe(catchError(super.serviceError))
  }
}
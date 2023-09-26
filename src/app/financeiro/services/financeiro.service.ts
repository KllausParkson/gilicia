import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { catchError } from 'rxjs/operators';

import { BaseService } from "../../core/services/base.service";
import { ComissaoProfissionalModel } from "../models/comissaoProfissionalModel";
import { FaturamentoProfissionalModel } from "../models/faturamentoProfissionalModel";
import { ProdutividadeProfissionalModel } from "../models/produtividadeProfissionalModel";
import { HistoricoModel } from "app/perfil/models/historico-model";
import { HistoricoObservacoesAgModel } from "app/perfil/models/historico-observacoes-model";
@Injectable()
export class FinanceiroService extends BaseService {

  constructor(private http: HttpClient){ super() }    
    
  getComissao(dataInicial: string, dataFinal: string): Observable<ComissaoProfissionalModel>{
    return this.http
          .get<ComissaoProfissionalModel>(this.urlService + "OComissaoProfissional/GetComissoesProfissional?dataInicial=" + dataInicial + "&dataFinal=" + dataFinal, super.ObterAuthHeaderJson())
          .pipe(catchError(super.serviceError));
  }

  getFaturamento(dataInicial: string, dataFinal: string): Observable<FaturamentoProfissionalModel>{
    return this.http
          .get<FaturamentoProfissionalModel>(this.urlService + "ORelatorioFaturamento/RelatorioFaturamentoProfissional?dataInicial=" + dataInicial + "&dataFinal=" + dataFinal, super.ObterAuthHeaderJson())
          .pipe(catchError(super.serviceError));
  }

  getProdutividade(dataInicial: string, dataFinal: string): Observable<ProdutividadeProfissionalModel>{
    return this.http
          .get<ProdutividadeProfissionalModel>(this.urlService + "OCliForCols/DetalhesProdutividadeProfissional?dataInicial=" + dataInicial + "&dataFinal=" + dataFinal, super.ObterAuthHeaderJson())
          .pipe(catchError(super.serviceError));
  }

  getHistoricoColaboradorCliente(ordem: number, clienteID: number): Observable<Array<HistoricoModel>> {
    return this.http
      .get<Array<HistoricoModel>>(this.urlService + `OAgendaCliProdServ/GetHistoricoAgendamentosClienteGestor/${ordem}/${clienteID}`, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))
  }
  
  getHistoricoObservacaoCliente(ordem: number, clienteID: number): Observable<Array<HistoricoObservacoesAgModel>> {
    return this.http
      .get<Array<HistoricoObservacoesAgModel>>(this.urlService + `OAgendaCliForCols/GetHistoricoObservacoesClienteGestor/?clienteid=` + clienteID +`&ordem=`+ordem, super.ObterAuthHeaderJson())
      .pipe(catchError(super.serviceError))
  }
}

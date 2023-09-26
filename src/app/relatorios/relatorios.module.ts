import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RelatoriosPageRoutingModule } from './relatorios-routing.module';

import { RelatoriosPage } from './relatorios.page';
import { SharedModule } from '../shared/shared.module';
import { ReceitasApuradasComponent } from './receitas-apuradas/receitas-apuradas.component';
import { FinanceiroPageModule } from '../financeiro/financeiro.module';
import { RelatorioClientesComponent } from './relatorio-clientes/relatorio-clientes.component';
import { RelatorioChatbotComponent } from './relatorio-chatbot/relatorio-chatbot.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from "ngx-translate-multi-http-loader";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReceitasEstimadasComponent } from './receitas-estimadas/receitas-estimadas.component';
import { RelatoriosProdutosComponent } from './relatorios-produtos/relatorios-produtos.component';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { RelatorioServicosComponent } from './relatorio-servicos/relatorio-servicos.component';
import { RelatorioFaturamentoComponent } from './relatorio-faturamento/relatorio-faturamento.component';
import { RelatorioLucratividadeComponent } from './relatorio-lucratividade/relatorio-lucratividade.component';
import { RelatorioLucratividadeGeralComponent } from './relatorio-lucratividade-geral/relatorio-lucratividade-geral.component';
import { ExtratoChatbotComponent } from './relatorio-chatbot/extrato-chatbot/extrato-chatbot.component'
import { RelatorioPesquisaSatisfacaoComponent } from './relatorio-pesquisa-satisfacao/relatorio-pesquisa-satisfacao.component';
import { DetalhesAvaliacoesModalComponent } from './modals/detalhes-avaliacoes-modal/detalhes-avaliacoes-modal.component';
import { RelatorioAssinaturasComponent } from './relatorio-assinaturas/relatorio-assinaturas.component';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    {prefix: "./assets/i18n/agenda/", suffix: ".json"},
    {prefix: "./assets/i18n/shared/", suffix: ".json"},
    {prefix: "./assets/i18n/financeiro/", suffix: ".json"},
    {prefix: "./assets/i18n/relatorio/", suffix: ".json"},
  ]);
}


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RelatoriosPageRoutingModule,
    SharedModule,
    FinanceiroPageModule,
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    ChartsModule
  ],
  declarations: [
    RelatoriosPage,
    ReceitasApuradasComponent,
    RelatorioClientesComponent,
    ReceitasEstimadasComponent,
    RelatoriosProdutosComponent,
    RelatorioServicosComponent,
    RelatorioFaturamentoComponent,
    RelatorioLucratividadeComponent,
    RelatorioLucratividadeGeralComponent,
    RelatorioChatbotComponent,
    ExtratoChatbotComponent, 
    RelatorioPesquisaSatisfacaoComponent,
    DetalhesAvaliacoesModalComponent,
    RelatorioAssinaturasComponent
  ]
})
export class RelatoriosPageModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReceitasApuradasComponent } from './receitas-apuradas/receitas-apuradas.component';

import { RelatoriosPage } from './relatorios.page';
import { RelatorioChatbotComponent } from './relatorio-chatbot/relatorio-chatbot.component'
import { RelatorioClientesComponent } from './relatorio-clientes/relatorio-clientes.component'
import { ReceitasEstimadasComponent } from './receitas-estimadas/receitas-estimadas.component';
import { RelatoriosProdutosComponent } from './relatorios-produtos/relatorios-produtos.component';
import { RelatorioServicosComponent } from './relatorio-servicos/relatorio-servicos.component';
import { RelatorioFaturamentoComponent } from './relatorio-faturamento/relatorio-faturamento.component';
import { RelatorioLucratividadeComponent } from './relatorio-lucratividade/relatorio-lucratividade.component';
import { RelatorioLucratividadeGeralComponent } from './relatorio-lucratividade-geral/relatorio-lucratividade-geral.component';
import { RelatorioPesquisaSatisfacaoComponent } from './relatorio-pesquisa-satisfacao/relatorio-pesquisa-satisfacao.component';
import { RelatorioAssinaturasComponent } from './relatorio-assinaturas/relatorio-assinaturas.component';

const routes: Routes = [
  {
    path: '',
    component: RelatoriosPage,
    children: [
      { path: '', redirectTo: 'login' },
      { path: 'receitas-apuradas', component: ReceitasApuradasComponent, pathMatch: 'full' },
      { path: 'clientes', component: RelatorioClientesComponent, pathMatch: 'full'},
      { path: 'receitas-estimadas', component: ReceitasEstimadasComponent, pathMatch: 'full'},
      { path: 'produtos', component: RelatoriosProdutosComponent, pathMatch: 'full'},
      { path: 'servicos', component: RelatorioServicosComponent, pathMatch: 'full'},
      { path: 'faturamento', component: RelatorioFaturamentoComponent, pathMatch: 'full'},
      { path: 'lucratividade', component: RelatorioLucratividadeComponent, pathMatch: 'full'},
      { path: 'lucratividade-geral', component: RelatorioLucratividadeGeralComponent, pathMatch: 'full'},
      { path: 'resumo-chatbot', component: RelatorioChatbotComponent, pathMatch: 'full' },
      { path: 'avaliacoes', component: RelatorioPesquisaSatisfacaoComponent, pathMatch: 'full'},
      { path: 'assinaturas', component: RelatorioAssinaturasComponent, pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelatoriosPageRoutingModule {}

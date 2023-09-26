import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinanceiroPage } from './financeiro.page';

import { ComissaoFinanceiroComponent } from './comissao-financeiro/comissao-financeiro.component';
import { FaturamentoFinanceiroComponent } from './faturamento-financeiro/faturamento-financeiro.component';
import { ProdutividadeFinanceiroComponent } from './produtividade-financeiro/produtividade-financeiro.component';
import { HistoricoClienteComponent } from './historico-cliente/historico-cliente.component';

import { AuthService } from "../core/services/auth.service";


const routes: Routes = [
  {
    path: '', component: FinanceiroPage,
    children: [
        { path: 'comissao', canActivate: [AuthService], component: ComissaoFinanceiroComponent, data: [{ claim: { nome: 'Comissões', valor: 'Visualizar Extrato' }}] },
        { path: 'faturamento', canActivate: [AuthService], component: FaturamentoFinanceiroComponent, data: [{ claim: { nome: 'Relatórios', valor: 'Visualizar Faturamento' }}] },
        { path: 'produtividade', canActivate: [AuthService], component: ProdutividadeFinanceiroComponent, data: [{ claim: { nome: 'Relatórios', valor: 'Visualizar Produtividade' }}] },
        { path: 'historico-cliente', canActivate: [AuthService], component: HistoricoClienteComponent, data: [{ claim: { nome: 'Relatórios', valor: 'Visualizar Produtividade' }}] }
    ]
  }
];

export const FinanceiroPageRoutingModule: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);

import { RouterModule, Routes } from '@angular/router';
import { ConfirmacaoCadastroComponent } from './confirmacao-cadastro/confirmacao-cadastro.component';
import { CancelarInscricaoComponent } from './cancelar-inscricao/cancelar-inscricao.component';
import { RecuperarContaComponent } from './recuperar-conta/recuperar-conta.component';
import { ModuleWithProviders } from '@angular/core';
import { LoginPage } from './login.page';
import { EscolherPerfilComponent } from './escolher-perfil/escolher-perfil.component';

const routes: Routes = [
  {
    path: '',
    component: LoginPage,
    children: [
      { path: '', redirectTo: 'login'},
      { path: 'confirmacao-cadastro', component: ConfirmacaoCadastroComponent, pathMatch:'full' },
      { path: 'cancelar-inscricao', component: CancelarInscricaoComponent, pathMatch:'full' },
      { path: 'recuperar-conta', component: RecuperarContaComponent, pathMatch:'full' },
      { path: 'escolher-perfil', component: EscolherPerfilComponent, pathMatch:'full' },
    ]
  }
];

export const LoginPageRoutingModule: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);

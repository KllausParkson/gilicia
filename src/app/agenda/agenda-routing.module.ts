import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
//import { environment } from '../environments/environment';

import { ModuleWithProviders } from '@angular/core';
import { AgendaClienteComponent } from './agenda-cliente/agenda-cliente.component'
import { AgendaProfissionalComponent } from './agenda-profissional/agenda-profissional.component'
import { AgendaPage } from './agenda.page'
import { CalendarioComponent } from './calendario/calendario.component'
import { AgendaGestorComponent } from './agenda-gestor/agenda-gestor.component'

const routes: Routes = [
  {
    path: '',
    component: AgendaPage,
    children: [
      { path: '', redirectTo: 'agenda'},
      { path: 'agenda-cliente', component: AgendaClienteComponent, pathMatch:'full' },
      { path: 'agenda-profissional', component: AgendaProfissionalComponent, pathMatch:'full' },
      { path: 'agenda-gestor', component: AgendaGestorComponent, pathMatch:'full' },
      { path: 'calendario', component: CalendarioComponent, pathMatch:'full' },
  ]
  },
  // {
  //   path:'/login/confirmacao-cadastro',
  //   component: ConfirmacaoCadastroComponent
  // },
  // {
  //   path: '/login/escolher-perfil', 
  //   component: EscolherPerfilComponent
  // }
];



export const AgendaPageRoutingModule: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);

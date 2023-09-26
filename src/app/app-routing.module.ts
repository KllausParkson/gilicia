// import { NgModule } from '@angular/core';
// import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
// import { environment} from '../environments/environment'

// const routes: Routes = [
//   { path: '', children: [], pathMatch: 'full' },
//   { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
//   { path: 'login/:id', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
//   { path: 'agenda', loadChildren: () => import('./agenda/agenda.module').then(m => m.AgendaPageModule) },
//   { path: 'financeiro', loadChildren: () => import('./financeiro/financeiro.module').then(m => m.FinanceiroPageModule) },
//   { path: 'perfil', loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilPageModule) },
//   { path: 'relatorios', loadChildren: () => import('./relatorios/relatorios.module').then( m => m.RelatoriosPageModule)},
//   { path: '**', redirectTo: `${environment.production ? environment.name + '/login/' : 'login/'}`},

// ];

// @NgModule({
//   imports: [
//     RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
//   ],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: './login' },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'login/:id', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'agenda', loadChildren: () => import('./agenda/agenda.module').then(m => m.AgendaPageModule) },
  { path: 'financeiro', loadChildren: () => import('./financeiro/financeiro.module').then(m => m.FinanceiroPageModule) },
  { path: 'perfil', loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilPageModule) },
  { path: 'relatorios', loadChildren: () => import('./relatorios/relatorios.module').then(m => m.RelatoriosPageModule) },
  { path: '**', redirectTo: `${environment.production ? environment.name + '/login/' : 'login/'}` },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

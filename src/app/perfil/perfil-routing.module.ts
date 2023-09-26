import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerfilClienteComponent } from './perfil-cliente/perfil-cliente.component';
import { PerfilColaboradorComponent } from './perfil-colaborador/perfil-colaborador.component';

import { PerfilPage } from './perfil.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilPage,
    children: [
      { path: '', redirectTo: 'agenda'},
      { path: 'perfil-colaborador', component: PerfilColaboradorComponent, pathMatch:'full' },
      { path: 'perfil-cliente', component: PerfilClienteComponent, pathMatch:'full' }
    ]
  },
  {
    path: 'fidelidade-onepoints',
    loadChildren: () => import('./modals/fidelidade-onepoints/fidelidade-onepoints.component').then( m => m.FidelidadeOnepointsComponent)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilPageRoutingModule {}

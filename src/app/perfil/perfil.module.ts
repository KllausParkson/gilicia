import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {MultiTranslateHttpLoader} from 'ngx-translate-multi-http-loader';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {IntlModule} from '@progress/kendo-angular-intl';
import {LabelModule} from '@progress/kendo-angular-label';


import {PerfilPageRoutingModule} from './perfil-routing.module';

import {PerfilPage} from './perfil.page';
import {EditarPerfilModalComponent} from './modals/editar-perfil-modal/editar-perfil-modal.component';
import {InputsModule} from '@progress/kendo-angular-inputs';
import {PopupModule} from '@progress/kendo-angular-popup';
import {DateInputsModule, MultiViewCalendarModule} from '@progress/kendo-angular-dateinputs';
import {UploadsModule} from '@progress/kendo-angular-upload';
import {FloatingLabelModule} from '@progress/kendo-angular-label';
import {SharedModule} from '../shared/shared.module';
import {PerfilClienteComponent} from './perfil-cliente/perfil-cliente.component';
import {PerfilColaboradorComponent} from './perfil-colaborador/perfil-colaborador.component';
import {RouterModule, Routes} from '@angular/router';
import {EditarPerfilColaboradorModalComponent} from './modals/editar-perfil-colaborador-modal/editar-perfil-colaborador-modal.component';
import {AvaliacoesModalComponent} from './modals/avaliacoes-modal/avaliacoes-modal.component';
import {FinanceiroPageModule} from '../financeiro/financeiro.module';
import {FidelidadeOnepointsComponent} from './modals/fidelidade-onepoints/fidelidade-onepoints.component';
import {FiltrarAvaliacoesComponent} from './modals/filtrar-avaliacoes/filtrar-avaliacoes.component';
import { ConfirmaEstabelecimentoComponent } from './perfil-cliente/confirma-estabelecimento/confirma-estabelecimento.component';
import { EditarSenhaComponent } from './modals/editar-perfil-colaborador-modal/editar-senha/editar-senha.component';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    {prefix: './assets/i18n/perfil/', suffix: '.json'},
    {prefix: './assets/i18n/shared/', suffix: '.json'},
    {prefix: './assets/i18n/financeiro/', suffix: '.json'},
  ]);
}

const routes: Routes = [
  {
    path: '',
    component: PerfilPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PopupModule,
        MultiViewCalendarModule,
        IntlModule,
        LabelModule,
        IonicModule,
        PerfilPageRoutingModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        InputsModule,
        FloatingLabelModule,
        ReactiveFormsModule,
        SharedModule,
        RouterModule.forChild(routes),
        UploadsModule,
        FinanceiroPageModule,
        DateInputsModule
    ],
    declarations: [
        PerfilPage,
        EditarPerfilModalComponent,
        PerfilClienteComponent,
        ConfirmaEstabelecimentoComponent,
        EditarSenhaComponent,
        PerfilColaboradorComponent,
        EditarPerfilColaboradorModalComponent,
        FiltrarAvaliacoesComponent,
        AvaliacoesModalComponent,
        FidelidadeOnepointsComponent
    ]
})
export class PerfilPageModule {
}

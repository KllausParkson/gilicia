import { EditarObservacaoBloqueioComponent } from './modals/editar-observacao-bloqueio/editar-observacao-bloqueio.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MultiTranslateHttpLoader } from "ngx-translate-multi-http-loader";
import { AgendaPage } from './agenda.page';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AgendaService } from './services/agenda.service'
import { NovoAgendamentoComponent } from './modals/novo-agendamento/novo-agendamento.component'
import { GroupTemplateDirective } from '@progress/kendo-angular-dropdowns';
import { CadastroRapidoClienteComponent } from './modals/cadastro-rapido-cliente/cadastro-rapido-cliente.component'
import { ConfirmacaoAgendamentoComponent } from './modals/confirmacao-agendamento/confirmacao-agendamento.component'
import { DiasRetornoDetalhesClienteComponent } from './modals/dias-retorno-detalhes-cliente/dias-retorno-detalhes-cliente.component';





// import { SchedulerModule } from '@progress/kendo-angular-scheduler';
// import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
// import { IntlModule } from '@progress/kendo-angular-intl';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
// import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { FloatingLabelModule } from '@progress/kendo-angular-label';
// import { TextBoxModule, InputsModule } from '@progress/kendo-angular-inputs';
// import { DialogModule } from '@progress/kendo-angular-dialog';
import { PopupModule } from '@progress/kendo-angular-popup';
import { AgendaPageRoutingModule } from './agenda-routing.module'

import { AgendaClienteComponent } from './agenda-cliente/agenda-cliente.component'
import { AgendaProfissionalComponent } from './agenda-profissional/agenda-profissional.component'

import { OpcoesAgendamentoComponent } from './modals/opcoes-agendamento/opcoes-agendamento.component'
import { OpcoesHorariolivreComponent } from './modals/opcoes-horariolivre/opcoes-horariolivre.component'

import { NovoBloqueioComponent } from './modals/novo-bloqueio/novo-bloqueio.component'

import { OpcoesBloqueioComponent } from './modals/opcoes-bloqueio/opcoes-bloqueio.component'
import { NovoAgendamentoProfissionalComponent } from './modals/novo-agendamento-profissional/novo-agendamento-profissional.component'

import { CalendarioComponent } from './calendario/calendario.component'

import { ResumoAgendamentoProfissionalComponent } from './modals/resumo-agendamento-profissional/resumo-agendamento-profissional.component'
import { KendoInput } from '@progress/kendo-angular-common';

import {InputsModule, NumericTextBoxModule} from '@progress/kendo-angular-inputs';

import { ServicoPesquisadoModalComponent } from './modals/servico-pesquisado-modal/servico-pesquisado-modal.component'

import { EditarAgendamentoClienteModalComponent } from './modals/editar-agendamento-cliente-modal/editar-agendamento-cliente-modal.component'
import { AvaliarAppModalComponent } from './modals/avaliar-app-modal/avaliar-app-modal.component'
import { AgendaGestorComponent } from './agenda-gestor/agenda-gestor.component'
import { NovaQuimicaComponent } from './modals/nova-quimica/nova-quimica.component'
import { EdicaoQuimicaComponent } from './modals/edicao-quimica/edicao-quimica.component'
import { OutrosAgendamentosDoClienteComponent } from './modals/outros-agendamentos-do-cliente/outros-agendamentos-do-cliente.component'

import { ProdutoPesquisadoQuimicaComponent } from './modals/produto-pesquisado-quimica/produto-pesquisado-quimica.component'

import { CpfcnpjPipe } from '../core/pipes/cpfcnpj.pipe'

import {TruncateModule} from 'ng2-truncate';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { PopoverAtendimentoComponent } from './modals/resumo-agendamento-profissional/popover-atendimento/popover-atendimento.component';
import { ServicoAssinaturaMarcadoComponent } from './modals/servico-assinatura-marcado/servico-assinatura-marcado.component';

import { NgCalendarModule } from 'ionic2-calendar'
import { AtualizarCelularComponent } from './modals/atualizar-celular/atualizar-celular.component';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { Market } from '@awesome-cordova-plugins/market/ngx';
import { AppComponent } from '../app.component';
import { CalendarModule } from 'ion2-calendar-week';
import { InadimplenciaComponent } from './modals/mensagem-inadimplencia/mensagem-inadimplencia.component';
import { CurriculoComponent } from './modals/curriculo/curriculo-modal.component';
import { ServicoProfissionalComponent } from './modals/servico-profissional/servico-profissional.component';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    {prefix: "./assets/i18n/agenda/", suffix: ".json"},
    {prefix: "./assets/i18n/shared/", suffix: ".json"},
    {prefix: "./assets/i18n/financeiro/", suffix: ".json"},
  ]);
}

const routes: Routes = [
  {
    path: '',
    component: AgendaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AgendaPageRoutingModule,
    IonicModule,
    ReactiveFormsModule,
    NumericTextBoxModule,
    FloatingLabelModule,
    DateInputsModule,
    DropDownsModule,
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    SharedModule,
    RouterModule.forChild(routes),
    TruncateModule,
    InputsModule,
    MatTooltipModule,
    MatButtonModule,
    NgCalendarModule,
    CalendarModule
  ],
  declarations: [
    NovoBloqueioComponent,
    AgendaPage,
    OpcoesBloqueioComponent,
    CalendarioComponent,
    NovaQuimicaComponent,
    AvaliarAppModalComponent,
    EditarAgendamentoClienteModalComponent,
    ServicoPesquisadoModalComponent,
    NovoAgendamentoProfissionalComponent,
    OpcoesHorariolivreComponent,
    OpcoesAgendamentoComponent,
    CadastroRapidoClienteComponent,
    ConfirmacaoAgendamentoComponent,
    DiasRetornoDetalhesClienteComponent,
    InadimplenciaComponent,
    NovoAgendamentoComponent,
    ServicoProfissionalComponent,
    ProdutoPesquisadoQuimicaComponent,
    AgendaClienteComponent,
    AgendaProfissionalComponent,
    ServicoAssinaturaMarcadoComponent,
    CurriculoComponent,
    AgendaGestorComponent,
    ResumoAgendamentoProfissionalComponent,
    EdicaoQuimicaComponent,
    CpfcnpjPipe,
    EditarObservacaoBloqueioComponent,
    PopoverAtendimentoComponent,
    OutrosAgendamentosDoClienteComponent,
    AtualizarCelularComponent
  ],
  providers: [AgendaService,CpfcnpjPipe, Market, AppVersion, AppComponent],
})
export class AgendaPageModule {}

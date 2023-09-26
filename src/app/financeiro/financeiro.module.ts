import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PopupModule } from '@progress/kendo-angular-popup';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from "ngx-translate-multi-http-loader";
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';

import { FinanceiroService } from './services/financeiro.service';
import { AuthService } from "../core/services/auth.service";
import { ErrorInterceptor } from '../core/services/error.handler.service';

import { FinanceiroPageRoutingModule } from './financeiro-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FinanceiroPage } from './financeiro.page';

import { ComissaoFinanceiroComponent } from './comissao-financeiro/comissao-financeiro.component';
import { FaturamentoFinanceiroComponent } from './faturamento-financeiro/faturamento-financeiro.component';
import { ProdutividadeFinanceiroComponent } from './produtividade-financeiro/produtividade-financeiro.component';
import { DataToolbarComponent } from './data-toolbar/data-toolbar.component';
import { HistoricoClienteComponent } from './historico-cliente/historico-cliente.component';
import { ComboBoxComponent, ComboBoxModule } from '@progress/kendo-angular-dropdowns';
import {FloatingLabelModule} from '@progress/kendo-angular-label';
import { CardHistoricoClienteComponent } from '../perfil/perfil-cliente/card-historico-cliente/card-historico-cliente.component';
import { HistoricoObservacaoClienteComponent } from './historico-observacao-cliente/historico-observacao-cliente.component';
export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    {prefix: "./assets/i18n/financeiro/", suffix: ".json"},
    {prefix: "./assets/i18n/shared/", suffix: ".json"},
  ]);
}

@NgModule({
  imports: [
    CommonModule,
    ComboBoxModule,
    FormsModule,
    FloatingLabelModule,
    IonicModule,
    FinanceiroPageRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    SharedModule,
    PopupModule,
    DateInputsModule
  ],
  declarations: [
    FinanceiroPage, 
    ComissaoFinanceiroComponent,
    FaturamentoFinanceiroComponent,
    ProdutividadeFinanceiroComponent,
    DataToolbarComponent,
    HistoricoClienteComponent,
    CardHistoricoClienteComponent,
    HistoricoObservacaoClienteComponent,
  ],
  providers: [
    FinanceiroService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    AuthService
  ],
  exports: [
    DataToolbarComponent,
    CardHistoricoClienteComponent
  ]
})
export class FinanceiroPageModule {}

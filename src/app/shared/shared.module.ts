import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Tradução
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from "ngx-translate-multi-http-loader";
import { HttpClient } from '@angular/common/http';
import { LocaleSharedComponent } from './locale-shared/locale-shared.component';
import { CurrencyGlobalPipe } from '../core/pipes/currencyGlobal.pipe';
import { ReplacePipe } from '../core/pipes/replace.pipe';

//modulos
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { IonicModule } from '@ionic/angular';
import { FloatingLabelModule } from '@progress/kendo-angular-label';
import { MenuComponent } from './menu-shared/menu.component';
import { NotificationSharedComponent } from './notification-shared/notification-shared.component';
import { NotificationModalSharedComponent } from './notification-shared/notification-modal-shared/notification-modal-shared.component';
import { AvaliarColaboradorModalComponent } from './avaliar-colaborador-modal/avaliar-colaborador-modal.component';
import { ConfirmarPerfilModalComponent } from './confirmar-perfil-modal/confirmar-perfil-modal.component';
import { RelatarBugComponent } from './relatar-bug-modal/relatar-bug-modal.component';
import { PopoverOpcoesSharedComponent } from './menu-shared/popover-opcoes-shared/popover-opcoes-shared.component';
import { PopoverHistoricoSharedComponent } from './menu-shared/popover-historico-shared/popover-historico-shared.component';
import { PopoverRelatoriosSharedComponent } from './menu-shared/popover-relatorios-shared/popover-relatorios-shared.component';
import { InfosEmpresaModalComponent } from './infos-empresa-modal/infos-empresa-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadsModule } from '@progress/kendo-angular-upload';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';


import { SafePipe } from './../core/pipes/safe.pipe';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: "./assets/i18n/shared/", suffix: ".json" },
    { prefix: "./assets/i18n/historico/", suffix: ".json" },
  ]);
}

@NgModule({
  declarations: [
    LocaleSharedComponent,
    CurrencyGlobalPipe,
    ReplacePipe,
    MenuComponent,
    SafePipe,
    NotificationSharedComponent,
    NotificationModalSharedComponent,
    AvaliarColaboradorModalComponent,
    ConfirmarPerfilModalComponent,
    RelatarBugComponent,
    InfosEmpresaModalComponent,
    PopoverOpcoesSharedComponent,
    PopoverHistoricoSharedComponent,
    PopoverRelatoriosSharedComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FloatingLabelModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    DropDownsModule,
    UploadsModule,
    ReactiveFormsModule,

  ],
  exports: [
    LocaleSharedComponent,
    CurrencyGlobalPipe,
    ReplacePipe,
    MenuComponent,
    SafePipe,
    NotificationSharedComponent,
    AvaliarColaboradorModalComponent,
    ConfirmarPerfilModalComponent,
    InfosEmpresaModalComponent,
  ],
  providers: [
    CurrencyGlobalPipe,
    ReplacePipe,
    SocialSharing
  ],
})
export class SharedModule { }

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { LoginPage } from "./login.page";
import { LoginService } from "./services/login.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";

// kendo
import { FloatingLabelModule } from "@progress/kendo-angular-label";
import { InputsModule } from "@progress/kendo-angular-inputs";

// Social Login
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from "angularx-social-login";

// Tradução
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { MultiTranslateHttpLoader } from "ngx-translate-multi-http-loader";
import { SharedModule } from "../shared/shared.module";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { ConfirmacaoCadastroComponent } from "./confirmacao-cadastro/confirmacao-cadastro.component";
import { CancelarInscricaoComponent } from "./cancelar-inscricao/cancelar-inscricao.component";
import { RecuperarContaComponent } from "./recuperar-conta/recuperar-conta.component";
import { LoginPageRoutingModule } from "./login-routing.module";
import { EscolherPerfilComponent } from "./escolher-perfil/escolher-perfil.component";

// Modals
import { CadastrarUsuarioModalComponent } from "./modals/cadastrar-usuario-modal/cadastrar-usuario-modal.component";
import { RecuperarSenhaModalComponent } from "./modals/recuperar-senha-modal/recuperar-senha-modal.component";
import { EscolherEstabelecimentoModalComponent } from "./modals/escolher-estabelecimento-modal/escolher-estabelecimento-modal.component";
import { SenhaTemporariaModalComponent } from "./modals/senha-temporaria-modal/senha-temporaria-modal.component";
import { SaibaMaisModalComponent } from "./modals/saiba-mais-modal/saiba-mais-modal.component";
import { TermosCondicaoModalComponent } from "./modals/termos-condicao-modal/termos-condicao-modal.component";
import { PoliticaPrivacidadeModalComponent } from "./modals/politica-privacidade-modal/politica-privacidade-modal.component";
import { PopupTermosPoliticaModalComponent } from "./modals/popup-termos-politica-modal/popup-termos-politica-modal.component";
import { CadastrarTelefoneModalComponent } from "./modals/cadastrar-telefone-modal/cadastrar-telefone-modal.component";
import { LoginAuxiliarComponent } from "./modals/login-auxiliar/login-auxiliar.component";
// import criado para criar uma scroll bar nos termos/condições e no politica provacidade
import { CustomScrollDirective } from "./modals/politica-privacidade-modal/politica-privacidade-modal.component.directive";

// import para o kendo calendar
import {
  DateInputsModule,
  MultiViewCalendarModule,
} from "@progress/kendo-angular-dateinputs";

import { splashscreenComponent } from "../shared/splashscreen/splashscreen-component";
import { AppVersion } from "@awesome-cordova-plugins/app-version/ngx";
import { CadastrarEmailAppleComponent } from "./modals/cadastrar-email-apple/cadastrar-email-apple.component";

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: "./assets/i18n/login/", suffix: ".json" },
  ]);
}

const CLIENT_ID =
  "777371911307-i9rrp0k4te68gp3kg3mo6o5i568jcrs8.apps.googleusercontent.com";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LoginPageRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
        }),
        SharedModule,
        DropDownsModule,
        InputsModule,
        FloatingLabelModule,
        DateInputsModule,
        MultiViewCalendarModule,
        SocialLoginModule,
    ],
    declarations: [
        LoginPage,
        ConfirmacaoCadastroComponent,
        CancelarInscricaoComponent,
        RecuperarContaComponent,
        EscolherPerfilComponent,
        EscolherEstabelecimentoModalComponent,
        CadastrarUsuarioModalComponent,
        RecuperarSenhaModalComponent,
        SaibaMaisModalComponent,
        PopupTermosPoliticaModalComponent,
        TermosCondicaoModalComponent,
        PoliticaPrivacidadeModalComponent,
        CustomScrollDirective,
        SenhaTemporariaModalComponent,
        CadastrarTelefoneModalComponent,
        LoginAuxiliarComponent,
        splashscreenComponent,
        CadastrarEmailAppleComponent
    ],
    providers: [
        LoginService,
        {
            provide: "SocialAuthServiceConfig",
            useValue: {
                autoLogin: true,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider(CLIENT_ID),
                    },
                    {
                        id: FacebookLoginProvider.PROVIDER_ID,
                        provider: new FacebookLoginProvider("747843898684506"),
                    },
                ],
                onError: (err) => {
                    console.error(err);
                },
            } as SocialAuthServiceConfig,
        }, AppVersion,
    ]
})
export class LoginPageModule {}

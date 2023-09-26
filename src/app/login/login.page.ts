import {
  Component,
  OnInit,
  HostListener,
  ChangeDetectorRef,
  Input,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { AlertController, ModalController, Platform } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { LoadingService } from "../core/services/loading.service";
import { StorageService } from "../core/services/storage.service";
import { ToastService } from "../core/services/toast.service";
import { CadastrarUsuarioModalComponent } from "./modals/cadastrar-usuario-modal/cadastrar-usuario-modal.component";
import { EscolherEstabelecimentoModalComponent } from "./modals/escolher-estabelecimento-modal/escolher-estabelecimento-modal.component";
import { RecuperarSenhaModalComponent } from "./modals/recuperar-senha-modal/recuperar-senha-modal.component";
import { LoginUsuarioModel } from "./models/login-usuario-model";
import { LoginService } from "./services/login.service";
import { environment } from "../../environments/environment";
import { LoginModel } from "./models/login-model";
import { SenhaTemporariaModalComponent } from "./modals/senha-temporaria-modal/senha-temporaria-modal.component";
import { SaibaMaisModalComponent } from "./modals/saiba-mais-modal/saiba-mais-modal.component";
import { MobilidadeCompleta, MobilidadeModel } from "./models/mobilidade-model";
import { TermosCondicaoModalComponent } from "./modals/termos-condicao-modal/termos-condicao-modal.component";
import { PoliticaPrivacidadeModalComponent } from "./modals/politica-privacidade-modal/politica-privacidade-modal.component";
import { PopupTermosPoliticaModalComponent } from "./modals/popup-termos-politica-modal/popup-termos-politica-modal.component";
import { userInfo } from "./models/facebook-data-mobile-model";
import { SignInWithApple, SignInWithAppleResponse, SignInWithAppleOptions } from '@capacitor-community/apple-sign-in';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'
import { FacebookLogin } from '@capacitor-community/facebook-login';

// Social Login
import {
  FacebookLoginProvider,
  SocialAuthService,
  SocialUser,
} from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { CadastrarTelefoneModalComponent } from "./modals/cadastrar-telefone-modal/cadastrar-telefone-modal.component";
import {
  FacebookLightModel,
  FacebookModel,
} from "./models/facebook-light-model";
import { GoogleLightModel, GoogleModel } from "./models/google-light-model";
import { Capacitor } from "@capacitor/core";
import { LoginAuxiliarComponent } from "./modals/login-auxiliar/login-auxiliar.component";
import { AuthService } from "../core/services/auth.service";
import { AppleLightModel, AppleModel } from "./models/apple-light-model";

import { JwtHelperService } from "@auth0/angular-jwt";
import { AppVersion } from "@awesome-cordova-plugins/app-version/ngx";
import { CadastrarEmailAppleComponent } from "./modals/cadastrar-email-apple/cadastrar-email-apple.component";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
  providers: [AuthService],
})
export class LoginPage implements OnInit {
  SplashControle: boolean = false; // < - Constrole de visibilidade do splash personalizado (false = Mostrar splash | true = Mostrar o root do app )

  @Input() phoneNumber;
  public dataNascimento: Date = null;

  public loginModel: LoginModel;
  public Acesso = true;
  public oneLogo = environment.logo;
  public version: string = environment.version;
  public loginForm: FormGroup;
  public showPassword = false;
  public cardHeight: string;
  public mudarTela = 0;
  public loginRes: LoginUsuarioModel;
  public lastLogin: LoginUsuarioModel;
  private primeiroLogin = false;
  public backgroundArmazenado: any;
  public googleUser: any;
  public perfis: any;
  private itemStorage: any;
  public background: any =
    "https://oneproducao.blob.core.windows.net/one2/Imagens/One_App_Background.png";
  public name;
  public termosPolitica = false;
  public senhaPraLoginCliente: any;
  public windowHeight: number;
  public imageHeight: number;
  public lastID: number;
  public chaveController = false;
  public mostrarEmailOneLogin = false;
  public nomeCompleto: any;
  public emailApple: any;

  public user: SocialUser = new SocialUser();
  public usuarioExiste = false;
  public isiOS = false;
  public appleUser: any;
  public filiaisId: any;
  public packageValue: any;

  screenHeight: number;
  screenWidth: number;

  public saibaMais = true; // alternador do saiba-mais circle
  public empresaMobilidade: MobilidadeCompleta; // ESsa varivael so vai ter um valor quando a url tiver uma #
  public loggedIn: boolean;

  public isWeb = !this.platform.is("android") && !this.platform.is("ios");

  public userInfo = null;
  public userFacebookMobile: userInfo = new userInfo();

  public iOS: boolean;
  public nomeAppLogin: any;
  public basehref: any;
  public appLogado: any;

  public valueMobilidade: any;


  showAppleSignIn = false;
  userApple = this.auth.user;

  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  constructor(
    private loginService: LoginService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private modalController: ModalController,
    private Toast: ToastService,
    private Translate: TranslateService,
    private storageService: StorageService,
    private router: Router,
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private authService: SocialAuthService,
    private platform: Platform,
    private auth: AuthService,
    private appVersion: AppVersion,
  ) {
    this.getScreenSize();
  }

  ngAfterViewChecked() {
    this.mudarBackGround();
  }

  async ngOnInit() {
    this.basehref = localStorage.getItem("basehref");
    this.nomeAppLogin = localStorage.getItem("appNameLogin");
    //Delay da tela de Splash
    const EsperarTimeout = (delay) =>
      new Promise((resolve) => setTimeout(resolve, delay));
    EsperarTimeout(3000)
      .then(() => {
        document.getElementById("Splash").style.opacity = "0";
      })
      .then(() => {
        setTimeout(() => {
          this.SplashControle = true;
        }, 1200);
      });



    this.iOS = this.detectiOS();

    if (window.location.href.includes("oneapp.azurewebsites.net/#/")) {
      let Url = window.location.href;
      Url = Url.replace(
        "oneapp.azurewebsites.net/#/",
        "oneapp.azurewebsites.net/" + this.basehref + "/login/#/"
      );
      if (window.location.href.includes("http:")) {
        window.location.href = Url;
      } else {
        window.location.href = "https://" + Url;
      }
    }

    this.activatedRoute.params.subscribe((p) => this.valueMobilidade = p.id);
    var mobilidadeUrl = localStorage.getItem("mobilidadeUrl")
    if(mobilidadeUrl!= null && mobilidadeUrl != undefined) {
      this.valueMobilidade = mobilidadeUrl
    }
    this.verificaNotificacao();

    // seta o tamanho do card como o tamanho da tela do dispositivo para que o teclado nao mude o tamanho dele
    this.name = environment.name;
    this.storageService.get("one.login").then(
      (data) => {
        this.itemStorage = data;
        this.loginForm = this.formBuilder.group({
          email: [data.email, Validators.required],
          senha: [data.senha, Validators.required],
        });
      },
      (err) => {
        this.loginForm = this.formBuilder.group({
          email: ["", Validators.required],
          senha: ["", Validators.required],
        });
      }
    );
    const loginInfo = localStorage.getItem("one.user");
    // seta o tamanho do card como o tamanho da tela do dispositivo para que o teclado nao mude o tamanho
    // Antes, o valor aqui era px, ao invés de vh
    this.cardHeight = window.innerHeight - 20 + "px";
    this.windowHeight = window.innerHeight;



    if (JSON.parse(localStorage.getItem("one.user")) != null) {
      const user = JSON.parse(localStorage.getItem("one.user"));
      this.backgroundArmazenado = user.authenticatedBranch.background;
      const img = new Image();
      img.src = this.backgroundArmazenado;
      this.imageHeight = img.naturalHeight;

      const mobilidade: MobilidadeModel = {
        empresasID: user.authenticatedBranch.empresaId,
        filiaisID: user.authenticatedBranch.filialId,
        logoMarca: user.authenticatedBranch.logoMarca,
        nomeEmpresa: user.authenticatedBranch.nomeEmpresaFilial,
        nomeEmpresaFilial: user.authenticatedBranch.nomeEmpresaFilial,
        estado: null,
        cidade: null,
        tipoNegocio: user.authenticatedBranch.tipoNegocio,
        distancia: user.authenticatedBranch.distancia,
      };

      this.loginRes = new LoginUsuarioModel();
      this.loginRes.pesquisaMobilidade = [];
      this.loginRes.pesquisaMobilidade.push(mobilidade);
      this.loginRes.usuarioId = user.authenticatedUser.usuariosId;


      this.lastLogin = new LoginUsuarioModel();
      this.lastLogin.pesquisaMobilidade = [];
      this.lastLogin.pesquisaMobilidade.push(mobilidade);
      this.lastLogin.usuarioId = user.authenticatedUser.usuarioId;

      // procura por uma # na url, se existir coloca como primeiro da lista o mobilidade com o id da url


    }
    else if (JSON.parse(localStorage.getItem("user")) != null && JSON.parse(localStorage.getItem("login")) != null) {
      var emailAppAntigo = JSON.parse(localStorage.getItem("login")).email
      var senhaAppAntigo = JSON.parse(localStorage.getItem("login")).senha
      var exclusivoAppId = localStorage.getItem("appId");
      var exclusivoBase = localStorage.getItem("basehref");
      var exclusivoAppName = localStorage.getItem("appNameLogin");
      // Limpa o localStorage e seta o token de acesso
      localStorage.clear();
      localStorage.setItem("appId", exclusivoAppId);
      localStorage.setItem("basehref", exclusivoBase);
      localStorage.setItem("appNameLogin", exclusivoAppName);
      await this.loginUsuarioAntigo(emailAppAntigo, senhaAppAntigo)

    }

    else {
      if (environment.appId !== "0") {
        // App exclusivo
        this.loginRes = new LoginUsuarioModel();
      }
      this.backgroundArmazenado = null;
    }
    if (this.valueMobilidade && localStorage.getItem('appId') == '1') {
      //debugger
      //this.mostrarLoginOne()
      localStorage.setItem("mobilidadeUrl", this.valueMobilidade)
      await this.loginService.buscaEmpresaMobilidadeId(this.valueMobilidade).then((res) => {

        this.empresaMobilidade = res;
      });
    }

    setTimeout(() => {
      this.mudarBackGround();
    }, 500);

    this.authService.authState.subscribe((user) => {
      this.user = user;

      this.loggedIn = user != null;
    });

    const tipoPerfil = localStorage.getItem("one.tipologin");
    const trocouPerfil = localStorage.getItem("one.trocouPerfil");
    const trocouEstabelecimento = localStorage.getItem(
      "one.trocouEstabelecimento"
    );

    if (localStorage.getItem('appId') != '1' && (JSON.parse(localStorage.getItem('one.user')) != null || JSON.parse(localStorage.getItem('one.user')) != undefined)) {
      await this.loginService.buscaEmpresaMobilidadeId(JSON.parse(localStorage.getItem('one.user')).authenticatedBranch.mobilidadeId).then(res => {
        this.appLogado = res.empresasID;
        this.loginService.buscarEmpresasPorAppId(localStorage.getItem('appId')).subscribe((res) => {

          var appCerto = Object.values(res).findIndex(mob => mob.empresasID == this.appLogado);
          if (appCerto != -1) {
            if (loginInfo !== undefined && loginInfo !== "" && trocouPerfil !== "true" && trocouEstabelecimento !== "true") {
              if (tipoPerfil === "cliente") {
                this.agendaCliente();
              }
              if (tipoPerfil === "colaborador") {
                this.agendaProfissional();
              }
              if (tipoPerfil === "gestor") {
                this.agendaGestor();
              }
            }
          }
        }, fail => {
        });

      }, fail => {
      })

    }
    else {
      if (loginInfo !== undefined && loginInfo !== "" && trocouPerfil !== "true" && trocouEstabelecimento !== "true") {
        if (tipoPerfil === "cliente") {
          this.agendaCliente();
        }
        if (tipoPerfil === "colaborador") {
          this.agendaProfissional();
        }
        if (tipoPerfil === "gestor") {
          this.agendaGestor();
        }
      }
    }



    // Faz o login automatico caso existe uma sessao ativa


    this.isiOS =
      this.detectarUserAgent() === "iPad" ||
      this.detectarUserAgent() === "iPhone";
  }
  ngAfterViewInit() {
    if (this.valueMobilidade && localStorage.getItem('appId') == '1') {
      //debugger
      this.mostrarLoginOne()
    }
  }

  detectiOS() {
    if (
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i)
    ) {
      return true;
    } else {
      return false;
    }
  }

  agendaCliente() {
    const url = window.location.origin;
    // eh necessario testar se esta em producao, pois a url precisa do nome do applicativo
    document.location.href = environment.production
      ? `${url}/${this.basehref}/agenda/agenda-cliente`
      : `${url}/agenda/agenda-cliente`;
    // this.Router.navigate(['/agenda/agenda-cliente'])
    localStorage.setItem("one.tipologin", "cliente");
  }

  agendaProfissional() {
    const url = window.location.origin;
    // eh necessario testar se esta em producao, pois a url precisa do nome do applicativo
    document.location.href = environment.production
      ? `${url}/${this.basehref}/agenda/agenda-profissional`
      : `${url}/agenda/agenda-profissional`;
    // this.Router.navigate(['/agenda/agenda-profissional'])
    localStorage.setItem("one.tipologin", "colaborador");
  }

  agendaGestor() {
    const url = window.location.origin;
    // eh necessario testar se esta em producao, pois a url precisa do nome do applicativo
    document.location.href = environment.production
      ? `${url}/${this.basehref}/agenda/agenda-gestor`
      : `${url}/agenda/agenda-gestor`;
    // this.Router.navigate(['/agenda/agenda-gestor'])
    localStorage.setItem("one.tipologin", "gestor");
  }

  mudarBackGround() {
    // muda o background do div dentro do shadow root para transparent
    if (document.getElementsByTagName("ion-content")) {
      if (document.getElementsByTagName("ion-content")[0]) {
        if (
          document
            .getElementsByTagName("ion-content")[0]
            .shadowRoot.getElementById("background-content") != null
        ) {
          document
            .getElementsByTagName("ion-content")[0]
            .shadowRoot.getElementById("background-content").style.background =
            "transparent";

          // checa se o background é um background personalizado, caso seja, faz as mudanças de style necessarias.
          if (this.backgroundArmazenado != null) {
            document.getElementsByTagName("ion-card")[0].style.background =
              "transparent";
            document.getElementsByTagName("ion-card")[0].style.boxShadow =
              "0 0 black";

            const inputs = document.getElementsByClassName(
              "input"
            ) as HTMLCollectionOf<HTMLElement>;
            //inputs[0].style.backgroundColor = 'white';
            //inputs[1].style.backgroundColor = 'white';

            if (document.getElementById("entrarDiv")) {
              document.getElementById("entrarDiv").style.backgroundColor =
                "white";
              document.getElementById("entrarDiv").style.borderRadius = "4px";
            }

            if (document.getElementById("entrarB")) {
              document.getElementById("entrarB").style.marginInlineStart =
                "0px";
              document.getElementById("entrarB").style.marginInlineEnd = "0px";
            }
            if (this.imageHeight === 0) {
              const img = new Image();
              img.src = this.backgroundArmazenado;
              this.imageHeight = img.naturalHeight;

              if (this.imageHeight < this.windowHeight) {
                const bg = document.getElementById("bg");

                bg.style.backgroundSize = "100% 100%";
              }
            }
          }
        }
      }
    }
  }

  getNomeEmpresa() {
    if (this.empresaMobilidade) {
      return this.empresaMobilidade.nomeEmpresaFilial;
    }

    if (this.name === "OneApp") {
      return this.lastLogin?.pesquisaMobilidade[0]?.nomeEmpresaFilial;
    }

    return this.name;
  }

  verificaNotificacao() {
    // check notification

    const notifications = JSON.parse(localStorage.getItem("one.notifications"));
    if (notifications) {
      localStorage.removeItem("one.notifications");
    }
  }

  atualizarCadastro() { }

  async login() {
    if (this.loginForm.valid) {
      this.loadingService.present();
      await this.loginService
        .userLogin(
          this.loginForm.controls.email.value,
          this.loginForm.controls.senha.value,
          localStorage.getItem('appId'),
          localStorage.getItem('basehref')
        )
        .subscribe(
          (res) => {

            this.loginRes = res.data;
            this.storageService.set("one.login", {
              email: this.loginForm.controls.email.value,
              senha: this.loginForm.controls.senha.value,
            });

            this.Acesso = false;

            this.onClickEscolherEstabelecimento(
              this.loginForm.controls.email.value,
              this.loginForm.controls.senha.value,
              false
            );

            this.loadingService.dismiss();
          },
          (fail) => {
            this.loadingService.dismiss();

            if (fail.error === "API.LOGINUSUARIO.INVALIDCREDENTIAL") {
              this.Toast.presentToast(
                this.Translate.instant("LOGIN.CREDENCIALINVALIDA"),
                "danger"
              );
            } else if (fail.error === "API.LOGINUSUARIO.USUARIOMOBNOTFOUND") {
              this.Toast.presentToast(
                this.Translate.instant("LOGIN.USUARIOMOBNOTFOUND"),
                "danger"
              );
            } else if (fail.error === "API.LOGINUSUARIO.DISABLED") {
              this.Toast.presentToast(
                this.Translate.instant("LOGIN.DISABLED"),
                "success"
              );
            } else {
              this.Toast.presentToast(
                this.Translate.instant(fail.error),
                "danger"
              );
            }
          }
        );
    }
  }
  async loginVisitante() {
    var mobilidadeUrl = localStorage.getItem('mobilidadeUrl')
    if(mobilidadeUrl != null && mobilidadeUrl != undefined) {
      this.onClickEntrarDireto(true)
      return
    }
    this.loadingService.present();
    await this.loginService
      .userLogin(
        'visitante@onebeleza.com.br',
        '123456',
        localStorage.getItem('appId'),
        localStorage.getItem('basehref')
      )
      .subscribe(
        (res) => {

          this.loginRes = res.data;

          this.Acesso = false;

          this.onClickEscolherEstabelecimento(
            'visitante@onebeleza.com.br',
            '123456',
            false
          );

          this.loadingService.dismiss();
        },
        (fail) => {
          this.loadingService.dismiss();

          if (fail.error === "API.LOGINUSUARIO.INVALIDCREDENTIAL") {
            this.Toast.presentToast(
              this.Translate.instant("LOGIN.CREDENCIALINVALIDA"),
              "danger"
            );
          } else if (fail.error === "API.LOGINUSUARIO.USUARIOMOBNOTFOUND") {
            this.Toast.presentToast(
              this.Translate.instant("LOGIN.USUARIOMOBNOTFOUND"),
              "danger"
            );
          } else if (fail.error === "API.LOGINUSUARIO.DISABLED") {
            this.Toast.presentToast(
              this.Translate.instant("LOGIN.DISABLED"),
              "danger"
            );
          } else {
            this.Toast.presentToast(
              this.Translate.instant(fail.error),
              "danger"
            );
          }
        }
      );
  }

  async loginUsuarioAntigo(email: any, senha: any) {
    this.loadingService.present();
    await this.loginService
      .userLoginEmail(email, senha,
        localStorage.getItem('appId'),
        localStorage.getItem('basehref')
      )
      .subscribe(
        (res) => {

          this.loginRes = res.data;

          this.Acesso = false;

          this.onClickEscolherEstabelecimento(
            email,
            senha,
            false
          );

          this.loadingService.dismiss();
        },
        (fail) => {
          this.loadingService.dismiss();

          if (fail.error === "API.LOGINUSUARIO.INVALIDCREDENTIAL") {
            this.Toast.presentToast(
              this.Translate.instant("LOGIN.CREDENCIALINVALIDA"),
              "danger"
            );
          } else if (fail.error === "API.LOGINUSUARIO.USUARIOMOBNOTFOUND") {
            this.Toast.presentToast(
              this.Translate.instant("LOGIN.USUARIOMOBNOTFOUND"),
              "danger"
            );
          } else if (fail.error === "API.LOGINUSUARIO.DISABLED") {
            this.Toast.presentToast(
              this.Translate.instant("LOGIN.DISABLED"),
              "danger"
            );
          } else {
            this.Toast.presentToast(
              this.Translate.instant(fail.error),
              "danger"
            );
          }
        }
      );
  }

  changePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // async onClickEscolherEstabelecimento() {
  //   this.Acesso = true;
  //   const modal = await this.modalController.create({
  //     component: EscolherEstabelecimentoModalComponent,
  //     componentProps: {
  //       loginUsuario: this.loginRes,
  //       userLogin: {email: this.loginForm.controls.email.value, senha: this.loginForm.controls.senha.value},
  //     },
  //   });
  //
  //   modal.backdropDismiss = false;
  //
  //   modal.onDidDismiss().then((retorno) => {
  //     if (retorno.data?.res) {
  //       this.onSuccess(retorno.data.res);
  //     }
  //   });
  //
  //   return await modal.present();
  // }

  async onClickEscolherEstabelecimento(
    email: string,
    senha: string,
    flagHash: boolean,
    nomeCompleto = null
  ) {
    // this.Acesso = true;

    const modal = await this.modalController.create({
      component: EscolherEstabelecimentoModalComponent,
      componentProps: {
        loginUsuario: this.loginRes,
        userLogin: { email, senha, nomeCompleto },
        flagHash,
      },
    });

    modal.backdropDismiss = false;

    modal.onDidDismiss().then((retorno) => {
      if (retorno.data?.res) {
        this.onSuccess(retorno.data.res, false);
      }
    });

    return await modal.present();
  }

  async onClickCadastrar() {
    const modal = await this.modalController.create({
      component: CadastrarUsuarioModalComponent,
    });
    modal.backdropDismiss = false; // impedir que feche no click fora

    return await modal.present();
  }

  async onClickEsqueciSenha() {
    const modal = await this.modalController.create({
      component: RecuperarSenhaModalComponent,
      cssClass: "recuperarSenha",
    });
    modal.backdropDismiss = false; // impedir que feche no click fora

    return await modal.present();
  }

  async onClickLoginAuxiliar() {
    const modal = await this.modalController.create({
      component: LoginAuxiliarComponent,
      cssClass: "loginAuxiliar",
      componentProps: {
        loginRes: this.loginRes,
      },
    });
    modal.backdropDismiss = false;

    modal.onDidDismiss().then((retorno) => {
      if (retorno.data?.res) {
        this.onSuccess(retorno.data.res, true);
      }
    });

    return await modal.present();
  }

  async onClickEntrarDireto(visitante: boolean = false, loginAlternativo: boolean = false) {
    this.loadingService.present();
    let push = JSON.parse(localStorage.getItem("one.push"));
    let login: LoginModel = {
      email: this.loginForm.controls["email"].value,
      senha: this.loginForm.controls["senha"].value,
      // Lembrar de buscar uma forma de saber a empresaID e FilialId do app exclusivo
      empresaId: this.empresaMobilidade.empresasID,
      filialId: this.empresaMobilidade.filiaisID,
      appId: Number(localStorage.getItem('appId')),
      appleDeviceToken: Capacitor.getPlatform() === "ios" ? push?.value : "",
      googleRegistrationId: Capacitor.getPlatform() === "android" ? push?.value : "",
    };
    if(visitante) {
      login.email = 'visitante@onebeleza.com.br'
      login.senha = '123456'
      
    }
    else if (loginAlternativo) {
      login.email= this.loginRes.email
      login.senha= this.loginRes.hash ? this.loginRes.hash: this.loginRes.senha;
    }


    this.loginService.login(login, this.loginRes.hash ? true: false).subscribe(
      (res) => {
        this.loadingService.dismiss();
        this.onSuccess(res, false);
      },
      (fail) => {
        this.loadingService.dismiss();

        if (fail.error === "API.LOGINEMPRESA.INVALIDCREDENTIAL") {
          this.Toast.presentToast(
            this.Translate.instant("LOGIN.CREDENCIALINVALIDA"),
            "danger"
          );
        } else if (fail.error === "API.LOGINEMPRESA.USUARIOMOBNOTFOUND") {
          this.Toast.presentToast(
            this.Translate.instant("LOGIN.USUARIOMOBNOTFOUND"),
            "danger"
          );
        } else if (fail.error === "API.LOGINEMPRESA.DISABLED") {
          this.Toast.presentToast(
            this.Translate.instant("LOGIN.DISABLED"),
            "danger"
          );
        } else {
          this.Toast.presentToast(
            this.Translate.instant(fail.error),
            "danger"
          );
        }
      }
    );
  }

  async onSuccess(response: any, autoatendimento: boolean) {

    const oneLogin = localStorage.getItem("one.login"); // manter dados de login
    const oneLang = localStorage.getItem("one.lang"); // manter os dados de idioma
    const onePush = localStorage.getItem("one.push"); // manter o token de notificacao
    const tipoPerfil = localStorage.getItem("one.tipologin");
    const timestamp = localStorage.getItem("one.timestamp");
    const ratestamp = localStorage.getItem("one.ratestamp");
    const tempPassword = response.authenticatedUser?.tempPassword;

    // termosPolitica para primeiro acesso ao sistema
    this.termosPolitica = JSON.parse(
      localStorage.getItem("one.termosPolitica")
    );
    // ____
    if (this.termosPolitica === false || this.termosPolitica === null) {
      this.termosPolitica = true;
      await this.popupTermosPolitica();
    }

    var exclusivoAppId = localStorage.getItem("appId");
    var exclusivoBase = localStorage.getItem("basehref");
    var exclusivoAppName = localStorage.getItem("appNameLogin");
    var exclusivoTemFiliais = localStorage.getItem('one.filiais')
    var exclusivoLinkAndroid = localStorage.getItem('one.linkAndroid')
    var exclusivoLinkIos = localStorage.getItem('one.linkIOS')
    var mobilidadeUrl = localStorage.getItem('mobilidadeUrl')
    // Limpa o localStorage e seta o token de acesso
    localStorage.clear();

    localStorage.setItem('one.filiais', exclusivoTemFiliais)
    localStorage.setItem("appId", exclusivoAppId);
    localStorage.setItem("basehref", exclusivoBase);
    localStorage.setItem("appNameLogin", exclusivoAppName);
    localStorage.setItem("one.token", response.access_token);
    localStorage.setItem("one.linkAndroid", exclusivoLinkAndroid);
    localStorage.setItem("one.linkIOS", exclusivoLinkIos);
    if(mobilidadeUrl != null && mobilidadeUrl != undefined) {
      localStorage.setItem("mobilidadeUrl", mobilidadeUrl);
    }

    localStorage.setItem("claims", JSON.stringify(response.claims));

    if (!tempPassword) {
      if (
        oneLogin !== "" &&
        oneLogin !== undefined &&
        oneLogin !== null &&
        oneLogin !== "null"
      ) {
        localStorage.setItem("one.login", oneLogin);
      }
      if (autoatendimento) {
        localStorage.setItem("one.autoatendimento", "true");
      } else {
        localStorage.setItem("one.autoatendimento", "false");
      }
      localStorage.setItem("one.tipologin", tipoPerfil);

      localStorage.setItem("one.user", JSON.stringify(response));
      localStorage.setItem("one.lang", oneLang);
      localStorage.setItem(
        "one.mobilidade",
        JSON.stringify(this.loginRes.pesquisaMobilidade)
      );
      localStorage.setItem("one.push", onePush);
      if (timestamp != null) {
        localStorage.setItem("one.timestamp", timestamp);
      }
      if (ratestamp != null) {
        localStorage.setItem("one.ratestamp", ratestamp);
      }
      this.perfis = {
        perfilCliente: response.authenticatedUser.perfilCliente,
        perfilColaborador: response.authenticatedUser.perfilColaborador,
        perfilGerente: response.authenticatedUser.perfilGerente,
      };
      if (localStorage.getItem("one.autoatendimento") === "true") {
        this.perfis.perfilCliente = false;
        this.perfis.perfilGerente = false;
      }
      if (
        (this.perfis.perfilCliente === true &&
          (this.perfis.perfilColaborador === true ||
            this.perfis.perfilGerente === true)) ||
        (this.perfis.perfilColaborador === true &&
          (this.perfis.perfilGerente === true ||
            this.perfis.perfilCliente === true))
      ) {
        this.chaveController = false;
        this.Toast.presentToast(this.Translate.instant("LOGIN.SUCESSO"));
        this.router.navigate(["/login/escolher-perfil"]);
      } else if (this.perfis.perfilCliente === true) {
        this.chaveController = true;
        this.Toast.presentToast(this.Translate.instant("LOGIN.CLIENTE"));
        localStorage.setItem("one.tipologin", "cliente");
        this.router.navigate(["/agenda/agenda-cliente"]);
      } else if (this.perfis.perfilColaborador === true) {
        this.chaveController = true;
        this.Toast.presentToast(this.Translate.instant("LOGIN.COLABORADOR"));
        localStorage.setItem("one.tipologin", "colaborador");
        this.router.navigate(["/agenda/agenda-profissional"]);
      } else if (this.perfis.perfilGerente === true) {
        this.chaveController = true;
        this.Toast.presentToast(this.Translate.instant("LOGIN.GESTOR"));
        localStorage.setItem("one.tipologin", "gestor");
        this.router.navigate(["/agenda/agenda-gestor"]);
      } else {
        this.Toast.presentToast(
          this.Translate.instant("LOGIN.ERROSEMPERMISSAO"),
          "danger"
        );
      }
    } else {
      this.onAlertTempPassword();
    }

    localStorage.setItem(
      "one.termosPolitica",
      JSON.stringify(this.termosPolitica)
    );
  }

  async onAlertTempPassword() {
    const alert = await this.alertController.create({
      header: this.Translate.instant("LOGIN.ALERTASENHATEMPORARIA.HEADER"),
      message: this.Translate.instant("LOGIN.ALERTASENHATEMPORARIA.MESSAGE"),
      buttons: [
        {
          text: this.Translate.instant("LOGIN.ALERTASENHATEMPORARIA.CANCEL"),
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
          },
        },
        {
          text: this.Translate.instant("LOGIN.ALERTASENHATEMPORARIA.OK"),
          handler: () => {
            this.openModalSenhaTemporaria();
          },
        },
      ],
    });

    await alert.present();
  }

  async openModalSenhaTemporaria() {
    const modal = await this.modalController.create({
      component: SenhaTemporariaModalComponent,
    });

    modal.onDidDismiss().then((ev) => {
      if (ev.data.didChange) {
        this.loginForm.reset();
      }
    });

    return await modal.present();
  }

  escolherPerfil() {
    localStorage.setItem("one.trocouPerfil", "false");
    this.mudarTela = 1;
  }

  async onClickSaibaMais() {
    const modal = await this.modalController.create({
      component: SaibaMaisModalComponent,
      cssClass: "saibaMaisModal",
    });
    modal.backdropDismiss = false; // impedir que feche no click fora

    return await modal.present();
  }

  async exibeTermos() {
    const modal = await this.modalController.create({
      component: TermosCondicaoModalComponent,
      cssClass: "termosCondicaoModal",
    });
    modal.backdropDismiss = false; // impedir que feche no click fora

    return await modal.present();
  }

  async exibePolitica() {
    const modal = await this.modalController.create({
      component: PoliticaPrivacidadeModalComponent,
      cssClass: "politicaPrivacidadeModal",
    });
    modal.backdropDismiss = false; // impedir que feche no click fora

    return await modal.present();
  }

  async popupTermosPolitica() {
    const modal = await this.modalController.create({
      component: PopupTermosPoliticaModalComponent,
      componentProps: {
        chaveController: this.chaveController,
        termosPolitica: this.termosPolitica,
      },
      cssClass: "popupTermosPoliticaModal",
    });
    modal.backdropDismiss = false; // impedir que feche no click fora
    this.termosPolitica = true;

    await modal.present();

    return await modal.onDidDismiss();
  }

  mostrarLoginOne() {
    this.mostrarEmailOneLogin = !this.mostrarEmailOneLogin;
  }

  // Retorna o tipo de dispositivo
  detectarUserAgent() {
    if (navigator.userAgent.match(/Android/i)) {
      return "Android";
    } else if (navigator.userAgent.match(/iPhone/i)) {
      return "iPhone";
    } else if (navigator.userAgent.match(/iPad/i)) {
      return "iPad";
    } else {
      return "WEB";
    }

  }

  async loginApple() {

    await this.appVersion.getPackageName().then(value => {
      this.packageValue = value;
    })
    var appidApple = localStorage.getItem('appId')
    var basehrefApple = localStorage.getItem('basehref')
    var nonce = '78377b525757b494427f89014f97d79928f3938d14eb51e20fb5dec9834eb304'
    let options: SignInWithAppleOptions = {
      clientId: this.packageValue,
      redirectURI: '',
      scopes: 'email name',
      state: '12345',
      nonce: nonce
    };

    await SignInWithApple.authorize(options)
      .then(async (res: SignInWithAppleResponse) => {
        this.appleUser = res;
      })
      .catch((response) => {
      });

    const helper = new JwtHelperService();
    var tokenApple = this.appleUser.response.identityToken;
    var headerApple = JSON.parse(
      helper.urlBase64Decode(tokenApple.split(".")[0])
    );
    var jsonApple = helper.decodeToken(tokenApple);

    const modelLoginApple: AppleLightModel = {
      appleId: jsonApple.sub,
      email: jsonApple.email == null || jsonApple.email == undefined ? this.appleUser.response.email : jsonApple.email,
      appId: parseInt(localStorage.getItem('appId')),
      lingua: "pt-BR",
    };

    const modelCriarContaApple: AppleModel = {
      nomeCompleto: this.appleUser?.response?.givenName,
      celular: null,
      dadosApple: modelLoginApple,
    };

    if (modelLoginApple.email == null || modelLoginApple.email == undefined) {
      await this.cadastrarEmailApple();
      modelLoginApple.email = this.emailApple;
      //modelLoginApple.email = 'testeapplelogin@gmail.com'
    }


    this.loginService.loginApple(modelLoginApple).subscribe(
      async (res1) => {
        // usuario nao tem nenhuma conta associada ou que possa ser associada
        if (res1.data === null) {
          await this.cadastrarTelefoneAniversario(
            modelCriarContaApple.nomeCompleto
          );

          modelCriarContaApple.celular = this.phoneNumber;
          modelCriarContaApple.Aniversario = this.dataNascimento;
          modelCriarContaApple.nomeCompleto = modelCriarContaApple.nomeCompleto == null || modelCriarContaApple.nomeCompleto == undefined || modelCriarContaApple.nomeCompleto == '' ? this.nomeCompleto : modelCriarContaApple.nomeCompleto;

          this.loginService.criarContaApple(modelCriarContaApple).subscribe(
            (res2) => {
              // this.StorageService.set('one.login', {email: modelCriarContaFacebook.dadosFacebook.email, senha: res2.data.hash})
              this.loginRes = res2.data;
              if (this.valueMobilidade) {
                this.onClickEntrarDireto(false, true)
              }
              else {
                this.onClickEscolherEstabelecimento(
                  res2.data.email,
                  res2.data.senha,
                  true
                );
              }
            },
            (fail) => {
              if (
                fail.error ===
                "API.OLOGINUSUARIO.LOGINAPPLECRIARCONTA.INVALIDPARAMETERS"
              ) {
                this.Toast.presentToast(
                  this.Translate.instant("LOGIN.PARAMETROSINVALIDOS"),
                  "danger"
                );
              }

              if (
                fail.error ===
                "API.OLOGINUSUARIO.LOGINAPPLECRIARCONTA.USUARIOSMOB.ERROR"
              ) {
                this.Toast.presentToast(
                  this.Translate.instant("LOGIN.USUARIOMOBNOTFOUND"),
                  "danger"
                );
              } else {
                this.Toast.presentToast(
                  this.Translate.instant(fail.error),
                  "danger"
                );
              }
            }
          );
        }
        // encontrou uma conta associada ou que possa ser associada
        else {
          // this.StorageService.set('one.login', {email: res1.data.email, senha: res1.data.hash})

          // this.Acesso = false

          this.loginRes = res1.data;
          this.loginRes.email = jsonApple.email;
          if (this.valueMobilidade) {
            this.onClickEntrarDireto(false, true)
          }
          else {
            this.onClickEscolherEstabelecimento(
              jsonApple.email,
              res1.data.hash,
              true
            );
           }
        }
      },
      (fail) => {
        if (fail.error === "API.LOGINUSUARIO.USUARIOMOBNOTFOUND") {
          this.Toast.presentToast(
            this.Translate.instant("LOGIN.USUARIOMOBNOTFOUND"),
            "danger"
          );
        } else if (fail.error === "API.LOGINUSUARIO.DISABLED") {
          this.Toast.presentToast(
            this.Translate.instant("LOGIN.DISABLED"),
            "danger"
          );
        } else {
          this.Toast.presentToast(
            this.Translate.instant(fail.error),
            "danger"
          );
        }
      }
    );
  }

  /* "response": {
    "email": "foo@bar.com",
    "identityToken": "importantToken",
    "familyName": "Grimm",
    "user": "AppleUserId",
    "givenName": "Simon",
    "authorizationCode": "authCode"
  } */

  logout() {
    this.auth.logout();
  }

  async cadastrarEmailApple() {
    const modal = await this.modalController.create({
      component: CadastrarEmailAppleComponent,
      backdropDismiss: false, // impedir que feche no click fora
    });

    await modal.present();

    await modal.onWillDismiss().then((retorno) => {
      if (retorno.data !== undefined) {
        this.emailApple = retorno.data.email
      }
    });
  }


  async presentAlert(str) {
    const alert = await this.alertController.create({
      header: "Não foi possível entrar!",
      message: str,
      buttons: ["OK"],
    });
    await alert.present();
  }

  async alertLogin(str) {
    const alert = await this.alertController.create({
      header: "Login Apple!",
      message: str,
      buttons: ["OK"],
    });
    await alert.present();
  }

  atualizarNome(nome, email) {
    //this.loginService.obterCadastroUsuario()
  }
  // TODO: Login Google
  async loginGoogle() {
    const naoImplementado = 0;

    if (naoImplementado) {
      this.featureIndisponivel();
    } else {
      // Descomentar caso vá publicar
      // await this.unavailableFeature();

      if (this.isWeb) {
        await this.Toast.presentToast(this.Translate.instant("WEB"), "success");

        await this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
        this.googleUser = this.user;


        // run web implementation with init() and refresh()
      } else {
        //await this.Toast.presentToast(this.Translate.instant('MÓVEL'), 'success');

        // Descomente para a versão 2.4.7 do Codetrix e comente GoogleAuth.init();
        await GoogleAuth.initialize()
        this.googleUser = (await GoogleAuth.signIn()) as any;

      }
      const modelLoginGoogle: GoogleLightModel = {
        googleId: this.googleUser.id,
        email: this.googleUser.email,
        appId: parseInt(localStorage.getItem('appId')),
        lingua: "pt-BR",
      };

      const modelCriarContaGoogle: GoogleModel = {
        nomeCompleto:
          this.googleUser.displayName != undefined
            ? this.googleUser.displayName
            : this.googleUser.name,
        celular: null,
        dadosGoogle: modelLoginGoogle,
      };


      this.loginService.loginGoogle(modelLoginGoogle).subscribe(
        async (res1) => {
          // usuario nao tem nenhuma conta associada ou que possa ser associada
          if (res1.data === null) {
            await this.cadastrarTelefoneAniversario(
              this.googleUser.displayName
            );

            modelCriarContaGoogle.celular = this.phoneNumber;
            modelCriarContaGoogle.Aniversario = this.dataNascimento;
            this.loginService.criarContaGoogle(modelCriarContaGoogle).subscribe(
              (res2) => {
                // this.StorageService.set('one.login', {email: modelCriarContaFacebook.dadosFacebook.email, senha: res2.data.hash})
                this.loginRes = res2.data;
                if (this.valueMobilidade) {
                  this.onClickEntrarDireto(false, true)
                }
                else {
                  this.onClickEscolherEstabelecimento(
                    res2.data.email,
                    res2.data.senha,
                    true
                  );
                }
              },
              (fail) => {
                if (
                  fail.error ===
                  "API.OLOGINUSUARIO.LOGINGOOGLECRIARCONTA.INVALIDPARAMETERS"
                ) {
                  this.Toast.presentToast(
                    this.Translate.instant("LOGIN.PARAMETROSINVALIDOS"),
                    "danger"
                  );
                }

                if (
                  fail.error ===
                  "API.OLOGINUSUARIO.LOGINGOOGLECRIARCONTA.USUARIOSMOB.ERROR"
                ) {
                  this.Toast.presentToast(
                    this.Translate.instant("LOGIN.USUARIOMOBNOTFOUND"),
                    "danger"
                  );
                } else {
                  this.Toast.presentToast(
                    this.Translate.instant(fail.error),
                    "danger"
                  );
                }
              }
            );
          }
          // encontrou uma conta associada ou que possa ser associada
          else {
            // this.StorageService.set('one.login', {email: res1.data.email, senha: res1.data.hash})

            // this.Acesso = false

            this.loginRes = res1.data;
            this.loginRes.email = this.googleUser.email;
            if (this.valueMobilidade) {
              this.onClickEntrarDireto(false, true)
            }
            else {
              this.onClickEscolherEstabelecimento(
                this.googleUser.email,
                res1.data.hash,
                true,
                this.googleUser.displayName
              );
            }
          }
        },
        (fail) => {
          if (fail.error === "API.LOGINUSUARIO.USUARIOMOBNOTFOUND") {
            this.Toast.presentToast(
              this.Translate.instant("LOGIN.USUARIOMOBNOTFOUND"),
              "danger"
            );
          } else if (fail.error === "API.LOGINUSUARIO.DISABLED") {
            this.Toast.presentToast(
              this.Translate.instant("LOGIN.DISABLED"),
              "danger"
            );
          } else {
            this.Toast.presentToast(
              this.Translate.instant(fail.error),
              "danger"
            );
          }
        }
      );
    }
  }

  private async featureIndisponivel() {
    const alert = await this.alertController.create({
      header: this.Translate.instant("Em Breve"),
      message: this.Translate.instant("Estamos trabalhando nisso"),
      buttons: [
        {
          text: this.Translate.instant("LOGIN.ALERTASENHATEMPORARIA.OK"),
          handler: () => { },
        },
      ],
    });
    await alert.present();
  }

  async cadastrarTelefoneAniversario(name: string) {
    const modal = await this.modalController.create({
      component: CadastrarTelefoneModalComponent,
      componentProps: {
        userName: name,
      },
      backdropDismiss: false, // impedir que feche no click fora
    });

    await modal.present();

    await modal.onWillDismiss().then((retorno) => {
      if (retorno.data !== undefined) {
        this.phoneNumber = retorno.data.phoneNumber;
        this.dataNascimento = retorno.data.dataAniversario;
        this.nomeCompleto = retorno.data.nomeCompleto
      }
    });
  }

  onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();

  }

  signOut(): void {
    this.authService.signOut();
  }

  refreshToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  async loginFacebook() {
    const naoImplementado = 0;

    if (naoImplementado) {
      this.featureIndisponivel();
    } else {
      if (this.isWeb) {
        await this.Toast.presentToast(this.Translate.instant("WEB"), "success");

        await this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);


        const modelLoginFacebook: FacebookLightModel = {
          facebookId: this.user.id,
          email: this.user.email,
          appId: parseInt(localStorage.getItem('appId')),
          lingua: "pt-BR",
        };

        const modelCriarContaFacebook: FacebookModel = {
          nomeCompleto: this.user.name,
          celular: null,
          dadosFacebook: modelLoginFacebook,
        };

        this.facebookBackend(modelLoginFacebook, modelCriarContaFacebook);

        // run web implementation with init() and refresh()
      } else {
        //await this.Toast.presentToast(this.Translate.instant('MÓVEL'), 'success');

        var modelCriarContaFacebook = await this.signInMobileFacebook();

        //alert("entrou");

        //alert("email:"+modelLoginFacebook.email);
        this.facebookBackend(
          modelCriarContaFacebook.dadosFacebook,
          modelCriarContaFacebook
        );
      }
    }
  }

  async signInMobileFacebook() {
    const FACEBOOK_PERMISSIONS = ["email"];

    const result = (await FacebookLogin.login({
      permissions: FACEBOOK_PERMISSIONS,
    })) as any;
    const response = await fetch(
      `https://graph.facebook.com/${result.accessToken.userId}?fields=id,name,email&access_token=${result.accessToken.token}`
    );
    const myJson = await response.json();
    //alert(JSON.stringify(myJson));

    Object.assign(this.userFacebookMobile, myJson);




    const modelLoginFacebook: FacebookLightModel = {
      facebookId: this.userFacebookMobile.id,
      email: this.userFacebookMobile.email,
      appId: parseInt(localStorage.getItem('appId')),
      lingua: "pt-BR",
    };

    const modelCriarContaFacebook: FacebookModel = {
      nomeCompleto: this.userFacebookMobile.name,
      celular: null,
      dadosFacebook: modelLoginFacebook,
    };

    //alert(modelLoginFacebook.facebookId);

    return modelCriarContaFacebook;
  }

  async facebookBackend(
    modelLoginFacebook: FacebookLightModel,
    modelCriarContaFacebook: FacebookModel
  ) {
    this.loginService.loginFacebook(modelLoginFacebook).subscribe(
      async (res1) => {
        // usuario nao tem nenhuma conta associada ou que possa ser associada
        if (res1.data == null) {
          await this.cadastrarTelefoneAniversario(
            modelCriarContaFacebook.nomeCompleto
          );
          modelCriarContaFacebook.celular = this.phoneNumber;
          modelCriarContaFacebook.dataNascimento = this.dataNascimento;
          this.loginService
            .criarContaFacebook(modelCriarContaFacebook)
            .subscribe(
              (res2) => {
                // this.StorageService.set('one.login', {email: modelCriarContaFacebook.dadosFacebook.email, senha: res2.data.hash})
                this.loginRes = res2.data;
                if (this.valueMobilidade) {
                  this.onClickEntrarDireto(false, true)
                }
                else {
                  this.onClickEscolherEstabelecimento(
                    res2.data.email,
                    res2.data.senha,
                    true
                  );
                }
              },
              (fail) => {
                if (
                  fail.error ===
                  "API.OLOGINUSUARIO.LOGINFACEBOOKCRIARCONTA.INVALIDPARAMETERS"
                ) {
                  this.Toast.presentToast(
                    this.Translate.instant("LOGIN.PARAMETROSINVALIDOS"),
                    "danger"
                  );
                }

                if (
                  fail.error ===
                  "API.OLOGINUSUARIO.LOGINFACEBOOKCRIARCONTA.USUARIOSMOB.ERROR"
                ) {
                  this.Toast.presentToast(
                    this.Translate.instant("LOGIN.USUARIOMOBNOTFOUND"),
                    "danger"
                  );
                } else {
                  this.Toast.presentToast(
                    this.Translate.instant(fail.error),
                    "danger"
                  );
                }
              }
            );
        }
        // encontrou uma conta associada ou que possa ser associada
        else {
          // this.StorageService.set('one.login', {email: res1.data.email, senha: res1.data.hash})

          // this.Acesso = false
          this.loginRes = res1.data;
          if (this.valueMobilidade) {
            this.onClickEntrarDireto(false, true)
          }
          else {
            this.onClickEscolherEstabelecimento(
              res1.data.email,
              res1.data.hash,
              true
            );  
          }       
        }
      },
      (fail) => {
        if (fail.error === "API.LOGINUSUARIO.USUARIOMOBNOTFOUND") {
          this.Toast.presentToast(
            this.Translate.instant("LOGIN.USUARIOMOBNOTFOUND"),
            "danger"
          );
        } else if (fail.error === "API.LOGINUSUARIO.DISABLED") {
          this.Toast.presentToast(
            this.Translate.instant("LOGIN.DISABLED"),
            "danger"
          );
        } else {
          this.Toast.presentToast(
            this.Translate.instant(fail.error),
            "danger"
          );
        }
      }
    );
  }
}

import { Component, Input, OnInit } from "@angular/core";
import { AlertController, ModalController } from "@ionic/angular";
import { LoginUsuarioModel } from "../../models/login-usuario-model";
import { MobilidadeModel } from "../../models/mobilidade-model";
import { LoginService } from "../../services/login.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { LoadingService } from "app/core/services/loading.service";
import { LoginModel } from "../../models/login-model";
import { ToastService } from "app/core/services/toast.service";
import { TranslateService } from "@ngx-translate/core";

import { environment } from "../../../../environments/environment";
import { Capacitor } from "@capacitor/core";

@Component({
  selector: "app-escolher-estabelecimento-modal",
  templateUrl: "./escolher-estabelecimento-modal.component.html",
  styleUrls: ["./escolher-estabelecimento-modal.component.scss"],
})
export class EscolherEstabelecimentoModalComponent implements OnInit {
  @Input() loginUsuario: LoginUsuarioModel;
  @Input() userLogin: any;
  @Input() flagHash: boolean;

  public userData: any;
  public ultimosAcessos: any[];
  public ultimosAcessosAux: any[];
  public segment: string;
  public segmentSecundary: string;
  public listaPesquisados: MobilidadeModel[] = new Array<MobilidadeModel>();
  public listaEmpresasProximas: MobilidadeModel[] =
    new Array<MobilidadeModel>();
  public listaEmpresasProximasAux: MobilidadeModel[] =
    new Array<MobilidadeModel>();

  public capacitorJson: any;
  public iOS: boolean;

  public semLogo =
    "https://oneproducao.blob.core.windows.net/one2/Imagens/One_Logo.png";

  public nomeApp = environment.name;
  public listaFiliais: Array<MobilidadeModel> = new Array<MobilidadeModel>();
  public listaFiliaisExclusivos: any;
  public basehref: any;
  public appIdExclusivo: any;

  constructor(
    private modalController: ModalController,
    private loginService: LoginService,
    private GeoLocation: Geolocation,
    private loadingService: LoadingService,
    private Toast: ToastService,
    private Translate: TranslateService,
    private alertController: AlertController
  ) { }

  async ngOnInit() {
    this.appIdExclusivo = localStorage.getItem("appId");
    this.basehref = localStorage.getItem("basehref");
    this.iOS = this.detectiOS();

    this.userData = JSON.parse(localStorage.getItem("one.user"));
    if (this.basehref === "OneApp") {
      if (this.loginUsuario != null) {
        this.ultimosAcessos = this.loginUsuario.pesquisaMobilidade;
      } else {
        this.ultimosAcessos = JSON.parse(
          localStorage.getItem("one.mobilidade")
        );
      }
      if (this.ultimosAcessos == undefined || this.ultimosAcessos?.length == 0) {
        this.segment = "proximosdevoce";
      } else {
        this.segment = "ultimosacessos";
        this.ultimosAcessos.sort(function (a, b) {
          return a.nomeEmpresaFilial < b.nomeEmpresaFilial
            ? -1
            : a.nomeEmpresaFilial > b.nomeEmpresaFilial
              ? 1
              : 0;
        });
      }
      this.buscaEmpresasProximas();
      // this.segmentSecundary = 'todos'
    } else {
      // Aplicativos exlcusivos
      this.loginService.buscarListaFiliais().subscribe((res) => {
        this.listaFiliais = res;
      });
    }

    await this.loginService
      .buscarEmpresasPorAppId(localStorage.getItem("appId"))
      .subscribe((res) => {
        this.listaFiliaisExclusivos = res;

        localStorage.setItem('one.filiais', this.listaFiliaisExclusivos?.length)
        localStorage.setItem('one.linkAndroid', res[0]?.linkAndroid)
        localStorage.setItem('one.linkIOS', res[0]?.linkIos)
        if (this.listaFiliaisExclusivos?.length == 1) {
          this.onSelecionarEmpresa(this.listaFiliaisExclusivos[0]);
        }

      });
  }

  ngDoCheck() {
    // document.getElementById('2') =
  }

  closeModal() {
    this.modalController.dismiss();
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

  segmentChanged(event: any) {
    this.tipoUltimosAcessos();
    this.tipoProximos();
    if (this.segment == "ultimosacessos") {
      document.getElementById("ultimosacessos").style.color = "black";
      document.getElementById("proximosdevoce").style.color = "white";
    } else if (this.segment == "proximosdevoce") {
      document.getElementById("proximosdevoce").style.color = "black";
      document.getElementById("ultimosacessos").style.color = "white";
    }
  }

  desativarSegmentSecundary() {
    this.segmentSecundary = null;
  }

  tipoUltimosAcessos() {

    if (this.segment == "ultimosacessos" && this.segmentSecundary == null) {
    } else if (
      this.segment == "ultimosacessos" &&
      this.segmentSecundary == "salao"
    ) {
      this.ultimosAcessosAux = this.ultimosAcessos.filter(
        (tipo) => tipo.tipoNegocio == "1"
      );
    } else if (
      this.segment == "ultimosacessos" &&
      this.segmentSecundary == "barbearia"
    ) {
      this.ultimosAcessosAux = this.ultimosAcessos.filter(
        (tipo) => tipo.tipoNegocio == "2"
      );
    } else if (
      this.segment == "ultimosacessos" &&
      this.segmentSecundary == "estetica"
    ) {
      this.ultimosAcessosAux = this.ultimosAcessos.filter(
        (tipo) => tipo.tipoNegocio == "3"
      );
    } else if (
      this.segment == "ultimosacessos" &&
      this.segmentSecundary == "tatuagem"
    ) {
      this.ultimosAcessosAux = this.ultimosAcessos.filter(
        (tipo) => tipo.tipoNegocio == "4"
      );
    }
  }

  tipoProximos() {
    if (this.segment == "proximosdevoce" && this.segmentSecundary == null) {
      // this.listaEmpresasProximas = this.listaEmpresasProximasAux;
    } else if (
      this.segment == "proximosdevoce" &&
      this.segmentSecundary == "salao"
    ) {
      this.listaEmpresasProximasAux = this.listaEmpresasProximas.filter(
        (tipo) => tipo.tipoNegocio == 1
      );
    } else if (
      this.segment == "proximosdevoce" &&
      this.segmentSecundary == "barbearia"
    ) {
      this.listaEmpresasProximasAux = this.listaEmpresasProximas.filter(
        (tipo) => tipo.tipoNegocio == 2
      );
    } else if (
      this.segment == "proximosdevoce" &&
      this.segmentSecundary == "estetica"
    ) {
      this.listaEmpresasProximasAux = this.listaEmpresasProximas.filter(
        (tipo) => tipo.tipoNegocio == 3
      );
    } else if (
      this.segment == "proximosdevoce" &&
      this.segmentSecundary == "tatuagem"
    ) {
      this.listaEmpresasProximasAux = this.listaEmpresasProximas.filter(
        (tipo) => tipo.tipoNegocio == 4
      );
    }
  }

  toFixedNumber(distancia: number) {
    parseFloat(distancia.toFixed(2));
    return distancia;
  }

  segmentChangedSecundary(event: any) {
    this.tipoUltimosAcessos();
    this.tipoProximos();
    if (this.segmentSecundary == "salao") {
      document.getElementById("salao").style.color = "black";
      document.getElementById("barbearia").style.color = "white";
      document.getElementById("estetica").style.color = "white";
      document.getElementById("tatuagem").style.color = "white";
      // document.getElementById('todos').style.color = "white";
    } else if (this.segmentSecundary == "barbearia") {
      document.getElementById("barbearia").style.color = "black";
      document.getElementById("salao").style.color = "white";
      document.getElementById("estetica").style.color = "white";
      document.getElementById("tatuagem").style.color = "white";
      // document.getElementById('todos').style.color = "white";
    } else if (this.segmentSecundary == "estetica") {
      document.getElementById("estetica").style.color = "black";
      document.getElementById("barbearia").style.color = "white";
      document.getElementById("salao").style.color = "white";
      document.getElementById("tatuagem").style.color = "white";
      // document.getElementById('todos').style.color = "white";
    } else if (this.segmentSecundary == "tatuagem") {
      document.getElementById("tatuagem").style.color = "black";
      document.getElementById("barbearia").style.color = "white";
      document.getElementById("estetica").style.color = "white";
      document.getElementById("salao").style.color = "white";
      // document.getElementById('todos').style.color = "white";
    }

  }

  pesquisaEmpresa(event: string) {
    this.loginService.pesquisarEmpresaPorNome(event).subscribe((res) => {
      this.listaPesquisados = res;
    });
  }

  async buscaEmpresasProximas() {
    await this.loadingService.present();
    this.GeoLocation.getCurrentPosition()
      .then((position: any) => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        this.loginService
          .buscarEmpresasProximas(latitude.toString(), longitude.toString())
          .subscribe(
            (res) => {
              this.loadingService.dismiss();
              this.listaEmpresasProximas = res;
              this.listaEmpresasProximas.map(
                (x) => (x.distancia = parseFloat(x.distancia.toFixed(1)))
              );
            },
            (fail) => {
              this.loadingService.dismiss();
            }
          );
      })
      .catch((error) => {
        this.loadingService.dismiss();
      });
  }

  async desvincularEmpresa(empresa: any) {
    const alert = await this.alertController.create({
      header: this.Translate.instant("LOGIN.REMOVAL.ALERT.HEADER"),
      message: this.Translate.instant("LOGIN.REMOVAL.ALERT.MESSAGE"),
      buttons: [
        {
          text: this.Translate.instant("LOGIN.REMOVAL.ALERT.CANCEL"),
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
          },
        },
        {
          text: this.Translate.instant("LOGIN.REMOVAL.ALERT.ACCEPT"),
          handler: () => {
            if (this.loginUsuario == null) {
              this.loginService
                .desvincularAcesso(
                  empresa.empresasID,
                  empresa.filiaisID,
                  this.userData.authenticatedUser.usuariosId
                )
                .subscribe((res) => {
                  this.ultimosAcessos = this.ultimosAcessos.filter(
                    (el) => el.filiaisID != empresa.filiaisID
                  );
                });
            } else {
              this.loginService
                .desvincularAcesso(
                  empresa.empresasID,
                  empresa.filiaisID,
                  this.loginUsuario.usuarioId
                )
                .subscribe((res) => {
                  this.ultimosAcessos = this.ultimosAcessos.filter(
                    (el) => el.filiaisID != empresa.filiaisID
                  );
                });
            }
          },
        },
      ],
    });
    await alert.present();
  }

  onSelecionarEmpresa(empresa: MobilidadeModel | string) {

    let login: LoginModel;
    let push = JSON.parse(localStorage.getItem("one.push"));
    if (localStorage.getItem("one.trocouEstabelecimento") != "true") {
      login = new LoginModel();
      // se for uma string signfica q o Autocomplete acionou a funcao
      if (typeof empresa === "string") {
        let emp = this.listaPesquisados.filter(
          (x) => x.nomeEmpresaFilial === empresa
        )[0];
        login.email = this.userLogin.email;
        login.senha = this.userLogin.senha;
        login.empresaId = emp.empresasID;
        login.filialId = emp.filiaisID;
        login.appId = Number(environment.appId);
        login.appleDeviceToken = Capacitor.getPlatform() == "ios" ? push?.value : "";
        login.googleRegistrationId =
          Capacitor.getPlatform() == "android" ? push?.value : "";
        this.onLogin(login);
      } else {
        login.email = this.userLogin.email;
        login.senha = this.userLogin.senha;
        login.empresaId = empresa.empresasID;
        login.filialId = empresa.filiaisID;
        login.appId = Number(environment.appId);
        login.appleDeviceToken = Capacitor.getPlatform() == "ios" ? push?.value : "";
        login.googleRegistrationId =
          Capacitor.getPlatform() == "android" ? push?.value : "";
        this.onLogin(login);
      }
    } else {
      login = new LoginModel();
      if (typeof empresa === "string") {
        let emp = this.listaPesquisados.filter(
          (x) => x.nomeEmpresaFilial === empresa
        )[0];
        login.empresaId = emp.empresasID;
        login.filialId = emp.filiaisID;

        this.modalController.dismiss({ res: login });
      } else {
        login.empresaId = empresa.empresasID;
        login.filialId = empresa.filiaisID;
        if (login.empresaId == undefined) {
          let empresaAny: any = empresa;
          login.empresaId = empresaAny.empresaId;
          login.filialId = empresaAny.filialId;
        }

        this.modalController.dismiss({ res: login });
      }
      localStorage.setItem("one.trocouEstabelecimento", "false");
    }
  }

  async onLogin(login: LoginModel) {
    await this.loadingService.present();
    this.loginService.login(login, this.flagHash).subscribe(
      (res) => {

        if (
          this.userLogin.nomeCompleto != null &&
          (res.authenticatedUser.nomeUsuario == "true" ||
            res.authenticatedUser.nomeUsuario == "null")
        ) {
          this.loginService
            .atualizarNomeCadastro(
              this.userLogin.nomeCompleto,
              this.userLogin.email
            )
            .subscribe((response) => {
            });
          res.authenticatedUser.nomeUsuario = this.userLogin.nomeCompleto;
        }
        this.loadingService.dismiss();
        // this.onSuccess(res)
        this.modalController.dismiss({ res: res });
      },
      (fail) => {
        this.loadingService.dismiss();
        // Informa ao usuário que o celular já foi cadastrado
        if (fail.error === "API.LOGINEMPRESA.CELULAREXIST") {
          this.Toast.presentToast(
            this.Translate.instant("LOGIN.CELULAREXIST"),
            "danger"
          );
        } else if (fail.error === "API.LOGINEMPRESA.INVALIDCREDENTIAL") {
          this.Toast.presentToast(
            this.Translate.instant("LOGIN.CREDENCIALINVALIDA"),
            "danger"
          );
        } else {
          this.Toast.presentToast(
            this.Translate.instant("LOGIN.ERRO"),
            "danger"
          );
        }
        this.modalController.dismiss();
      }
    );
  }
}

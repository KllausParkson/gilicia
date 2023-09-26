import { Component, OnInit } from "@angular/core";
import { ProximosAgendamentosModel } from "./models/proximosAgendamentosModel";
import { AgendaService } from "./services/agenda.service";
import { environment } from "../../environments/environment";
import { NovoAgendamentoComponent } from "./modals/novo-agendamento/novo-agendamento.component";
import {
  AlertController,
  ModalController,
  PopoverController,
} from "@ionic/angular";
import { LoadingService } from "../core/services/loading.service";
import { ChangeDetectorRef } from "@angular/core";
import { CalendarComponent } from "ionic2-calendar/calendar";
import { TranslateService } from "@ngx-translate/core";
import { InfosEmpresaModalComponent } from "../shared/infos-empresa-modal/infos-empresa-modal.component";
import { SharedService } from "../shared/services/shared.service";
import { NotificationModalSharedComponent } from "../shared/notification-shared/notification-modal-shared/notification-modal-shared.component";
import { AtualizarCelularComponent } from "./modals/atualizar-celular/atualizar-celular.component";
import { ToastService } from "../core/services/toast.service";
import { Capacitor } from "@capacitor/core";
import { UpdateTokenNotification } from "./models/updateNotificationModel";
import { LoginService } from "../login/services/login.service";
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { Market } from "@awesome-cordova-plugins/market/ngx";
import { BannerService } from "../core/services/banner.service";
import { cliforColsAssociacaoModel, usuarioSelecionavel } from './models/cliforColsAssociacaoModel'
@Component({
  selector: "app-agenda",
  templateUrl: "./agenda.page.html",
  styleUrls: ["./agenda.page.scss"],
})
export class AgendaPage implements OnInit {
  public logo;
  public agendamentos: any; // Array<ProximosAgendamentosModel>;
  private userData: any;
  public tipoLogin;
  public nomeEmpresaFilial: string;
  public nomeUsuario: string;
  public iOS: boolean;
  public semLogo = 'https://oneproducao.blob.core.windows.net/one2/Imagens/One_Logo.png';
  public notificationTokens: UpdateTokenNotification = new UpdateTokenNotification()
  public appLogado: any;
  public basehref: any;
  public usuariosSelecionaveis: Array<usuarioSelecionavel>;
  public usuarioSelecionado: usuarioSelecionavel;



  constructor(
    private agendaService: AgendaService,
    private ModalController: ModalController,
    private ref: ChangeDetectorRef,
    private alertController: AlertController,
    public translate: TranslateService,
    private LoadingService: LoadingService,
    private sharedService: SharedService,
    private toastService: ToastService,
    private loginService: LoginService,
    private appVersion: AppVersion,
    private market: Market,
    private bannerService: BannerService
  ) { }

  async ngOnInit() {

    this.userData = JSON.parse(localStorage.getItem("one.user"));
    await this.agendaService.getAssociacoesUsuario(this.userData.authenticatedUser.cliForColsId).then(
      (result) => {
        var dependendentes = result;
        this.usuariosSelecionaveis = new Array<usuarioSelecionavel>();
        this.usuarioSelecionado = new usuarioSelecionavel();
        this.usuarioSelecionado.cliforcolsId = this.userData.authenticatedUser.cliForColsId;
        this.usuarioSelecionado.nome = this.userData.authenticatedUser.nomeUsuario;
        this.usuariosSelecionaveis.push(this.usuarioSelecionado);
        dependendentes.forEach(x => {
          let selecionavel = new usuarioSelecionavel();
          selecionavel.cliforcolsId = x.dependenteId;
          selecionavel.nome = x.nomeDependente;
          this.usuariosSelecionaveis.push(selecionavel);
        })

        //console.log(this.usuariosSelecionaveis);
      },
      async (fail) => {
        console.log(fail)
      });

    let os = Capacitor.getPlatform()
    let linkloja = os == 'android' ? localStorage.getItem('appId') != '1' ? localStorage.getItem('one.linkAndroid') : 'https://play.google.com/store/apps/details?id=onebeleza.app'
      : localStorage.getItem('appId') != '1' ? localStorage.getItem('one.linkIOS') : 'http://itunes.apple.com/app/id1549875818'
    let appId = localStorage.getItem('appId');


    this.basehref = localStorage.getItem('basehref')
    if (localStorage.getItem('appId') != '1') {
      await this.loginService.buscaEmpresaMobilidadeId(JSON.parse(localStorage.getItem('one.user')).authenticatedBranch.mobilidadeId).then(res => {
        this.appLogado = res.empresasID;
        this.loginService.buscarEmpresasPorAppId(localStorage.getItem('appId')).subscribe((res) => {

          var appCerto = Object.values(res).findIndex(mob => mob.empresasID == this.appLogado);
          if (appCerto == -1) {
            this.forcarlogout();
          }
        }, fail => {
        });

      }, fail => {
      })

    }

    const push = JSON.parse(localStorage.getItem('one.push'));
    this.notificationTokens.appleDeviceToken = Capacitor.getPlatform() === 'ios' ? push?.value : null,
      this.notificationTokens.googleRegistrationId = Capacitor.getPlatform() === 'android' ? push?.value : null
    this.notificationTokens.appId = localStorage.getItem('appId');


    await this.agendaService.updateTokenNotification(this.notificationTokens).subscribe(res => {
    }, error => {
    })


    this.iOS = this.detectiOS();
    this.tipoLogin = localStorage.getItem("one.tipologin");
    this.tipoLogin =
      this.tipoLogin.charAt(0).toUpperCase() + this.tipoLogin.slice(1);
    if (localStorage.getItem("one.autoatendimento") == "true") {
      this.tipoLogin = "Auxiliar";
    }
    
    this.agendaService.atualizarAppId().subscribe(
      (result) => {
      },
      (fail) => {
      }
    );
    this.nomeEmpresaFilial =
      this.userData.authenticatedBranch.nomeEmpresaFilial;
    this.nomeUsuario = this.userData.authenticatedUser.nomeUsuario;
    this.logo = this.userData.authenticatedBranch.logoMarca;




    this.ref.detectChanges();
    await this.sharedService.getNotifications(this.userData.authenticatedBranch.empresaId, this.userData.authenticatedBranch.filialId, this.userData.authenticatedUser.cliForColsId).subscribe(res => {
      var antigas = localStorage.getItem('one.notificationsCount') == null ? 0 : localStorage.getItem('one.notificationsCount')
      if (antigas < res?.length) {
        this.notificacaoInterativa(antigas, res?.length)
      }


    })


    var imgBanner = "https://oneproducao.blob.core.windows.net/imgs/splitone-mobile.jpg";
    var acaoClick = "https://materiais.onebeleza.com.br/lp-split-one";
    var nomeBanner = "splitone"

    if (this.tipoLogin != 'Cliente') {
      //this.bannerService.bannerAnuncio(imgBanner, acaoClick, nomeBanner)
    }
  }

  changeUsuario(event: any) {
    this.usuarioSelecionado = event;
    this.agendaService.changeMessage(JSON.stringify(this.usuarioSelecionado));
  }


  async forcarlogout() {
    const alert = await this.alertController.create({
      header: this.translate.instant('AGENDA.FORCELOGOUT'),
      message: this.translate.instant('AGENDA.ERROTERMINAL'),
      buttons: [{
        text: this.translate.instant('OK'),
        handler: () => {
          this.logout();
        }
      }
      ]
    });
    await alert.present();
  }

  async modalAtualizaçãoApp(packageValue) {
    const alert = await this.alertController.create({
      header: 'Atualização Disponivel',
      message: 'Existe uma nova atualização para o seu aplicativo, por favor atualize seu aplicativo.',
      buttons: [{
        text: this.translate.instant('Atualizar'),
        handler: () => {
          this.market.open(packageValue);
        }
      }
      ]
    });
    await alert.present();
  }

  async logout() {
    let name = environment.name;
    let lang = localStorage.getItem('one.lang')
    let rateData = localStorage.getItem('one.rate')
    let termosPolitica = localStorage.getItem('one.termosPolitica')
    let user = localStorage.getItem('one.user')
    let timestamp = localStorage.getItem('one.timestamp')
    let ratestamp = localStorage.getItem('one.ratestamp')
    localStorage.clear()
    localStorage.setItem('one.lang', lang);
    localStorage.setItem('one.user', user);
    localStorage.setItem('one.rate', rateData);
    localStorage.setItem('one.termosPolitica', termosPolitica)
    if (timestamp != null) localStorage.setItem('one.timestamp', timestamp)
    if (ratestamp != null) localStorage.setItem('one.ratestamp', ratestamp)
    var url = window.location.origin;
    //eh necessario testar se esta em producao, pois a url precisa do nome do applicativo
    document.location.href = environment.production ? `${url}/${this.basehref}/login` : document.location.href = `${url}/login`
  }

  async atualizarCelular(celular) {
    const modal = await this.ModalController.create({
      component: AtualizarCelularComponent,
      cssClass: "atualizarCelularModal",
      componentProps: {
        celular: celular,
      },
    });
    modal.onDidDismiss().then(async (retorno) => {
      if (retorno.data) {
        var celularFormatado = retorno.data.phoneNumber
          .replace("(", "")
          .replace(")", "")
          .replace(" ", "")
          .replace("-", "");
        await this.agendaService
          .atualizaCelular(
            this.userData.authenticatedUser.email,
            celularFormatado
          )
          .subscribe(
            (response) => {
              this.agendaService
                .removerNumeroInvalidoCache(
                  this.userData.authenticatedBranch.filialId,
                  this.userData.authenticatedUser.email
                )
                .subscribe(
                  (response) => {
                    this.toastService.presentToast("Sucesso!");
                  },
                  (fail) => {
                    this.toastService.presentToast("Erro!", "danger");
                  }
                );
            },
            (fail) => {
              this.toastService.presentToast("Erro!", "danger");
            }
          );
      }
    });

    return await modal.present();
  }

  async notificacaoInterativa(notificacoesAntigas, notificacoesNovas) {
    const modal = await this.ModalController.create({
      component: NotificationModalSharedComponent,
      componentProps: {
        notificacoesAntigas: notificacoesAntigas,
        notificacoesNovas: notificacoesNovas,
      },
    });

    return await modal.present();
  }

  async onClickInfosEmpresa() {
    const popover = await this.ModalController.create({
      component: InfosEmpresaModalComponent,
      cssClass: "infosEmpresa",
    });
    return await popover.present();
  }

  detectiOS() {
    if (
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i)
    )
      return true;
    else return false;
  }

}

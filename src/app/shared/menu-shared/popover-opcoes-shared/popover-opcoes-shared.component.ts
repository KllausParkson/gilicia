import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'environments/environment';
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { EscolherEstabelecimentoModalComponent } from 'app/login/modals/escolher-estabelecimento-modal/escolher-estabelecimento-modal.component';
import { RelatarBugComponent } from 'app/shared/relatar-bug-modal/relatar-bug-modal.component';

//imports requeridos para "escolher estabelecimento" (inclui o "ModalController")
import { LoginService } from 'app/login/services/login.service';
import { LoginModel } from 'app/login/models/login-model';
import { LoadingService } from 'app/core/services/loading.service';
import { PerfilModel } from 'app/perfil/models/perfil-model';
import { PerfilServiceService } from 'app/perfil/services/perfil-service.service';
import { LoginUsuarioModel } from 'app/login/models/login-usuario-model';
import { ToastService } from 'app/core/services/toast.service';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-popover-opcoes-shared',
  templateUrl: './popover-opcoes-shared.component.html',
  styleUrls: ['./popover-opcoes-shared.component.scss'],
})
export class PopoverOpcoesSharedComponent implements OnInit {

  //variavel armazena nome do applicativo atual para ser usada na url
  private name: string;
  public validaPerfil: boolean;
  userData: any;
  public autoatendimento: boolean;

  //variaveis requeridas para "escolher estabelecimento"
  public empresaAtual: any;
  public perfilUsuario: PerfilModel;
  public loginRes: LoginUsuarioModel;
  public mobilidade: any[];
  public parametrosLight: any;
  public tipoLogin: any
  public basehref: any
  public temFilial: boolean;

  constructor(private AlertController: AlertController,
    private Translate: TranslateService,
    public socialSharing: SocialSharing,
    public ModalController: ModalController,

    //construtores requeridos para "escolher estabelecimento"
    private LoginService: LoginService,
    private loadingService: LoadingService,
    private PerfilService: PerfilServiceService,
    private Toast: ToastService
  ) { }

  ngOnInit() {
    this.temFilial = +localStorage.getItem('one.filiais') > 1 ? true : false
    this.temFilial = localStorage.getItem('appId') == '1' ? true : this.temFilial
    this.basehref = localStorage.getItem('basehref')
    this.tipoLogin = localStorage.getItem('one.tipologin')
    this.autoatendimento = localStorage.getItem('one.autoatendimento') == "true" ? true : false;
    this.name = environment.name
    this.userData = JSON.parse(localStorage.getItem('one.user'))
    this.name = environment.name
    //funcoes requeridas para "escolher estabelecimento"
    this.empresaAtual = JSON.parse(localStorage.getItem('one.user'))?.authenticatedBranch;
    if (!this.autoatendimento) {
      this.PerfilService.getUsuarioPerfil().subscribe(
        res => {
          this.loadingService.dismiss();
          this.perfilUsuario = res;
          this.getMobilidade();
        }
      );
    }
    //fim funcoes requeridas para "escolher estabelecimento"
    this.validaPerfis()
  }

  validaPerfis() {
    if (this.userData.authenticatedUser.perfilColaborador == true && this.userData.authenticatedUser.perfilCliente == true || this.userData.authenticatedUser.perfilCliente == true && this.userData.authenticatedUser.perfilGerente == true || this.userData.authenticatedUser.perfilColaborador == true && this.userData.authenticatedUser.perfilGerente == true || this.userData.authenticatedUser.perfilColaborador == true && this.userData.authenticatedUser.perfilCliente == true && this.userData.authenticatedUser.perfilGerente) {
      this.validaPerfil = true;
    }
    else
      this.validaPerfil = false;
  }

  onClickTrocarPerfil() {
    var url = window.location.origin;
    localStorage.setItem('one.trocouPerfil', 'true')
    //eh necessario testar se esta em producao, pois a url precisa do nome do applicativo
    document.location.href = environment.production ? `${url}/${this.basehref}/login/escolher-perfil` : `${url}/login/escolher-perfil`
  }
  onClickCompartilhar() {

    var linkAndroid = localStorage.getItem('one.linkAndroid')
    var linkIos = localStorage.getItem('one.linkIOS')

    if (localStorage.getItem('appId') == '1') {
      if (navigator.share) {
        navigator.share({ title: "App " + localStorage.getItem("basehref") + "\n", text: "App" + localStorage.getItem("basehref") + "\n", url: "http://onelink.to/qx7bv9" })
      }
      else {
        this.socialSharing.share("App " + localStorage.getItem("basehref") + "\n", null, null, "http://onelink.to/qx7bv9")
      }
    }
    else {
      if (Capacitor.getPlatform() == 'ios') {
        if (navigator.share) {
          navigator.share({ title: "App " + localStorage.getItem("basehref") + "\n", text: "App" + localStorage.getItem("basehref") + "\n", url: linkIos })
        }
        else {
          this.socialSharing.share("App " + localStorage.getItem("basehref") + "\n", null, null, linkIos)
        }
      }
      else {
        if (navigator.share) {
          navigator.share({ title: "App " + localStorage.getItem("basehref") + "\n", text: "App" + localStorage.getItem("basehref") + "\n", url: linkAndroid })
        }
        else {
          this.socialSharing.share("App " + localStorage.getItem("basehref") + "\n", null, null, linkAndroid)
        }
      }
    }
  }

  //"onSuccess" requer isto
  getMobilidade() {
    let mob = JSON.parse(localStorage.getItem('one.mobilidade'));

    if (mob === null || mob === undefined || mob?.length <= 1) {
      this.PerfilService.getUltimosAcessos(this.perfilUsuario.email).subscribe(res => {
        mob = mob?.concat(res.pesquisaMobilidade);
        mob = mob.filter((x) => x.nomeEmpresaFilial !== this.empresaAtual.nomeEmpresaFilial);
        this.mobilidade = [this.empresaAtual, ...mob];
      });
    }
    else {
      // Coloca a empresa atual como primeiro da lista a ser mostrada para o usuario
      mob = mob.filter((x) => x.nomeEmpresaFilial !== this.empresaAtual.nomeEmpresaFilial);
      if (mob) {
        this.mobilidade = [this.empresaAtual, ...mob];
      }
    }
  }

  //"onClickEmpresa" requer isto
  loginEstabelecimentoAcessado(empresa: any) { // Caso ja tenha acessado um estabelecimento as variaveis de login tem nomes diferentes
    const push = JSON.parse(localStorage.getItem('one.push'));
    const login: LoginModel = {
      email: this.perfilUsuario.email,
      senha: this.userData.authenticatedUser.hash,
      empresaId: empresa.empresaId,
      filialId: empresa.filialId,
      appId: Number(localStorage.getItem('appId')),
      appleDeviceToken: Capacitor.getPlatform() === 'ios' ? push?.value : '',
      googleRegistrationId: Capacitor.getPlatform() === 'android' ? push?.value : ''
    };
    return login;
  }

  //"abrirModalEscolherEstabelecimento" requer isto
  async onClickEmpresa(empresa: any) {
    if (empresa.filialId !== this.empresaAtual.filialId) {
      const push = JSON.parse(localStorage.getItem('one.push'));
      let login: LoginModel = {
        email: this.perfilUsuario.email,
        senha: this.userData.authenticatedUser.hash,
        empresaId: empresa.empresasID,
        filialId: empresa.filiaisID,
        appId: Number(localStorage.getItem('appId')),
        appleDeviceToken: Capacitor.getPlatform() === 'ios' ? push?.value : '',
        googleRegistrationId: Capacitor.getPlatform() === 'android' ? push?.value : ''
      };
      if (login.empresaId === undefined) {
        login = this.loginEstabelecimentoAcessado(empresa);
      }
      this.loadingService.present();
      await this.LoginService.loginInterno(login)
        .subscribe(
          res => {

            this.loginRes = res.data;
            this.loadingService.dismiss();
            this.onSuccess(res);
            localStorage.setItem('one.tipologin', 'cliente');

            // L�gica para recarregar a p�gina para aplicar a mudan�a de troca de sal�o
            const url = window.location.origin;
            document.location.href = environment.production ? `${url}/${this.basehref}/login/escolher-perfil` : `${url}/login/escolher-perfil`;
          },
          fail => {
            this.loadingService.dismiss();
          }
        );
    }
  }

  //"onClickEmpresa" requer isto
  onSuccess(response: any) {
    const oneLang = localStorage.getItem('one.lang'); // manter os dados de idioma
    const tempPassword = response.authenticatedUser?.tempPassword;

    if (!tempPassword) {
      var quantFiliais = localStorage.getItem('one.filiais')
      var mobilidadeUrl = localStorage.getItem('mobilidadeUrl')
      localStorage.clear();
      if(mobilidadeUrl != null && mobilidadeUrl != undefined) {
        localStorage.setItem("mobilidadeUrl", mobilidadeUrl);
      }
      localStorage.setItem('one.filiais', quantFiliais)
      localStorage.setItem('claims', JSON.stringify(response.claims));
      localStorage.setItem('one.token', response.access_token);
      localStorage.setItem('one.user', JSON.stringify(response));
      localStorage.setItem('one.lang', oneLang);
      localStorage.setItem('one.mobilidade', JSON.stringify(this.mobilidade));

      this.Toast.presentToast(this.Translate.instant('LOGIN.SUCESSO')).then(() => {
        this.empresaAtual = response.authenticatedBranch;
      });
    }
  }

  //funcao principal "escolher estabelecimento"
  async abrirModalEscolherEstabelecimento() {
    localStorage.setItem("one.trocouEstabelecimento", "true");
    const modalEscolherEstabelecimento = await this.ModalController.create({
      component: EscolherEstabelecimentoModalComponent
    });

    modalEscolherEstabelecimento.onDidDismiss().then(res => {
      if (res.data) {
        const empresa: any = {
          empresasID: res.data.res.empresaId,
          filiaisID: res.data.res.filialId,
        }
        localStorage.setItem('one.trocouEstabelecimento', 'true');
        this.onClickEmpresa(empresa);
      }
    });

    return await modalEscolherEstabelecimento.present();

  }

  async logOut() {
    const alert = await this.AlertController.create({
      header: this.Translate.instant('SHARED.MENU.LOGOUT.HEADER'),
      message: this.Translate.instant('SHARED.MENU.LOGOUT.MESSAGE'),
      buttons: [
        {
          text: this.Translate.instant('SHARED.MENU.LOGOUT.CANCEL'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: this.Translate.instant('SHARED.MENU.LOGOUT.OUT'),
          handler: () => {
            var sistema = this.detectiOS() ? "ios" : "android"
            this.LoginService.logout(sistema).
              subscribe(
                res => {
                  this.onLogOuSuccsess()
                },
                fail => {
                }
              )
          }
        }
      ]
    });
    await alert.present();
  }

  onLogOuSuccsess() {
    //armazea os dados de linguagem escolhida pelo usuario
    let lang = localStorage.getItem('one.lang')
    let rateData = localStorage.getItem('one.rate')
    let termosPolitica = localStorage.getItem('one.termosPolitica')
    let user = localStorage.getItem('one.user')
    let timestamp = localStorage.getItem('one.timestamp')
    let ratestamp = localStorage.getItem('one.ratestamp')
    var mobilidadeUrl = localStorage.getItem('mobilidadeUrl')

    localStorage.clear()
    if(mobilidadeUrl != null && mobilidadeUrl != undefined) {
      localStorage.setItem("mobilidadeUrl", mobilidadeUrl);
    }
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

  async relatarBug() {
    const modalRelatarBug = await this.ModalController.create({
      component: RelatarBugComponent,
      cssClass: 'relatarBugModal'
    });

    modalRelatarBug.onDidDismiss().then(res => {
      if (res.data) {
        const empresa: any = {
          empresasID: res.data.res.empresaId,
          filiaisID: res.data.res.filialId,
        }
        localStorage.setItem('one.trocouEstabelecimento', 'true');
        this.onClickEmpresa(empresa);
      }
    });

    return await modalRelatarBug.present();

  }
  detectiOS() {
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)) {
      return true;
    }
    else {
      return false;
    }
  }

}

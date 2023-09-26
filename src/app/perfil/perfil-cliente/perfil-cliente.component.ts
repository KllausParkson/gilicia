import { ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AlertController, IonInfiniteScroll, ModalController, NavController } from '@ionic/angular'; //adicionei NavController
import { FidelidadeOnepointsComponent } from '../modals/fidelidade-onepoints/fidelidade-onepoints.component' //adicionei
import { TranslateService } from '@ngx-translate/core';
import { TelefonePipe } from 'app/core/pipes/telefone.pipe';
import { ToastService } from 'app/core/services/toast.service';
import { HistoricoModel } from '../models/historico-model';
import { MilhagensModel } from '../models/milhagens-model';
import { PerfilModel } from '../models/perfil-model';
import { PerfilServiceService } from '../services/perfil-service.service';
import { LoginService } from 'app/login/services/login.service';
import { environment } from 'environments/environment';
import { EditarPerfilModalComponent } from '../modals/editar-perfil-modal/editar-perfil-modal.component';
import { LoginModel } from 'app/login/models/login-model';
import { Capacitor } from '@capacitor/core';
import { LoadingService } from 'app/core/services/loading.service';
import { LoginUsuarioModel } from 'app/login/models/login-usuario-model';
import { EscolherEstabelecimentoModalComponent } from 'app/login/modals/escolher-estabelecimento-modal/escolher-estabelecimento-modal.component';
import { ConfirmaEstabelecimentoComponent } from './confirma-estabelecimento/confirma-estabelecimento.component';

@Component({
  selector: 'app-perfil-cliente',
  templateUrl: './perfil-cliente.component.html',
  styleUrls: ['./perfil-cliente.component.scss'],
})
export class PerfilClienteComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  public acabouHistorico: boolean = false;
  public perfilUsuario: PerfilModel;
  public mobilidade: any[];
  public empresaAtual: any;
  public mob2: any[];
  private userData: any;
  public loginRes: LoginUsuarioModel;
  public nomeEstabelecimento: any;

  public milhagem: MilhagensModel;

  public segment = 'historico';

  public historico: HistoricoModel[] = new Array<HistoricoModel>();
  private ordem: number;

  public countNotification: number;
  public semLogo = 'https://oneproducao.blob.core.windows.net/one2/Imagens/One_Logo.png';
  private name: string;

  public basehref: any;
  public appidExclusivo: any;
  public flagTema: any = false;


  constructor(private PerfilService: PerfilServiceService,
    private alertController: AlertController,
    private LoginService: LoginService,
    private Toast: ToastService,
    private Translate: TranslateService,
    private ModalController: ModalController,
    private Telefone: TelefonePipe,
    private loadingService: LoadingService,
    private cd: ChangeDetectorRef,
    private navCtrl: NavController,
    private renderer: Renderer2) { } //adicionei navcontroller aqui

  async ngOnInit() {
    this.flagTema = (localStorage.getItem('tema') != undefined || localStorage.getItem('tema') != null) && localStorage.getItem('tema') == 'dark' ? true : false
    this.appidExclusivo = localStorage.getItem('appId')
    this.basehref = localStorage.getItem('basehref')
    //estas duas linhas abaixo sao apenas para forcar o comportamento e devem ser removidas apos concluir a demanda
    // localStorage.setItem('one.trocouEstabelecimento', 'true');
    // this.abrirModalEscolherEstabelecimento();
    this.name = environment.name
    this.userData = JSON.parse(localStorage.getItem('one.user'));
    await this.loadingService.present();
    this.ordem = 1;
    this.PerfilService.getUsuarioPerfil()
      .subscribe(
        res => {
          this.loadingService.dismiss();
          this.perfilUsuario = res;
          this.perfilUsuario.celular = this.Telefone.transform(this.perfilUsuario.celular);
          this.getMobilidade();
          this.getMilhagem();
          this.getHistorico(this.ordem)
            .subscribe(
              res => {
                if (res?.length > 0) {
                  this.historico = res;

                }
              }
            );
        }
      );
    // pega a empresa logda
    this.empresaAtual = JSON.parse(localStorage.getItem('one.user'))?.authenticatedBranch;
  }

  getMilhagem() {
    this.PerfilService.getMilhagens()
      .subscribe(res => {
        this.milhagem = res;
      });
  }

  modoEscuro(event) {

    if (event.detail.checked) {
      this.renderer.setAttribute(document.body, 'color-theme', 'dark')
      localStorage.setItem('tema', 'dark')
    } else {
      this.renderer.setAttribute(document.body, 'color-theme', 'light')
      localStorage.setItem('tema', 'light')
    }
  }

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

  getHistorico(ordem: number, ev?: any) {
    this.acabouHistorico = false;
    return this.PerfilService.getHistorico(ordem);

  }

  loadData(ev: any) {
    this.ordem++;

    this.getHistorico(this.ordem, ev)
      .subscribe(
        res => {
          if (res?.length > 0) {
            this.historico = [...this.historico, ...res];
          }
          if (res?.length <= 4) {
            this.acabouHistorico = true;
          }
          this.cd.detectChanges();
        }
      );

  }
  async confirmaEstabelecimento(empresa: any) {
    const modal = await this.ModalController.create({
      component: ConfirmaEstabelecimentoComponent,
      componentProps: {
        empresa: empresa,
      },
      cssClass: 'confirmaEstabelecimento',
    });
    modal.onDidDismiss().then(res => {
      if (res.data === true) {
        this.onClickEmpresa(empresa);
      }
    });
    return await modal.present();
  }

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

            // Lógica para recarregar a página para aplicar a mudança de troca de salão
            const url = window.location.origin;
            document.location.href = environment.production ? `${url}/${this.basehref}/login/escolher-perfil` : `${url}/perfil/perfil-cliente`;
          },
          fail => {
            this.loadingService.dismiss();
          }
        );
    }
  }

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

  onSuccess(response: any) {
    const oneLang = localStorage.getItem('one.lang'); // manter os dados de idioma
    const tempPassword = response.authenticatedUser?.tempPassword;

    if (!tempPassword) {

      localStorage.clear();
      localStorage.setItem('claims', JSON.stringify(response.claims));
      localStorage.setItem('one.token', response.access_token);
      localStorage.setItem('one.user', JSON.stringify(response));
      localStorage.setItem('one.lang', oneLang);
      localStorage.setItem('one.mobilidade', JSON.stringify(this.mobilidade));

      this.Toast.presentToast(this.Translate.instant('LOGIN.SUCESSO')).then(() => {
        this.empresaAtual = response.authenticatedBranch;
        this.ordem = 1;
        this.getMobilidade();
        this.getMilhagem();
        this.getHistorico(this.ordem)
          .subscribe(
            res => {
              this.historico = res;
            }
          );
      });
    }
  }

  async openEditarPerfilModal() {
    const modal = await this.ModalController.create({
      component: EditarPerfilModalComponent,
      componentProps: {
        perfil: this.perfilUsuario
      },
      cssClass: 'editarPerfilCliente',
    });
    modal.onDidDismiss().then(res => {
      if (res.data?.perfil) {
        this.perfilUsuario = res.data.perfil;
      }
    });

    return await modal.present();
  }
  async abrirModalEscolherEstabelecimento() {
    localStorage.setItem("one.trocouEstabelecimento", "true");
    const modal = await this.ModalController.create({
      component: EscolherEstabelecimentoModalComponent
    });

    modal.onDidDismiss().then(res => {
      if (res.data) {
        const empresa: any = {
          empresasID: res.data.res.empresaId,
          filiaisID: res.data.res.filialId,
        }
        localStorage.setItem('one.trocouEstabelecimento', 'true');
        this.onClickEmpresa(empresa);
      }
    });

    return await modal.present();

  }
  // função do modal para mostrar pontos de fidelidade aqui
  async mostrarFidelidadeOnepoints() {
    const modal = await this.ModalController.create({
      component: FidelidadeOnepointsComponent,
      cssClass: 'modalVantagens',
      backdropDismiss: false,
    });

    await modal.present();

  }

}

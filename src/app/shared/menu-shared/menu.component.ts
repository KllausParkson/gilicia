import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PopoverHistoricoSharedComponent } from './popover-historico-shared/popover-historico-shared.component';
import { PopoverOpcoesSharedComponent } from './popover-opcoes-shared/popover-opcoes-shared.component';
import { PopoverRelatoriosSharedComponent } from './popover-relatorios-shared/popover-relatorios-shared.component';
import { environment } from 'environments/environment';
import { ParametrosLightModel } from '../../agenda/models/parametrosLightModel';
import { AgendaService } from '../../agenda/services/agenda.service';
import { SharedService } from '../services/shared.service'
import { PerfilServiceService } from 'app/perfil/services/perfil-service.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, DoCheck {

  public active: string;
  public onHistorico: boolean;
  public onRelatorios: boolean;
  public validaPerfil: boolean;
  public onPerfil: boolean;
  userData: any;
  private name: string;
  public parametrosLight: ParametrosLightModel;
  public tipoLogin: any
  public basehref: any;
  public temAssinatura: boolean = false;

  constructor(private router: Router,
    private Translate: TranslateService,
    private alertController: AlertController,
    private popoverController: PopoverController,
    private agendaService: AgendaService,
    private perfilService: PerfilServiceService,
    private sharedService: SharedService) {
  }

  ngOnInit() {
    this.basehref = localStorage.getItem('basehref')
    this.getParametrosLight()
    setTimeout(() => {
      this.userData = JSON.parse(localStorage.getItem('one.user'));
      this.tipoLogin = localStorage.getItem('one.tipologin')
      this.name = environment.name;
      this.validaPerfis();
      this.setaTelaAtiva();

      let str = localStorage.getItem('one.tipologin');

      // verifica se o login eh de um colaborador e se ele tem permissoes suficientes para liberar botao historico
      this.onHistorico = str === 'colaborador' && (this.userData.claims['Comissões'] != null
        || this.userData.claims['Relatórios'] != null) && (localStorage.getItem('one.autoatendimento') != "true") ? true : false;

      // verifica se o login é de um gestor e se ele tem permissoes suficientes para liberar o botao de relatorios
      this.onRelatorios = str === 'gestor' &&
        (this.userData.claims['Comissões'] != null
          || this.userData.claims['Relatórios'] != null
          || this.userData.claims['Receitas'] != null
          || this.userData.claims['Serviços'] != null
          || this.userData.claims['Produtos'] != null) ? true : false;

      this.onPerfil = localStorage.getItem('one.autoatendimento') === "true" ? false : true;
    }, 500)
    this.verificaAssinatura()
  }

  ngDoCheck() {
    this.setaTelaAtiva();
  }

  onClick(button: string) {
    let tipoLogin = localStorage.getItem('one.tipologin');
    this.active = button;
    if (button == 'agenda') {

      if (tipoLogin === 'cliente') {
        this.router.navigateByUrl('/agenda/agenda-cliente');
      } else if (tipoLogin === 'colaborador') {
        this.router.navigateByUrl('/agenda/agenda-profissional');
      } else if (tipoLogin === 'gestor') {
        this.router.navigateByUrl('/agenda/agenda-gestor');
      }

    } else if (button == 'perfil') {
      if (tipoLogin == 'cliente') {
        this.router.navigateByUrl('/perfil/perfil-cliente');

      } else {
        this.router.navigateByUrl('/perfil/perfil-colaborador');
      }
    } else if (button == 'historico') {
      this.router.navigateByUrl('/historico');
    }


  }

  async onClickOpcoes(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverOpcoesSharedComponent,
      componentProps: {
        parametrosLight: this.parametrosLight,
      },
      event: ev,
      cssClass: 'pop-over-class',
      translucent: true
    });
    return await popover.present();
  }

  async onClickHistorico(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverHistoricoSharedComponent,
      componentProps: {
        parametrosLight: this.parametrosLight,
        temAssinatura: this.temAssinatura
      },
      event: ev,
      cssClass: 'pop-over-class',
      translucent: true
    });
    return await popover.present();
  }

  async onClickRelatorios(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverRelatoriosSharedComponent,
      componentProps: {
        temAssinatura: this.temAssinatura
      },
      event: ev,
      cssClass: 'pop-over-class',
      translucent: true
    });
    return await popover.present();
  }

  validaPerfis() {
    if (this.userData.authenticatedUser.perfilColaborador === true && this.userData.authenticatedUser.perfilCliente === true
      || this.userData.authenticatedUser.perfilCliente === true && this.userData.authenticatedUser.perfilGerente === true
      || this.userData.authenticatedUser.perfilColaborador === true && this.userData.authenticatedUser.perfilGerente === true
      || this.userData.authenticatedUser.perfilColaborador === true && this.userData.authenticatedUser.perfilCliente === true
      && this.userData.authenticatedUser.perfilGerente) {
      this.validaPerfil = true;
    } else {
      this.validaPerfil = false;
    }
  }

  async logOut() {
    const alert = await this.alertController.create({
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
            this.onLogOuSuccsess();
          }
        }
      ]
    });

    await alert.present();
  }

  onLogOuSuccsess() {
    // armazena os dados de linguagem escolhida pelo usuário
    let lang = localStorage.getItem('one.lang');
    let rateData = localStorage.getItem('one.rate');
    let termosPolitica = localStorage.getItem('one.termosPolitica');
    let user = localStorage.getItem('one.user');
    var claims = localStorage.getItem('claims');
    localStorage.clear();
    if (!!claims) {
      localStorage.setItem('claims', claims);
    }
    localStorage.setItem('one.lang', lang);
    localStorage.setItem('one.user', user);
    localStorage.setItem('one.rate', rateData);
    localStorage.setItem('one.termosPolitica', termosPolitica);
    var url = window.location.origin;
    // eh necessario testar se esta em producao, pois a url precisa do nome do applicativo
    document.location.href = environment.production ? `${url}/${this.basehref}/login` : document.location.href = `${url}/login`;
  }

  private setaTelaAtiva() {
    this.active = this.router.url.slice(1);

    // A parte desse bloco que acende o menu caso assinatura esteja selecionada está assim por que a página assinatura está na rota relatorios/assinatura
    if (this.active.search('agenda') === 0) {
      this.active = 'agenda';
    } else if (this.active.search('perfil') === 0) {
      this.active = 'perfil';
    } else if (this.active.search('historico') === 0) {
      this.active = 'historico';
    } else if (this.active.search('financeiro') === 0) {
      this.active = 'historico';
    } else if (this.active.search('relatorios') === 0) {
      this.active = 'relatorios';
    } else if (this.active.search("assinaturas") === 11) {
      this.active = 'historico';
    }
  }

  getParametrosLight() {
    this.agendaService.getParametrosLight().subscribe(
      result => {
        this.parametrosLight = result
      },
      fail => {
      }
    )
  }

  verificaAssinatura() {
    this.perfilService.getClienteTemAssinatura().subscribe(
      result => {
        if (result == true) {
          this.temAssinatura = true;
        } else {
          this.temAssinatura = false;
        }
      },
      fail => {
        this.temAssinatura = false;
      }
    )
  }

}

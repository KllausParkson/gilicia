import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {InfosEmpresaModalComponent} from '../shared/infos-empresa-modal/infos-empresa-modal.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.page.html',
  styleUrls: ['./financeiro.page.scss'],
})
export class FinanceiroPage implements OnInit {
  public tipoLogin;
  public nomeEmpresaFilial: string;
  public nomeUsuario: string;
  public iOS: boolean;
  public title: string;
  private userData: any;

  constructor(public router: Router,
              private Translate: TranslateService,
              private modalController: ModalController) {
  }

  ngOnInit() {
    this.iOS = this.detectiOS();
    this.tipoLogin = localStorage.getItem('one.tipologin');
    this.tipoLogin = this.tipoLogin.charAt(0).toUpperCase() + this.tipoLogin.slice(1);
    this.userData = JSON.parse(localStorage.getItem('one.user'));
    this.nomeEmpresaFilial = this.userData.authenticatedBranch.nomeEmpresaFilial;
    this.nomeUsuario = this.userData.authenticatedUser.nomeUsuario;

    const url = window.location.href;

    if (url.search('comissao') !== -1) {
      this.title = this.Translate.instant('FINANCEIRO.RELATORIO.COMISSAO');
    } else if (url.search('faturamento') !== -1) {
      this.title = this.Translate.instant('FINANCEIRO.RELATORIO.FATURAMENTO');
    } else if (url.search('produtividade') !== -1) {
      this.title = this.Translate.instant('FINANCEIRO.RELATORIO.PRODUTIVIDADE');
    } else if (url.search('historico-cliente') !== -1) {
      this.title = this.Translate.instant('FINANCEIRO.RELATORIO.HISTORICO-CLIENTE');
    }
  }

  detectiOS() {
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)) {
      return true;
    } else {
      return false;
    }
  }

  async onClickInfosEmpresa() {
    const popover = await this.modalController.create({
      component: InfosEmpresaModalComponent,
      cssClass: 'infosEmpresa'
    });
    return await popover.present();
  }
}

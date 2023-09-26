import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InfosEmpresaModalComponent } from '../shared/infos-empresa-modal/infos-empresa-modal.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  public tipoLogin;
  private userData: any;
  public nomeEmpresaFilial: string;
  public nomeUsuario: string;
  public iOS: boolean;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.iOS = this.detectiOS();
    this.tipoLogin = localStorage.getItem('one.tipologin');
    this.tipoLogin = this.tipoLogin.charAt(0).toUpperCase() + this.tipoLogin.slice(1);
    this.userData = JSON.parse(localStorage.getItem('one.user'));
    this.nomeEmpresaFilial = this.userData.authenticatedBranch.nomeEmpresaFilial;
    this.nomeUsuario = this.userData.authenticatedUser.nomeUsuario;
  }

  detectiOS() {
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)) {
      return true;
    }
    else {
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

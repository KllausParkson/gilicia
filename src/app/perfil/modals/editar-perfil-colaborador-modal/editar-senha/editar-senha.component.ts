import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ToastService } from 'app/core/services/toast.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PerfilServiceService } from '../../../services/perfil-service.service';

@Component({
  selector: 'app-editar-senha',
  templateUrl: './editar-senha.component.html',
  styleUrls: ['./editar-senha.component.scss'],
})
export class EditarSenhaComponent implements OnInit {

  public showPassword = false;
  public showNewPassword = false;
  public showConfirmPassword = false;
  public senhaAntiga: string;
  public novaSenha: string;
  public confirmarSenha: string;
  public email: any;

  public gatilhoSenha: boolean;

  constructor(private modalController: ModalController,
    private navParams: NavParams,
    private toastService: ToastService,
    private Translate: TranslateService,
    private perfilService: PerfilServiceService,) {
    this.email = this.navParams.get('email');
  }

  ngOnInit() {
    this.getParametrosSenha();
  }

  closeModal() {
    this.modalController.dismiss(false);
  }

  changePasswordVisibility() {
    this.showPassword = !this.showPassword
  }
  changeNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword
  }
  changeConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword
  }

  alterarSenha() {
    if (this.gatilhoSenha) {
      this.senhaAntiga = "123456"
    }
    if (this.novaSenha !== this.confirmarSenha) {
      this.toastService.presentToast(this.Translate.instant('PERFIL.MODALEDITAR.SENHAINCOMPATIVEL'), 'danger');
    } else {
      this.perfilService.alteraSenhaInterno(this.email, this.senhaAntiga, this.novaSenha, this.confirmarSenha)
        .subscribe(
          result => {
            this.toastService.presentToast(this.Translate.instant('PERFIL.MODALEDITAR.SUCESSO'));
            let userData = JSON.parse(localStorage.getItem('one.user'));
            userData.authenticatedUser.hash = result.data;
            localStorage.setItem('one.user', JSON.stringify(userData));
            this.modalController.dismiss(true);
          },
          fail => {
            this.toastService.presentToast(this.Translate.instant('PERFIL.MODALEDITAR.SENHAINCORRETA'), 'danger');
          }
        )
    }
  }

  getParametrosSenha() {
    let userData = JSON.parse(localStorage.getItem('one.user'));
    if (userData.authenticatedUser.hash === "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92") {
      this.gatilhoSenha = true;
    }
    else {
      this.gatilhoSenha = false;
    }
  }

}

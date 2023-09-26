import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'app/core/services/toast.service';
import { environment } from 'environments/environment';
import { LoginService } from '../../services/login.service';
import { LoadingService } from '../../../core/services/loading.service';



@Component({
  selector: 'app-recuperar-senha-modal',
  templateUrl: './recuperar-senha-modal.component.html',
  styleUrls: ['./recuperar-senha-modal.component.scss'],
})
export class RecuperarSenhaModalComponent implements OnInit {

  public segment = 'email';

  public email: string;
  public codigo: string = "";
  public stringCodigo: string;
  public segmentNumber: number = 1;
  public validarCodigo = false;
  public validarSenha = false;
  public novaSenha: string;
  public confirmarSenha: string;
  public showPassword = false;
  public appId: any;

  constructor(private ModalController: ModalController,
    private LoginService: LoginService,
    private Toast: ToastService,
    private Translate: TranslateService,
    private LoadingService: LoadingService,
    public alertController: AlertController,) { }



  ngOnInit() {
    this.appId = localStorage.getItem('appId')
    this.codigo = null
  }

  closeModal() {
    this.ModalController.dismiss()
  }

  enviarEmail() {
    this.LoadingService.present();
    this.LoginService.enviarEmail(this.email, Number(this.appId))
      .subscribe(
        result => { this.onEnvioCodigoComplete(result) },
        fail => { this.LoadingService.dismiss(); this.onError(fail) }
      );
  }

  envioCodigoSucesso(fail: any) {
    this.LoadingService.dismiss();
    let button = document.getElementById('button')
    button.innerHTML = this.Translate.instant('LOGIN.MODARRECUPERARSENHA.VERIFICARCODIGO')
    this.Toast.presentToast(this.Translate.instant('LOGIN.ENVIADO'));
  }


  enviarCodigo() {
    this.LoadingService.present();
    this.LoginService.verificarCodigo(this.email, this.codigo)
      .subscribe(
        result => {
          this.LoadingService.dismiss();
          this.validarSenha = true;
          this.segment = "alterar";
        },
        fail => { this.LoadingService.dismiss(); this.onError(fail) }
      );
  }

  onEnvioCodigoComplete(fail: any) {
    this.LoadingService.dismiss();
    let button = document.getElementById('button')
    button.innerHTML = this.Translate.instant('LOGIN.MODARRECUPERARSENHA.ALTERARSENHA')
    this.Toast.presentToast(this.Translate.instant('LOGIN.ENVIADO'));
    this.validarCodigo = true;
    this.segment = "codigo";
  }

  verificarCodigoEmail() {
    this.LoadingService.present();
    this.LoginService.verificarCodigo(this.email, this.codigo)
      .subscribe(
        result => {
          this.LoadingService.dismiss();
          this.segment = "alterar"
        },
        fail => { this.LoadingService.dismiss(); this.onError(fail) }
      );
  }


  alterarSenha() {
    if (this.novaSenha !== this.confirmarSenha) {
      this.Toast.presentToast(this.Translate.instant('LOGIN.MODARRECUPERARSENHA.SENHAINCOMPATIVEL'), 'danger');
    } else {
      this.LoginService.alteraSenha(this.email, this.codigo, this.novaSenha, this.confirmarSenha)
        .subscribe(
          result => {
            this.Toast.presentToast(this.Translate.instant('LOGIN.SUCESSO'))
            this.closeModal()
          },
          fail => {
          }
        )
    }
  }

  changePasswordVisibility() {
    this.showPassword = !this.showPassword
  }

  retornoEnvioEmail(response: { email: string }): void {
    if (response != null) {
      this.email = response.email;
    }
  }

  retornoVerificaCodigo(response: { codigo: string }): void {
    if (response != null) {
      this.codigo = response.codigo;
    }
  }

  retornoAlteraSenha(response: { novaSenha: string, confirmarSenha: string }): void {
    this.novaSenha = response.novaSenha;
    this.confirmarSenha = response.confirmarSenha;
  }

  onError(fail: any) {
    this.Toast.presentToast(this.Translate.instant('LOGIN.ERROR'), 'danger');
  }


  changeSegment(segment: string) {
    this.segment = segment;

    switch (this.segment) {
      case "email": {
        this.segmentNumber = 1;
        this.validarCodigo = true;
        break;
      }
      case "codigo": {
        this.validarSenha = true;
        this.segmentNumber = 2;
        break;
      }
      case "alterar": {
        this.segmentNumber = 3;
        break;
      }
      default: {
        break;
      }
    }
  }
} 

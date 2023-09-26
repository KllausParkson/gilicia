import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ToastService } from 'app/core/services/toast.service';
import { EscolherEstabelecimentoModalComponent } from '../escolher-estabelecimento-modal/escolher-estabelecimento-modal.component';
import { LoginUsuarioModel } from '../../models/login-usuario-model';
@Component({
  selector: 'app-login-auxiliar',
  templateUrl: './login-auxiliar.component.html',
  styleUrls: ['./login-auxiliar.component.scss'],
})
export class LoginAuxiliarComponent implements OnInit {
  @Input() loginRes: LoginUsuarioModel;
  public email: string;
  public senha: string;
  public retorno: any;
  constructor(private ModalController: ModalController,
    private Toast: ToastService) { }

  ngOnInit() {
  }

  login() {
    this.onClickEscolherEstabelecimento()
  }

  async onClickEscolherEstabelecimento() {
    // this.Acesso = true;
    var email = this.email
    var senha = this.senha
    var flagHash = false;
    const modal = await this.ModalController.create({
      component: EscolherEstabelecimentoModalComponent,
      componentProps: {
        loginUsuario: this.loginRes,
        userLogin: { email, senha },
        flagHash
      },
    });

    modal.backdropDismiss = false;

    modal.onDidDismiss().then((retorno) => {
      if (retorno.data?.res) {
        this.retorno = retorno.data.res;
        this.closeModalRetornando();
      }
    });

    return await modal.present();
  }

  closeModal() {
    this.ModalController.dismiss()
  }

  closeModalRetornando() {
    setTimeout(() => {
      this.ModalController.dismiss({ res: this.retorno })
    }, 0
    )

  }
}

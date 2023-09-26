import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { TelefonePipe } from 'app/core/pipes/telefone.pipe';
import { LoadingService } from 'app/core/services/loading.service';
import { PerfilModel } from '../../models/perfil-model';
import { PerfilServiceService } from '../../services/perfil-service.service';
import { ToastService } from 'app/core/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from 'app/login/services/login.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-editar-perfil-modal',
  templateUrl: './editar-perfil-modal.component.html',
  styleUrls: ['./editar-perfil-modal.component.scss'],
})
export class EditarPerfilModalComponent implements OnInit {
  @Input() perfil: PerfilModel;

  public showPassword = false;
  public showNewPassword = false;
  public showConfirmPassword = false;
  public novaSenha: string;
  public senhaAntiga: string;
  public confirmarSenha: string;
  public perfilForm: FormGroup;
  public segment: string = 'editar';
  public visitanteLogin: any;

  public gatilhoSenha: boolean;
  public basehref: any;


  constructor(private formBuild: FormBuilder,
    private modalController: ModalController,
    private Telefone: TelefonePipe,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private Translate: TranslateService,
    private PerfilService: PerfilServiceService,
    public alertController: AlertController,
    private LoginService: LoginService) {
  }

  ngOnInit() {

    this.visitanteLogin = JSON.parse(localStorage.getItem('one.user')).authenticatedUser.email
    this.basehref = localStorage.getItem('basehref')
    this.getParametrosSenha();
    this.perfilForm = this.formBuild.group({
      nomeCompleto: new FormControl(this.perfil.nome, Validators.required),
      email: new FormControl(this.perfil.email),
      celular: new FormControl(this.perfil.celular),
      aniversario: new FormControl(new Date(this.perfil.aniversario)),
    });

  }

  closeModal() {
    this.modalController.dismiss();
  }

  async editar() {
    await this.loadingService.present();
    const perf: PerfilModel = {
      nome: this.perfilForm.controls['nomeCompleto'].value,
      email: this.perfilForm.controls['email'].value,
      celular: this.perfilForm.controls['celular'].value,
      aniversario: this.perfilForm.controls['aniversario'].value,
      curriculo: null,
      fotoUrl: null,
      profissaoId: null,
      instagram: null
    };

    this.PerfilService.editarPerfil(perf)
      .subscribe(
        res => {
          this.loadingService.dismiss();
          this.modalController.dismiss({ perfil: perf });
        },
        fail => {
          this.loadingService.dismiss();
        }
      );
  }

  setMask(ev: any) {
    this.perfilForm.controls['celular'].setValue(this.Telefone.transform(ev.target.value));
  }

  alterarSenha() {
    if (this.gatilhoSenha) {
      this.senhaAntiga = "123456"
    }
    if (this.novaSenha !== this.confirmarSenha) {
      this.toastService.presentToast(this.Translate.instant('PERFIL.MODALEDITAR.SENHAINCOMPATIVEL'), 'danger');
    } else {
      this.PerfilService.alteraSenhaInterno(this.perfil.email, this.senhaAntiga, this.novaSenha, this.confirmarSenha)
        .subscribe(
          result => {
            this.toastService.presentToast(this.Translate.instant('PERFIL.MODALEDITAR.SUCESSO'));
            let userData = JSON.parse(localStorage.getItem('one.user'));
            userData.authenticatedUser.hash = result.data;
            localStorage.setItem('one.user', JSON.stringify(userData));
            this.closeModal();
          },
          fail => {
            this.toastService.presentToast(this.Translate.instant('PERFIL.MODALEDITAR.SENHAINCORRETA'), 'danger');
          }
        );
    }
  }

  changePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  changeNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword
  }
  changeConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword
  }

  editarSenha() {
    this.segment = 'senha';
  }

  async excluirConta() {

    const alert = await this.alertController.create({
      header: this.Translate.instant('PERFIL.MODALEDITAR.EXCLUIRCONTA'),
      message: this.Translate.instant('PERFIL.MODALEDITAR.TEXTOEXCLUIRCONTA'),
      cssClass: 'textExclusao',
      buttons: [
        {
          text: this.Translate.instant('PERFIL.MODALEDITAR.CANCELAR'),
          role: 'cancel',
          cssClass: 'cancelButton',
          handler: (blah) => {
          }
        }, {
          text: this.Translate.instant('PERFIL.MODALEDITAR.EXCLUIRCONTA'),
          handler: () => {

            var user = JSON.parse(localStorage.getItem('one.user'))
            if (user.authenticatedUser.email == 'visitante@onebeleza.com.br') {
              this.onLogOuSuccsess();
            }
            else {
              this.LoginService.excluirConta().subscribe(result => {
                this.toastService.presentToast(this.Translate.instant('PERFIL.MODALEDITAR.CONTAEXCLUIDASUCESSO'));
                this.onLogOuSuccsess();
              },
                fail => {
                  this.toastService.presentToast(this.Translate.instant('PERFIL.MODALEDITAR.ERROEXCLUIRCONTA'), "danger");
                })
            }


          }
        }
      ],
      backdropDismiss: false,

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
  /* 
    async exibeNome(){
      const alert = await this.alertController.create({
        //header: servico ? this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.EXIBENOMEALERT.TITLE.SERVICO') : this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.EXIBENOMEALERT.TITLE.PRODUTO'),
        message: "Senha Padrão: 123456", /* Chave de tradução 
        cssClass: 'buttonCss',
        buttons: [
          {
            text: "Fechar", /* Chave de tradução 
            role: 'cancel',
            handler: (blah) => {
            }
          }
        ],
        backdropDismiss: false,
      });
      await alert.present();
    }
   */
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

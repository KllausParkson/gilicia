import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { LoadingService } from 'app/core/services/loading.service';
import { ToastService } from 'app/core/services/toast.service';
import { LoginService } from '../../services/login.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-senha-temporaria-modal',
  templateUrl: './senha-temporaria-modal.component.html',
  styleUrls: ['./senha-temporaria-modal.component.scss'],
})
export class SenhaTemporariaModalComponent implements OnInit {
  public showPassword = false
  public form: FormGroup;
  constructor(private modalController: ModalController,
              private LoginService: LoginService,
              private FormBuilder: FormBuilder,
              private Toast: ToastService,
              private loadingService: LoadingService,
              private Translate: TranslateService) { }

  ngOnInit() {
    this.form = this.FormBuilder.group({
      senhaAtual: new FormControl('', Validators.required),
      novaSenha: new FormControl('', Validators.required),
      confirmarSenha: new FormControl('', Validators.required)
    })
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async onCriarSenha() {
    if(this.form.controls['novaSenha'].value !== this.form.controls['confirmarSenha'].value) {
      this.Toast.presentToast(this.Translate.instant('LOGIN.SENHATEMPORARIA.SENHASDIFERENTES'), 'danger')
      return 
    }
    await this.loadingService.present()
    let body = {
      senhaAtual: this.form.controls['senhaAtual'].value,
      novaSenha: this.form.controls['novaSenha'].value,
      confirmarSenha: this.form.controls['confirmarSenha'].value
    }

    this.LoginService.alterarSenhaTemporaria(body)
      .subscribe(
        res => {
          this.loadingService.dismiss()
          this.Toast.presentToast(this.Translate.instant('LOGIN.SENHATEMPORARIA.SUCESSO'), 'success', 1500).then(() => {
            this.modalController.dismiss({didChange: true});
          });
        }
      );
  }

}

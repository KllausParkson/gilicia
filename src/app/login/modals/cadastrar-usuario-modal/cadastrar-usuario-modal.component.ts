import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmedValidator } from 'app/core/common/custom-validators/custom-validators';
import { TelefonePipe } from 'app/core/pipes/telefone.pipe';
import { LoadingService } from 'app/core/services/loading.service';
import { ToastService } from 'app/core/services/toast.service';
import { environment } from 'environments/environment';
import { NovaContaModel } from '../../models/nova-conta-model';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-cadastrar-usuario-modal',
  templateUrl: './cadastrar-usuario-modal.component.html',
  styleUrls: ['./cadastrar-usuario-modal.component.scss'],
})
export class CadastrarUsuarioModalComponent implements OnInit {

  public novaContaForm: FormGroup;

  private novaContaModel: NovaContaModel = new NovaContaModel();

  public bloqueiaCadastro = true;
  public showPassword = false;
  public validation_messages = {
    'confirmarSenha': [
      { type: 'required', message: 'LOGIN.VALIDATION.SENHADIFERENTE' }
    ],
  };
  constructor(private ModalController: ModalController,
    private FormBuilder: FormBuilder,
    private LoginService: LoginService,
    private ToastService: ToastService,
    private TelefonePipe: TelefonePipe,
    private LoadingService: LoadingService,
    private Translate: TranslateService) { }

  ngOnInit() {

    this.novaContaForm = this.FormBuilder.group({
      nomeCompleto: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      celular: new FormControl('', [Validators.required, Validators.minLength(11)]),
      aniversario: new FormControl(new Date()),
      senha: new FormControl('', [Validators.required]),
      confirmarSenha: new FormControl('', [Validators.required]),
    }, { validator: ConfirmedValidator('senha', 'confirmarSenha') })

    if (localStorage.getItem('appId') == '84') {
      this.novaContaForm.controls["aniversario"].setValidators([Validators.required])
    }

    this.onChanges()
  }

  closeModal() {
    this.ModalController.dismiss()
  }

  onChanges(): void {
    this.novaContaForm.valueChanges.subscribe(val => {

      this.liberaBotaoCadastro()
    })
  }

  checaSenhas() {
    let senha1 = this.novaContaForm.controls['senha'].value
    let senha2 = this.novaContaForm.controls['confirmarSenha'].value
    let result = senha1 === senha2 ? { igual: true } : { igual: false }

    return result
  }

  liberaBotaoCadastro(): void {
    this.bloqueiaCadastro = true

    if (this.novaContaForm.valid) {
      if (this.novaContaForm.controls.senha.valid && this.novaContaForm.controls.confirmarSenha.valid) {
        let res = this.checaSenhas()
        if (res.igual) {
          this.bloqueiaCadastro = false
        }
      }
    }
  }

  async onSubmit() {
    await this.LoadingService.present()

    this.novaContaModel.nomeCompleto = this.novaContaForm.controls.nomeCompleto.value
    this.novaContaModel.email = this.novaContaForm.controls.email.value
    this.novaContaModel.celular = this.novaContaForm.controls.celular.value
    this.novaContaModel.aniversario = new Date(this.novaContaForm.controls.aniversario.value)
    this.novaContaModel.senha = this.novaContaForm.controls.senha.value
    this.novaContaModel.confirmarSenha = this.novaContaForm.controls.confirmarSenha.value
    this.novaContaModel.appId = Number(localStorage.getItem('appId'));
    this.novaContaModel.basehref = localStorage.getItem("basehref");

    this.LoginService.cadastrarConta(this.novaContaModel)
      .subscribe(
        response => {
          this.LoadingService.dismiss()
          this.ToastService.presentToast(this.Translate.instant("LOGIN.DISABLED"), 'success')
          this.ModalController.dismiss()
        },
        fail => {
          this.LoadingService.dismiss()
          this.onError(fail.error)
        }
      )

  }

  onError(error: string) {
    if (error === 'API.OSECURITY.CADASTRARCONTA.EMAILEXIST') {
      this.ToastService.presentToast(this.Translate.instant('LOGIN.EMAILEXISTE'), 'danger', 5000, this.Translate.instant('LOGIN.ERRO'))
    } 
    else if (error === 'API.OSECURITY.CADASTRARCONTA.CELULARCADASTRADO') {
      this.ToastService.presentToast(this.Translate.instant('API.OSECURITY.CADASTRARCONTA.CELULARCADASTRADO'), 'danger', 5000, this.Translate.instant('LOGIN.ERRO'))
    }
    else {
      this.ToastService.presentToast(this.Translate.instant('LOGIN.ERRO'), 'danger')
    }
  }

  setTelefoneMask(event: any) {
    if (event.target.name === "celular") {
      this.novaContaForm.controls['celular'].setValue(this.TelefonePipe.transform(event.target.value))
    }

    if (event.target.name === "telefone") {
      this.novaContaForm.controls['telefone'].setValue(this.TelefonePipe.transform(event.target.value))
    }
  }

  changePasswordVisibility() {
    this.showPassword = !this.showPassword
  }

}

import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../core/services/loading.service';
import { LoginService } from '../services/login.service';
import { RecuperarContaModel } from '../models/recuperar-conta-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from 'app/core/common/custom-validators/custom-validators';

@Component({
  selector: 'app-recuperar-conta',
  templateUrl: './recuperar-conta.component.html',
  styleUrls: ['./recuperar-conta.component.scss'],
})
export class RecuperarContaComponent implements OnInit {

  public oneLogo = "https://oneproducao.blob.core.windows.net/one2/Imagens/One_Logo.png";
  
  public recuperarContaForm: FormGroup;

  public validation_messages = {
    'senha': [
      { type: 'required', message: 'LOGIN.VALIDATION.SENHADIFERENTE' }
    ]
  };

  constructor(private LoadingService: LoadingService,
              private LoginService: LoginService,
              private formBuilder: FormBuilder) { }

    public email: string;
    public codigo: string;
    public showPassword: boolean = false;
    public view: boolean | null = null;

  ngOnInit() {
    let urlString = window.location.href;
    let url = new URL(urlString);

    this.codigo = url.searchParams.get("codigo");
    this.email = url.searchParams.get("email");

    this.recuperarContaForm = this.formBuilder.group({
      senha: ["", [Validators.required]],
      confirmarSenha: ["", [Validators.required]],
    }, { validator: ConfirmedValidator('senha', 'confirmarSenha') })
  }

  changePasswordVisibility() {
    this.showPassword = !this.showPassword
  }

  recuperarConta(){
    let recuperarConta: RecuperarContaModel = {
      email: this.email,
      codigo: this.codigo,
      senha: this.recuperarContaForm.value.senha,
      confirmarSenha: this.recuperarContaForm.value.confirmarSenha
    };

    this.LoadingService.present()
    this.LoginService.recuperarConta(recuperarConta).subscribe(
      result =>{
        this.view = true;
        this.LoadingService.dismiss();
      },
      fail =>{
        this.view = false;
        this.LoadingService.dismiss();
      }
    )
  }
}
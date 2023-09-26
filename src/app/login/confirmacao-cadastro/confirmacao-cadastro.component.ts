import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../core/services/loading.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-confirmacao-cadastro',
  templateUrl: './confirmacao-cadastro.component.html',
  styleUrls: ['./confirmacao-cadastro.component.scss'],
})
export class ConfirmacaoCadastroComponent implements OnInit {

  public oneLogo = "https://oneproducao.blob.core.windows.net/one2/Imagens/One_Logo.png";
  
  constructor(private LoadingService: LoadingService,
              private LoginService: LoginService) { }

    public error: string;
    public success: any;
    public email: string;
    public codigo: string;

  ngOnInit() {
    let urlString = window.location.href;
    let url = new URL(urlString);

    this.codigo = url.searchParams.get("codigo");
    this.email = url.searchParams.get("email");

    this.ativarConta(this.codigo, this.email);
  }

  ativarConta(codigo: string, email: string){
    this.LoadingService.present()
    this.LoginService.ativarConta(codigo, email).subscribe(
      result =>{
        this.success = result;
        this.LoadingService.dismiss()
      },
      fail =>{
        this.error = fail;
        this.LoadingService.dismiss()
      }
    )
  }
}
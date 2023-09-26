import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../core/services/loading.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-cancelar-inscricao',
  templateUrl: './cancelar-inscricao.component.html',
  styleUrls: ['./cancelar-inscricao.component.scss'],
})
export class CancelarInscricaoComponent implements OnInit {

  public oneLogo = "https://oneproducao.blob.core.windows.net/one2/Imagens/One_Logo.png";
  
  constructor(private LoadingService: LoadingService,
              private LoginService: LoginService) { }

    public error: string;
    public success: any;
    public email: string;

  ngOnInit() {
    let urlString = window.location.href;
    let url = new URL(urlString);

    this.email = url.searchParams.get("email");

    this.cancelarInscricao(this.email);
  }

  cancelarInscricao(email: string){
    this.LoadingService.present()
    this.LoginService.cancelarInscricao(email).subscribe(
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
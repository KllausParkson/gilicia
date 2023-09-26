import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-escolher-perfil',
  templateUrl: './escolher-perfil.component.html',
  styleUrls: ['./escolher-perfil.component.scss'],
})
export class EscolherPerfilComponent implements OnInit {
  private name: string;
  public oneLogo = "https://oneproducao.blob.core.windows.net/one2/Imagens/One_Logo_App.png";
  public backgroundArmazenado: any;
  public perfis: any;
  public cardHeight: string;
  public background: any = 'https://oneproducao.blob.core.windows.net/one2/Imagens/One_App_Background.png';
  //public userData: any;
  public basehref: any;
  constructor(private Router: Router) { }

  ngOnInit() {
    this.basehref = localStorage.getItem('basehref')
    this.name = environment.name
    //this.userData = JSON.parse(localStorage.getItem('one.user'))
    this.backgroundArmazenado = JSON.parse(localStorage.getItem('one.user')).authenticatedBranch.background
    this.perfis = JSON.parse(localStorage.getItem('one.user')).authenticatedUser
    this.cardHeight = (window.innerHeight - 20) + "px";
  }

  agendaCliente() {
    var url = window.location.origin;
    //eh necessario testar se esta em producao, pois a url precisa do nome do applicativo
    document.location.href = environment.production ? `${url}/${this.basehref}/agenda/agenda-cliente` : `${url}/agenda/agenda-cliente`
    //this.Router.navigate(['/agenda/agenda-cliente'])
    localStorage.setItem('one.tipologin', 'cliente')
  }

  agendaProfissional() {
    var url = window.location.origin;
    //eh necessario testar se esta em producao, pois a url precisa do nome do applicativo
    document.location.href = environment.production ? `${url}/${this.basehref}/agenda/agenda-profissional` : `${url}/agenda/agenda-profissional`
    //this.Router.navigate(['/agenda/agenda-profissional'])
    localStorage.setItem('one.tipologin', 'colaborador')
  }

  agendaGestor() {
    var url = window.location.origin;
    //eh necessario testar se esta em producao, pois a url precisa do nome do applicativo
    document.location.href = environment.production ? `${url}/${this.basehref}/agenda/agenda-gestor` : `${url}/agenda/agenda-gestor`
    //this.Router.navigate(['/agenda/agenda-gestor'])
    localStorage.setItem('one.tipologin', 'gestor')
  }

}

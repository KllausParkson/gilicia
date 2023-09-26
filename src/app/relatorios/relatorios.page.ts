import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { InfosEmpresaModalComponent } from '../shared/infos-empresa-modal/infos-empresa-modal.component';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.page.html',
  styleUrls: ['./relatorios.page.scss'],
})
export class RelatoriosPage implements OnInit {
  public tipoLogin: string;
  private userData: any;
  public nomeEmpresaFilial: string;
  public nomeUsuario: string;
  public title: string;
  public iOS : boolean;
  
  constructor(private Translate: TranslateService,
              private ModalController: ModalController) { }

  ngOnInit() {
    this.iOS = this.detectiOS();
    this.tipoLogin = localStorage.getItem('one.tipologin')
    this.tipoLogin = this.tipoLogin.charAt(0).toUpperCase() + this.tipoLogin.slice(1)
    this.userData = JSON.parse(localStorage.getItem('one.user'))
    this.nomeEmpresaFilial = this.userData.authenticatedBranch.nomeEmpresaFilial
    this.nomeUsuario = this.userData.authenticatedUser.nomeUsuario
    /**
     * Serve para mostrar o titulo correto no cabecalho 
     * da pagina, procurando por uma substring na url
     */
    var url = window.location.href
    
    if(url.search('receitas-apuradas') != -1) {
      this.title = this.Translate.instant("RELATORIOS.TITLE.RECEITASAPURADAS")
    } else if(url.search('clientes') != -1){
      this.title = this.Translate.instant("RELATORIOS.TITLE.CLIENTES")
    } else if(url.search('receitas-estimadas') != -1) {
      this.title = this.Translate.instant("RELATORIOS.TITLE.RECEITASESTIMADAS")
    } else if(url.search('produtos') != -1) {
      this.title = this.Translate.instant("RELATORIOS.TITLE.PRODUTOS")
    } else if(url.search('servicos') != -1) {
      this.title = this.Translate.instant("RELATORIOS.TITLE.SERVICOS")
    } else if(url.search('faturamento') != -1) {
      this.title = this.Translate.instant("RELATORIOS.TITLE.FATURAMENTO")
    } else if(url.search('resumo-chatbot') != -1) {
      this.title = this.Translate.instant("RELATORIOS.TITLE.RESUMOCHATBOT")
    } else if(url.search('lucratividade') != -1) {
      if(url.search('geral') != -1) {
        this.title =  this.Translate.instant("RELATORIOS.TITLE.LUCRATIVIDADEGERAL")

      } else {
        this.title =  this.Translate.instant("RELATORIOS.TITLE.RANKINGLUCRATIVIDADE")

      }
    } else if(url.search('avaliacoes') != -1) {
      this.title =  this.Translate.instant("RELATORIOS.TITLE.AVALIACOES")
    } else if (url.search('assinaturas') != -1) {
      this.title = "Assinaturas" // PRECISA TRADUÇÃO
    }

  }

  detectiOS()
  {
    if( navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) )
      return true;
    else 
      return false;
  }


  async onClickInfosEmpresa() {
    const popover = await this.ModalController.create({
      component: InfosEmpresaModalComponent,
      cssClass: 'infosEmpresa'});
    return await popover.present();
  }

}

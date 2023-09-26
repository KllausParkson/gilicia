import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoadingService } from 'app/core/services/loading.service';
import { SharedService } from '../services/shared.service';
@Component({
  selector: 'app-infos-empresa-modal',
  templateUrl: './infos-empresa-modal.component.html',
  styleUrls: ['./infos-empresa-modal.component.scss'],
})
export class InfosEmpresaModalComponent implements OnInit {

  private userData: any;
  public logo: string;
  public nomeEmpresaFilial: string;
  public endereco: string;
  public numero: string;
  public bairro: string;
  public cidade: string;
  public estado: string;
  public telefone: string;
  public cep: string;
  public basehref: any;
  public urlMap: string = null;
  public semLogo = 'https://oneproducao.blob.core.windows.net/one2/Imagens/One_Logo.png';


  constructor(private modalController: ModalController,
              private sharedService: SharedService,
              private loadingService: LoadingService) { }

  ngOnInit() {
    this.basehref = localStorage.getItem('basehref')
    this.userData = JSON.parse(localStorage.getItem('one.user'));
    this.logo = this.userData.authenticatedBranch.logoMarca;
    this.loadingService.present();
    this.sharedService.getDadosEmpresa()
      .subscribe(
        res => {
          this.nomeEmpresaFilial = res.nomeEmpresaFilial;
          this.endereco = res.endereco;
          this.numero = res.numero;
          this.bairro = res.bairro;
          this.cidade = res.cidade;
          this.estado = res.estado;
          this.cep = res.cep;
          this.telefone = res.telefone;
          this.urlGoogleMaps(res.latitude, res.longitude);
          this.loadingService.dismiss();
        }
      );
  }

  urlGoogleMaps(latitude: string, longitude: string){
    let lang = 'pt';
    let country = 'br';

    if (localStorage.getItem('one.lang') !== '' && localStorage.getItem('one.lang') !== undefined){
      let userLang = localStorage.getItem('one.lang') != "" && localStorage.getItem('one.lang') != undefined 
              && localStorage.getItem('one.lang') != null && localStorage.getItem('one.lang') != "null"
              ? localStorage.getItem('one.lang') 
              : JSON.parse(localStorage.getItem('one.user')).authenticatedBranch.linguaPais;
      userLang = userLang.split('-');

      if (userLang[0]?.length !== 0){
        lang = userLang[0];
      }

      if (userLang[1]?.length !== 0){
        country = userLang[1];
      }
    }

    this.urlMap = 'https://www.google.com/maps/embed/v1/search?key=' + 'AIzaSyDL9hPZKe_Mj6nVn6I6F557xhLz9_kELvs' + '&region=' +
    country + '&q=' + latitude + ',' + longitude + '&language=' + lang;
  }

  closeModal() {
    this.modalController.dismiss();
  }
}

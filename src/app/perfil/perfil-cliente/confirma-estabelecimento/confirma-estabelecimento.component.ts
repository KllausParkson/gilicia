import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirma-estabelecimento',
  templateUrl: './confirma-estabelecimento.component.html',
  styleUrls: ['./confirma-estabelecimento.component.scss'],
})
export class ConfirmaEstabelecimentoComponent implements OnInit {
  public empresa: any;
  public semLogo = 'https://oneproducao.blob.core.windows.net/one2/Imagens/One_Logo.png';
  constructor(private navParams: NavParams,
    private modalController: ModalController) {
    this.empresa = this.navParams.get('empresa');
  }

  ngOnInit() {
  }
  confirma() {
    this.modalController.dismiss(true);
  }

  closeModal() {
    this.modalController.dismiss(false);
  }
}

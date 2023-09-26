import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {TelefonePipe} from 'app/core/pipes/telefone.pipe';
import {environment} from 'environments/environment';
import {PoliticaPrivacidadeModalComponent} from '../politica-privacidade-modal/politica-privacidade-modal.component';
import {TermosCondicaoModalComponent} from '../termos-condicao-modal/termos-condicao-modal.component';

@Component({
  selector: 'app-saiba-mais-modal',
  templateUrl: './saiba-mais-modal.component.html',
  styleUrls: ['./saiba-mais-modal.component.scss'],
})

export class SaibaMaisModalComponent implements OnInit {

  public mostraPolitica = false;
  public mostraCondicao = false;
  public telefone1 = '31 9 84816695';
  public telefone2 = '31 9 84186722';

  constructor(private modalController: ModalController,
              private Translate: TranslateService,
              private telefonePipe: TelefonePipe) {
  }

  public version: string = environment.version;


  ngOnInit() {

    this.telefone1 = this.telefonePipe.transform(this.telefone1);
    this.telefone2 = this.telefonePipe.transform(this.telefone2);
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async exibePolitica() {
    const modal = await this.modalController.create({
      component: PoliticaPrivacidadeModalComponent
    });
    modal.backdropDismiss = false; // impedir que feche no click fora

    return await modal.present();
  }

  async exibeTermos() {
    const modal = await this.modalController.create({
      component: TermosCondicaoModalComponent
    });
    modal.backdropDismiss = false; // impedir que feche no click fora

    return await modal.present();
  }

}

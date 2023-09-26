import { Component, HostListener, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PoliticaPrivacidadeModalComponent } from '../politica-privacidade-modal/politica-privacidade-modal.component';
import { TermosCondicaoModalComponent } from '../termos-condicao-modal/termos-condicao-modal.component';


@Component({
  selector: 'app-saiba-mais-modal',
  templateUrl: './popup-termos-politica-modal.component.html',
  styleUrls: ['popup-termos-politica-modal.component.scss'],
})
@HostListener('scroll', ['$event'])




export class PopupTermosPoliticaModalComponent implements OnInit {

  public chaveController: boolean;//recebe chaveController do Login para controlar a tradução em caso de perfil unico
  public screenHeight: number;
  public screenWidth: number;
  public addAppointmentButtonHeight: any;


  constructor(private modalController: ModalController,
    private Translate: TranslateService,
    private eleRef: ElementRef,
  ) { }


  ngOnInit() {
  }
  closeModal() {
    this.modalController.dismiss();
  }

  async exibePolitica() {
    const modal = await this.modalController.create({
      component: PoliticaPrivacidadeModalComponent
    })
    modal.backdropDismiss = false;//impedir que feche no click fora

    return await modal.present()
  }
  async exibeTermos() {
    const modal = await this.modalController.create({
      component: TermosCondicaoModalComponent
    })
    modal.backdropDismiss = false;//impedir que feche no click fora

    return await modal.present()
  }

}

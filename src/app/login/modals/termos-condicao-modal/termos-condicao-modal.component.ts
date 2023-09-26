import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from 'app/core/services/loading.service';
import { environment } from 'environments/environment';


@Component({
  selector: 'app-saiba-mais-modal',
  templateUrl: './termos-condicao-modal.component.html',
  styleUrls: ['termos-condicao-modal.component.scss'],
})

export class TermosCondicaoModalComponent implements OnInit {
  public termCondition: string = "";


  public mostraPolitica = false;
  public mostraCondicao = false;
  public fechaModal = false;

  disableBtn: boolean = true;
  top: number;
  offSetHeight: number;
  scrollHeight: number;


  constructor(private modalController: ModalController,
    private Translate: TranslateService,
    private eleRef: ElementRef,) { }

  ngOnInit() {
    this.termCondition = this.Translate.instant('LOGIN.SAIBAMAIS.MODAL.TERMOCODICAO.CONTRATO').replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  closeModal() {
    this.modalController.dismiss();
  }
  @HostListener('scroll') onScrollEvent(event: Event) {
    this.top = this.eleRef.nativeElement.scrollTop;
    this.offSetHeight = this.eleRef.nativeElement.offsetHeight;
    this.scrollHeight = this.eleRef.nativeElement.scrollHeight;
    if (this.top === 0) {
      this.disableBtn = true;
    }
    if (this.top > this.scrollHeight - this.offSetHeight - 1) {
      this.disableBtn = false;
    }
  }
}
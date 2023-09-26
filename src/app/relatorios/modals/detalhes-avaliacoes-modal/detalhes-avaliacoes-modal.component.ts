import {Component, HostListener, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-detalhes-avaliacoes-modal',
  templateUrl: './detalhes-avaliacoes-modal.component.html',
  styleUrls: ['./detalhes-avaliacoes-modal.component.scss'],
})
export class DetalhesAvaliacoesModalComponent implements OnInit {

  @Input() detalhes: any;
  public title: string;

  public innerHeight: any;
  public divContentHeight: any;

  constructor(private modalController: ModalController) {
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.innerHeight = window.innerHeight;
    this.divContentHeight = innerHeight - 200;
    this.divContentHeight = this.divContentHeight.toString() + 'px';
  }

  ngOnInit() {
    this.getScreenSize();
    this.title = this.detalhes.nomeProfissional;
    this.setStars(this.detalhes.mediaGeral);
  }

  closeModal() {
    this.modalController.dismiss();
  }

  setStars(nota: number, index?: number) {
    const stars = [];
    if (index == null) {
      for (let i = 1; i <= 5; i++) {
        stars.push(document.getElementById('modal-star' + i));
      }
    } else {
      for (let i = 1; i <= 5; i++) {
        stars.push(document.getElementById(`${index}star` + i));
      }
    }

    for (let i = 0; i < 5; i++) {
      stars[i].setAttribute('name', 'star-outline');
    }

    for (let i = 0; i < nota; i++) {
      stars[i].setAttribute('name', 'star');
    }

    if (nota < 5) {
      const numeroVazias = Math.floor(5 - nota);
      for (let i = 0; i < numeroVazias; i++) {
        stars[nota + 1].setAttribute('name', 'star-outline');
      }
    }

    if (!Number.isInteger(nota) && nota > 0.1 && nota < 5) {
      stars[5 - (5 - Math.floor(nota))].setAttribute('name', 'star-half');
    }

    // if (nota >= 5) {
    //   // todas as estrelas cheias
    //   stars[0].setAttribute('name', 'star');
    //   stars[1].setAttribute('name', 'star');
    //   stars[2].setAttribute('name', 'star');
    //   stars[3].setAttribute('name', 'star');
    //   stars[4].setAttribute('name', 'star');
    // } else if (nota > 4 && nota < 5) {
    //   // 4 estrelas cheias e 1 meia estrela
    //   stars[0].setAttribute('name', 'star');
    //   stars[1].setAttribute('name', 'star');
    //   stars[2].setAttribute('name', 'star');
    //   stars[3].setAttribute('name', 'star');
    //   stars[4].setAttribute('name', 'star-half');
    // } else if (nota === 4) {
    //   // 4 estrelas cheias e 1 estrela vazia
    //   stars[0].setAttribute('name', 'star');
    //   stars[1].setAttribute('name', 'star');
    //   stars[2].setAttribute('name', 'star');
    //   stars[3].setAttribute('name', 'star');
    //   stars[4].setAttribute('name', 'star-outline');
    // } else if (nota > 3 && nota < 4) {
    //   // 3 estrelas cheias 1 meias estrela e 1 estrela vazia
    //   stars[0].setAttribute('name', 'star');
    //   stars[1].setAttribute('name', 'star');
    //   stars[2].setAttribute('name', 'star');
    //   stars[3].setAttribute('name', 'star-half');
    //   stars[4].setAttribute('name', 'star-outline');
    // } else if (nota === 3) {
    //   // 3 estrelas e 2 estrelas vazias
    //   stars[0].setAttribute('name', 'star');
    //   stars[1].setAttribute('name', 'star');
    //   stars[2].setAttribute('name', 'star');
    //   stars[3].setAttribute('name', 'star-outline');
    //   stars[4].setAttribute('name', 'star-outline');
    // } else if (nota > 2 && nota < 3) {
    //   // 2 estrelas cheias 1 meias estrela e 2 estrela vazia
    //   stars[0].setAttribute('name', 'star');
    //   stars[1].setAttribute('name', 'star');
    //   stars[2].setAttribute('name', 'star-half');
    //   stars[3].setAttribute('name', 'star-outline');
    //   stars[4].setAttribute('name', 'star-outline');
    // } else if (nota === 2) {
    //   // 2 estrelas e 3 estrelas vazias
    //   stars[0].setAttribute('name', 'star');
    //   stars[1].setAttribute('name', 'star');
    //   stars[2].setAttribute('name', 'star-outline');
    //   stars[3].setAttribute('name', 'star-outline');
    //   stars[4].setAttribute('name', 'star-outline');
    // } else if (nota > 1 && nota < 2) {
    //   // 1 estrelas cheias 1 meias estrela e 3 estrela vazia
    //   stars[0].setAttribute('name', 'star');
    //   stars[1].setAttribute('name', 'star-half');
    //   stars[2].setAttribute('name', 'star-outline');
    //   stars[3].setAttribute('name', 'star-outline');
    //   stars[4].setAttribute('name', 'star-outline');
    // } else if (nota === 1) {
    //   // 1 estrelas e 4 estrelas vazias
    //   stars[0].setAttribute('name', 'star');
    //   stars[1].setAttribute('name', 'star-outline');
    //   stars[2].setAttribute('name', 'star-outline');
    //   stars[3].setAttribute('name', 'star-outline');
    //   stars[4].setAttribute('name', 'star-outline');
    // } else {
    //   // apenas estrelas vazias
    //
    //   stars[0].setAttribute('name', 'star-outline');
    //   stars[1].setAttribute('name', 'star-outline');
    //   stars[2].setAttribute('name', 'star-outline');
    //   stars[3].setAttribute('name', 'star-outline');
    //   stars[4].setAttribute('name', 'star-outline');
    // }
  }
}

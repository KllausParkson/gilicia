import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DateUtils } from 'app/core/common/data-type-utils/date-utils';
import { PerfilServiceService } from '../../services/perfil-service.service';
import { LoadingService } from 'app/core/services/loading.service';
import { FiltrarAvaliacoesComponent } from '../filtrar-avaliacoes/filtrar-avaliacoes.component';
import { addYears } from '@progress/kendo-date-math';

@Component({
  selector: 'app-avaliacoes-modal',
  templateUrl: './avaliacoes-modal.component.html',
  styleUrls: ['./avaliacoes-modal.component.scss'],
})
export class AvaliacoesModalComponent implements OnInit {
  constructor(private PerfilService: PerfilServiceService,
    private modalController: ModalController,
    private loadingService: LoadingService) { }

  public overlayDivControl: boolean = false;

  @Input() avaliacoes: any;

  @Input() dataInicial: Date;
  @Input() dataFinal: Date;

  public comments_only: boolean = false;
  public min_grade: number = 1;
  public max_grade: number = 5;

  public statusAvaliacao = [
    'Muito satisfeito',
    'Satisfeito',
    'Regular',
    'Insatisfeito',
    'Muito Insatisfeito'
  ];

  ngOnInit() {

    let stars = []
    stars.push(document.getElementById('modal-star1'))
    stars.push(document.getElementById('modal-star2'))
    stars.push(document.getElementById('modal-star3'))
    stars.push(document.getElementById('modal-star4'))
    stars.push(document.getElementById('modal-star5'))

    this.setStars(this.avaliacoes.mediaGeral, stars)


  }

  closeModal() {
    this.modalController.dismiss();
  }

  setStars(nota: number, stars: any[]) {

    if (nota >= 5) {
      // todas as estrelas cheias
      stars[0].setAttribute('name', 'star');
      stars[1].setAttribute('name', 'star');
      stars[2].setAttribute('name', 'star');
      stars[3].setAttribute('name', 'star');
      stars[4].setAttribute('name', 'star');
    } else if (nota > 4 && nota < 5) {
      // 4 estrelas cheias e 1 meia estrela
      stars[0].setAttribute('name', 'star');
      stars[1].setAttribute('name', 'star');
      stars[2].setAttribute('name', 'star');
      stars[3].setAttribute('name', 'star');
      stars[4].setAttribute('name', 'star-half');
    } else if (nota == 4) {
      // 4 estrelas cheias e 1 estrela vazia
      stars[0].setAttribute('name', 'star');
      stars[1].setAttribute('name', 'star');
      stars[2].setAttribute('name', 'star');
      stars[3].setAttribute('name', 'star');
      stars[4].setAttribute('name', 'star-outline');
    } else if (nota > 3 && nota < 4) {
      // 3 estrelas cheias 1 meias estrela e 1 estrela vazia
      stars[0].setAttribute('name', 'star');
      stars[1].setAttribute('name', 'star');
      stars[2].setAttribute('name', 'star');
      stars[3].setAttribute('name', 'star-half');
      stars[4].setAttribute('name', 'star-outline');
    } else if (nota == 3) {
      // 3 estrelas e 2 estrelas vazias
      stars[0].setAttribute('name', 'star');
      stars[1].setAttribute('name', 'star');
      stars[2].setAttribute('name', 'star');
      stars[3].setAttribute('name', 'star-outline');
      stars[4].setAttribute('name', 'star-outline');
    } else if (nota > 2 && nota < 3) {
      // 2 estrelas cheias 1 meias estrela e 2 estrela vazia
      stars[0].setAttribute('name', 'star');
      stars[1].setAttribute('name', 'star');
      stars[2].setAttribute('name', 'star-half');
      stars[3].setAttribute('name', 'star-outline');
      stars[4].setAttribute('name', 'star-outline');
    } else if (nota == 2) {
      // 2 estrelas e 3 estrelas vazias
      stars[0].setAttribute('name', 'star');
      stars[1].setAttribute('name', 'star');
      stars[2].setAttribute('name', 'star-outline');
      stars[3].setAttribute('name', 'star-outline');
      stars[4].setAttribute('name', 'star-outline');
    } else if (nota > 1 && nota < 2) {
      // 1 estrelas cheias 1 meias estrela e 3 estrela vazia
      stars[0].setAttribute('name', 'star');
      stars[1].setAttribute('name', 'star-half');
      stars[2].setAttribute('name', 'star-outline');
      stars[3].setAttribute('name', 'star-outline');
      stars[4].setAttribute('name', 'star-outline');
    } else if (nota == 1) {
      // 1 estrelas e 4 estrelas vazias
      stars[0].setAttribute('name', 'star');
      stars[1].setAttribute('name', 'star-outline');
      stars[2].setAttribute('name', 'star-outline');
      stars[3].setAttribute('name', 'star-outline');
      stars[4].setAttribute('name', 'star-outline');
    } else {
      // apenas estrelas vazias

      stars[0].setAttribute('name', 'star-outline');
      stars[1].setAttribute('name', 'star-outline');
      stars[2].setAttribute('name', 'star-outline');
      stars[3].setAttribute('name', 'star-outline');
      stars[4].setAttribute('name', 'star-outline');
    }
  }

  getStatus(nota: number, clienteId: number) {
    const stars = [];
    stars.push(document.getElementById(clienteId + 'star1'));
    stars.push(document.getElementById(clienteId + 'star2'));
    stars.push(document.getElementById(clienteId + 'star3'));
    stars.push(document.getElementById(clienteId + 'star4'));
    stars.push(document.getElementById(clienteId + 'star5'));
    if (!stars.includes(null)) {
      this.setStars(nota, stars);
    }
  }

  getFileName(nota: number): string {
    if (nota >= 5) {
      return "https://onebelezamobile.azurewebsites.net/img/muito-satisfeito.png";
    } else if (nota < 5 && nota >= 4) {
      return "https://onebelezamobile.azurewebsites.net/img/satisfeito.png";
    } else if (nota >= 3 && nota < 4) {
      return "https://onebelezamobile.azurewebsites.net/img/regular.png";
    } else if (nota > 1 && nota < 3) {
      return "https://onebelezamobile.azurewebsites.net/img/pouco-satisfeito.png";
    } else if (nota <= 1) {
      return "https://onebelezamobile.azurewebsites.net/img/insatisfeito.png";
    }
  }

  async receiveDate(dataInicial, dataFinal) {
    await this.loadingService.present();
    if (dataInicial != this.dataInicial || dataFinal != this.dataFinal) {

      this.dataInicial = dataInicial;
      this.dataFinal = dataFinal;

      this.PerfilService.getAvaliacaoColaborador(DateUtils.DateToString(this.dataInicial), DateUtils.DateToString(this.dataFinal))
        .subscribe(
          res => {
            this.avaliacoes = res;
            const stars = [];
            stars.push(document.getElementById('modal-star1'));
            stars.push(document.getElementById('modal-star2'));
            stars.push(document.getElementById('modal-star3'));
            stars.push(document.getElementById('modal-star4'));
            stars.push(document.getElementById('modal-star5'));

            this.setStars(this.avaliacoes.mediaGeral, stars)

            this.loadingService.dismiss();
          },
          fail => {
            this.loadingService.dismiss();
          }
        );

    }

  }

  //chama funcao filtro de avaliacoes
  async onClickFiltro() {
    this.overlayDivControl = true;
    const modal = await this.modalController.create({
      component: FiltrarAvaliacoesComponent,
      cssClass: "filtroModal"
    });

    /*para mostrar todos por padrao, datas inicial e final em perfil-colaborador sao,
     respectivamente, 01-01-2010 e dia de hoje*/
    modal.onDidDismiss().then(res => {
      this.overlayDivControl = false;
      if (res.data) {
        this.comments_only = res.data.com_only;
        this.min_grade = res.data.min_grad;
        this.max_grade = res.data.max_grad;
        this.receiveDate(res.data.init, res.data.fin);
      }
    })

    return await modal.present();

  }

  async onClickLimparFiltro() {
    this.comments_only = false
    this.min_grade = 1
    this.max_grade = 5
    this.receiveDate(addYears(new Date(), -10), new Date());
  }

}

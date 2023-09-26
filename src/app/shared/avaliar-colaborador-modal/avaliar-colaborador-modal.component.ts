import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoadingService } from 'app/core/services/loading.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-avaliar-colaborador-modal',
  templateUrl: './avaliar-colaborador-modal.component.html',
  styleUrls: ['./avaliar-colaborador-modal.component.scss'],
})
export class AvaliarColaboradorModalComponent implements OnInit {
  @Input() servicos: any[];

  public avaliacao = [];

  public empresa: string;

  constructor(private modalController: ModalController,
    private sharedService: SharedService,
    private loadingService: LoadingService) {
  }

  ngOnInit() {
    this.empresa = JSON.parse(localStorage.getItem('one.user')).authenticatedBranch.nomeEmpresaFilial;
    this.createAvaliacoesList();
  }

  closeModal() {
    this.modalController.dismiss();
  }

  createAvaliacoesList() {
    const labelId = this.servicos[0].labelId;

    this.servicos.forEach(serv => {
      this.avaliacao.push({
        labelId: labelId,
        label: serv.label,
        nota: '5',
        comentario: null
      });
    });

  }

  onClickNota(ev: any, servico: any, nota: string) {
    let inputs = [];
    inputs.push(document.getElementById(`star1_${servico.id}`));
    inputs.push(document.getElementById(`star2_${servico.id}`));
    inputs.push(document.getElementById(`star3_${servico.id}`));
    inputs.push(document.getElementById(`star4_${servico.id}`));
    inputs.push(document.getElementById(`star5_${servico.id}`));

    inputs.forEach((el, index) => {

      if (index < Number(nota)) {

        el.setAttribute('name', 'star');
      } else {
        el.setAttribute('name', 'star-outline');
      }
    });

    this.avaliacao[Number(servico.id)].nota = nota;
  }

  async onClickAvaliar() {
    await this.loadingService.present();
    this.sharedService.adicionarAvaliacao(this.avaliacao)
      .subscribe(
        res => {
          this.loadingService.dismiss();
          this.modalController.dismiss();
        },
        fail => {
          this.loadingService.dismiss();
        }
      );
  }

  onClickComente(id: number) {

    this.avaliacao[id].comentario = '';
  }

  onChangeTextArea(id: number, ev: any) {
    this.avaliacao[id].comentario = ev.target.value;
  }
}

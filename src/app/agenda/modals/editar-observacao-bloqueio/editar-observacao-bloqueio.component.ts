import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToastService } from 'app/core/services/toast.service';
import { ProfissionalBloqueioLigthModel } from '../../models/profissionalBloqueioModel';
import { AgendaService } from '../../services/agenda.service';

@Component({
  selector: 'app-editar-observacao-bloqueio',
  templateUrl: './editar-observacao-bloqueio.component.html',
  styleUrls: ['./editar-observacao-bloqueio.component.scss'],
})
export class EditarObservacaoBloqueioComponent implements OnInit {

  public observacao: string;
  public agendaId: number;
  public observacaoInicial: string;

  constructor(private modalController: ModalController,
              private agendaService: AgendaService,
              private toastService: ToastService) { }

  ngOnInit() {
    this.observacaoInicial = this.observacao;
  }

  closeModal() {
    this.modalController.dismiss();
  }

  editarBloqueio(){
    const bloqueioModel = new ProfissionalBloqueioLigthModel();

    bloqueioModel.agendaId = this.agendaId;
    bloqueioModel.observacao = this.observacao;

    this.agendaService.editarObsBloqueio(bloqueioModel).subscribe(
      result => {
        this.toastService.presentToast('Sucesso!');
        this.modalController.dismiss(bloqueioModel);
      },
      fail => {
        this.toastService.presentToast('Erro!', 'danger');
      }
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AgendaService } from '../../services/agenda.service';
import { LoadingService } from '../../../core/services/loading.service';
import { EditarObservacaoBloqueioComponent } from '../editar-observacao-bloqueio/editar-observacao-bloqueio.component';

@Component({
  selector: 'app-opcoes-bloqueio',
  templateUrl: './opcoes-bloqueio.component.html',
  styleUrls: ['./opcoes-bloqueio.component.scss'],
})
export class OpcoesBloqueioComponent implements OnInit {

  public dadosAgendamento: any;
  public parametrosLight: any;
  public tipoLogin: any;
  public claims;
  public claims_Agenda;

  constructor(private modalcontroller: ModalController,
    private agendaService: AgendaService,
    private loadingService: LoadingService,
    private modalController: ModalController) { }

  ngOnInit() {
    this.tipoLogin = localStorage.getItem('one.tipologin')
    this.claims = JSON.parse(localStorage.getItem('claims'));
    this.claims_Agenda = {
      Bloquear: this.claims.Agenda.indexOf("Bloquear Agenda") != -1 ? true : false,
      Desbloquear: this.claims.Agenda.indexOf("Desbloquear Agenda") != -1 ? true : false,
    }
  }



  async removerBloqueioButton() {
    await this.loadingService.present();
    this.agendaService.desmarcarBloqueioProfissional(this.dadosAgendamento.agendaId).subscribe(
      result => {
        this.modalcontroller.dismiss(this.dadosAgendamento);
        this.loadingService.dismiss();
      },
      fail => {
        this.loadingService.dismiss();
      }
    );
  }

  close() {
    this.modalcontroller.dismiss(0);
  }

  async editarObsBloqueioModal() {
    const modal = await this.modalController.create({
      component: EditarObservacaoBloqueioComponent,
      componentProps: {
        observacao: this.dadosAgendamento.observacao,
        agendaId: this.dadosAgendamento.agendaId
      },
      backdropDismiss: false,
      cssClass: 'obsBloqueio'
    });

    modal.onDidDismiss().then(retorno => {
      if (retorno.data !== 0 && retorno.data !== undefined && retorno.data !== null) {
        this.dadosAgendamento.observacao = retorno.data.observacao;
        document.getElementsByTagName('ion-modal')[0].dismiss();
      }
    });
    return await modal.present();
  }

}

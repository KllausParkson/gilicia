import { Component, OnInit, Input } from '@angular/core';
import { AlertController, PopoverController } from '@ionic/angular';
import { AgendaService } from 'app/agenda/services/agenda.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-popover-atendimento',
  templateUrl: './popover-atendimento.component.html',
  styleUrls: ['./popover-atendimento.component.scss'],
})
export class PopoverAtendimentoComponent implements OnInit {

  @Input() listaProdutosRegistrados: any;
  @Input() listaServicosRegistrados: any;
  @Input() index: number;
  @Input() elementoFicha: any;

  public tipoUsuario: any;

  constructor(
    public popoverController: PopoverController,
    public agendaService: AgendaService,
    public alertController: AlertController,
    public translate: TranslateService,
  ) { }

  ngOnInit() {
    this.atualizaTipoUsuario();
  }

  atualizaTipoUsuario() {
    this.tipoUsuario = localStorage.getItem('one.tipologin');
  }

  editarInformacoes() {
    if (this.tipoOperacao() == 1) { //editando servico
      this.popoverController.dismiss(this.index, "edit-service");
    }
    else { //editando produto
      this.popoverController.dismiss(this.index, "edit-product");
    }
  }

  async excluirItem() {
    const alert = await this.alertController.create({
      message: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.POPOVERATENDIMENTO.DESEJAEXCLUIR'),
      cssClass: 'buttonCss',
      buttons: [
        {
          //text: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.ALERTREMOCAO.CANCELARREMOCAO'),
          text: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.POPOVERATENDIMENTO.ALERT.NAO'),
          role: 'cancel',
          cssClass: 'cancelButton',
          handler: (blah) => { }
        },
        {
          text: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.POPOVERATENDIMENTO.ALERT.SIM'),
          handler: () => {
            this.removeItem();
          }
        },
      ],
      backdropDismiss: false,
    });
    await alert.present();
  }

  removeItem() {

    if (this.tipoOperacao()) { //Excluindo um Serviço pelo retorno ser 1
      this.agendaService.deleteRegistroServico(this.listaServicosRegistrados[this.index]?.registroServicoId).subscribe(
        result => {
          this.listaServicosRegistrados.splice(this.index, 1)
          this.popoverController.dismiss(this.listaServicosRegistrados, "servico");
        },
        fail => {
        }
      )
    }
    else { //Excluindo um produto pelo retorno ser 0
      this.agendaService.deleteRegistroProduto(this.listaProdutosRegistrados[this.index]?.registroProdutoId).subscribe(
        result => {
          this.listaProdutosRegistrados.splice(this.index, 1)
          this.popoverController.dismiss(this.listaProdutosRegistrados, "produto");
        },
        fail => {
        }
      )
    }
  }

  async excluirTodosItem() {
    const alert = await this.alertController.create({
      message: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.POPOVERATENDIMENTO.DESEJAEXCLUIRTODOSITENS'),
      cssClass: 'buttonCss',
      buttons: [
        {
          //text: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.ALERTREMOCAO.CANCELARREMOCAO'),
          text: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.POPOVERATENDIMENTO.ALERT.NAO'),
          role: 'cancel',
          cssClass: 'cancelButton',
          handler: (blah) => { }
        },
        {
          text: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.POPOVERATENDIMENTO.ALERT.SIM'),
          handler: () => {
            this.excluirTodos();
          }
        },
      ],
      backdropDismiss: false,
    });
    await alert.present();
  }

  excluirTodos() {
    if (this.tipoOperacao()) { //Excluindo um Serviço pelo retorno ser 1
      for (let i = 0; i < this.listaServicosRegistrados?.length; i++) {
        this.agendaService.deleteRegistroServico(this.listaServicosRegistrados[i]?.registroServicoId).subscribe(
          result => {
            this.listaServicosRegistrados.splice(this.index, 1)
            this.popoverController.dismiss(this.listaServicosRegistrados, "servico");
          },
          fail => {
          }
        )
      }
    }
    else { //Excluindo um produto pelo retorno ser 0
      for (let i = 0; i < this.listaProdutosRegistrados?.length; i++) {
        this.agendaService.deleteRegistroProduto(this.listaProdutosRegistrados[i]?.registroProdutoId).subscribe(
          result => {
            this.listaProdutosRegistrados.splice(this.index, 1)
            this.popoverController.dismiss(this.listaProdutosRegistrados, "produto");
          },
          fail => {
          }
        )
      }
    }
  }

  tipoOperacao() {

    if (!!this.elementoFicha.servicoId) {
      return 1; //É um serviço
    }
    else {
      return 0; //É um produto
    }
  }

}

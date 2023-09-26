import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import { AgendaService } from '../../services/agenda.service'
import { LoadingService } from '../../../core/services/loading.service';
import { NovoAgendamentoProfissionalComponent } from '../novo-agendamento-profissional/novo-agendamento-profissional.component'
import { ResumoAgendamentoProfissionalComponent } from '../resumo-agendamento-profissional/resumo-agendamento-profissional.component'
import { DiasRetornoDetalhesClienteComponent } from '../dias-retorno-detalhes-cliente/dias-retorno-detalhes-cliente.component';
import { AlertController } from '@ionic/angular';
import { detalhesClienteModel } from '../../models/detalhesClienteModel';
import { environment } from '../../../../environments/environment';
import { OutrosAgendamentosDoClienteComponent } from '../outros-agendamentos-do-cliente/outros-agendamentos-do-cliente.component';

@Component({
  selector: 'app-opcoes-agendamento',
  templateUrl: './opcoes-agendamento.component.html',
  styleUrls: ['./opcoes-agendamento.component.scss'],
})
export class OpcoesAgendamentoComponent implements OnInit {

  public registerServicePermission: any;
  public registerProductPermission: any;
  public tipoUsuario: any;
  public dadosAgendamento: any;
  public dataSelecionada: any;
  public userData: any;
  public parametrosLight: any;
  public tipoLogin: any;
  public QtdAgendamentos: any;
  private detalhesCli: detalhesClienteModel;

  public profissionalInfo: any;
  public profissionalId: number;
  public possuiFicha: boolean = true;
  public diaSemana: string;
  public dataDia: string;

  public claims;
  public claims_Agenda;

  constructor(private modalcontroller: ModalController,
    private agendaService: AgendaService,
    private loadingService: LoadingService,
    public translate: TranslateService,
    public alertController: AlertController) { }

  ngOnInit() {
    this.tipoLogin = localStorage.getItem('one.tipologin')
    this.tipoUsuario = localStorage.getItem('one.tipologin')
    this.dadosAgendamento.dia = new Date(this.dadosAgendamento.dia)//.toLocaleDateString().split("T")
    this.outrosAgendamentos();
    this.userData = JSON.parse(localStorage.getItem('one.user'));
    this.diaSemana = this.dadosAgendamento.dia.getDay();

    this.dataDia = this.dadosAgendamento.dia.toLocaleDateString().split("T");
    if (this.userData.claims['Servicos'] != null) {
      this.registerServicePermission = this.userData.claims['Servicos'].filter(x => x == "Visualizar");
    }
    if (this.userData.claims['Serviços'] != null) {
      this.registerServicePermission = this.userData.claims['Serviços'].filter(x => x == "Visualizar");
    }
    if (this.userData.claims['Lançar serviços'] != null) {
      this.registerServicePermission = this.userData.claims['Lançar serviços'].filter(x => x == "Visualizar");
    }
    if (this.userData.claims['Produtos'] != null) {
      this.registerProductPermission = this.userData.claims['Produtos'].filter(x => x == "Visualizar");
    }
    if (this.userData.claims['Lançar produtos'] != null) {
      this.registerProductPermission = this.userData.claims['Lançar produtos'].filter(x => x == "Visualizar");
    }

    this.claims = JSON.parse(localStorage.getItem('claims'));
    this.claims_Agenda = {
      Agendar: this.claims.Agenda.indexOf("Agendar Serviço") != -1 ? true : false,
      Desmarcar: this.claims.Agenda.indexOf("Desmarcar Serviço") != -1 ? true : false,
      Editar: this.claims.Agenda.indexOf("Editar Agendamento") != -1 ? true : false,
      Bloquear: this.claims.Agenda.indexOf("Bloquear Agenda") != -1 ? true : false,
      Desbloquear: this.claims.Agenda.indexOf("Desbloquear Agenda") != -1 ? true : false,
    }
    this.getDetalhesCli()

  }

  async desmarcarAgendamento() {
    await this.loadingService.present()
    this.agendaService.deleteProfessionalAppointment(this.dadosAgendamento.agendaId).subscribe(
      result => {
        this.loadingService.dismiss()
        this.modalcontroller.dismiss(this.dadosAgendamento)
      },
      fail => {
        this.loadingService.dismiss()
      }
    )
  }

  getDetalhesCli(){
    this.agendaService.getBuscaInfoCliente(this.dadosAgendamento.clienteId).subscribe(
      result => {
        this.detalhesCli = result
        console.table(this.detalhesCli)
      },
      fail => {
      }
    )
  }

  async editarAppointment() {
    const modal = await this.modalcontroller.create({
      component: NovoAgendamentoProfissionalComponent,
      componentProps: {
        parametrosLight: this.parametrosLight,
        userData: this.userData,
        profissionalInfo: this.profissionalInfo,
        dataSelecionada: this.dataSelecionada,
        dadosAgendamento: this.dadosAgendamento,
        profissionalId: this.profissionalId
      },
    })
    modal.onDidDismiss().then(retorno => {
      if (retorno != undefined) {
        document.getElementsByTagName('ion-modal')[0].dismiss({ edited: true, agendamento: retorno })
      }
    })

    return await modal.present()
  }

  async resumoAgendamento() {
    const modal = await this.modalcontroller.create({
      component: ResumoAgendamentoProfissionalComponent,
      componentProps: {
        parametrosLight: this.parametrosLight,
        registerServicePermission: this.registerServicePermission,
        registerProductPermission: this.registerProductPermission,
        userData: this.userData,
        dataSelecionada: this.dataSelecionada,
        dadosAgendamento: this.dadosAgendamento,
        possuiFicha: this.possuiFicha,
        naotemcliente: false
      },
    })//profissionalInfo: this.profissionalInfo,
    modal.onDidDismiss().then(retorno => {
      if (retorno.data != undefined) {
        document.getElementsByTagName('ion-modal')[0].dismiss({ status: retorno, agendaId: this.dadosAgendamento.agendaId })
        //colocar chamada da API de edição
        //this.proximosAgendamentos(this.dataSelecionada, this.dataSelecionada)
      }
    })

    return await modal.present()
  }

  async detalhesCliente(){
    const modal = await this.modalcontroller.create({
      component: DiasRetornoDetalhesClienteComponent,
      cssClass: 'diasRetorno',
      componentProps: {
        dadosAgendamento: this.dadosAgendamento,
        detalhesCli: this.detalhesCli
      },
      backdropDismiss: false,
    })
    modal.onDidDismiss().then(retorno => {

      if (retorno.data != undefined) {
        document.getElementsByTagName('ion-modal')[0].dismiss({ status: retorno, agendaId: this.dadosAgendamento.agendaId })
      }
    })

    return await modal.present()
  }


  //resumo aqui ResumoAgendamentoProfissionalComponent

  close() {
    this.dadosAgendamento.dia = this.dadosAgendamento.dia.toISOString().split('T')[0] + 'T00:00:00'; //Essa linha converte representação de data de agendamento para comparação em botao iniciar atendimento, (NÃO REMOVER).
    this.modalcontroller.dismiss(0);
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: this.translate.instant('AGENDA.MODALS.ALERT.MENSAGEM.DESMARCAR'),
      buttons: [
        {
          text: this.translate.instant('AGENDA.MODALS.ALERT.NAO'),
          role: 'cancel',
          cssClass: 'cancelButton',
          handler: (blah) => {
          }
        }, {
          text: this.translate.instant('AGENDA.MODALS.ALERT.SIM'),
          handler: () => {
            this.desmarcarAgendamento()
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertObservacao() {
    const alert = await this.alertController.create({
      header: 'Observação',
      cssClass: 'buttonCss',
      message: this.dadosAgendamento.observacao,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'cancel-button'
        }
      ]
    });

    await alert.present();
  }

  async outrosAgendamentosModal() {

    const modal = await this.modalcontroller.create({
      component: OutrosAgendamentosDoClienteComponent,
      componentProps: {
        dataAgendamento: this.dadosAgendamento.dia.toISOString().slice(0, 10),
        clienteId: this.dadosAgendamento.clienteId
      },
      backdropDismiss: false
    });


    return await modal.present();
  }
  outrosAgendamentos() {

    let lang = localStorage.getItem('one.lang') != "" && localStorage.getItem('one.lang') != undefined
      && localStorage.getItem('one.lang') != null && localStorage.getItem('one.lang') != "null"
      ? localStorage.getItem('one.lang')
      : JSON.parse(localStorage.getItem('one.user')).authenticatedBranch.linguaPais;

    this.agendaService.getObterQuantidadeAgendamentoDoCliente(this.dadosAgendamento.dia.toISOString().slice(0, 10), this.dadosAgendamento.clienteId).subscribe(
      result => {
        this.QtdAgendamentos = result;
      },

    )

  }
}

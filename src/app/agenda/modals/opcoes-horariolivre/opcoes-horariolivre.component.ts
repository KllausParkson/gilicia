import { Component, OnInit } from '@angular/core';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { AgendaService } from '../../services/agenda.service'
import { LoadingService } from '../../../core/services/loading.service';
import { NovoBloqueioComponent } from '../novo-bloqueio/novo-bloqueio.component'
import { InfoProfissionaleAgendaModel } from '../../models/infoProfissionaleAgendaModel'
import { NovoAgendamentoProfissionalComponent } from '../novo-agendamento-profissional/novo-agendamento-profissional.component'
import { ResumoAgendamentoProfissionalComponent } from '../resumo-agendamento-profissional/resumo-agendamento-profissional.component'

@Component({
  selector: 'app-opcoes-horariolivre',
  templateUrl: './opcoes-horariolivre.component.html',
  styleUrls: ['./opcoes-horariolivre.component.scss'],
})
export class OpcoesHorariolivreComponent implements OnInit {

  public dadosAgendamento: any;
  public infoProfissionaleAgenda: InfoProfissionaleAgendaModel;
  public dataSelecionada: any;
  public horariosBloqDisponiveis: any = [];
  public profissionalId: number;
  public tipoUsuario: any;
  public profissionalInfo: any // vem como parametro ao abrir o modal
  public parametrosLight: any;
  public tipoLogin: any;

  public registerServicePermission: any;
  public registerProductPermission: any;
  public userData: any;
  public possuiFicha: boolean = false;

  public claims;
  public claims_Agenda;

  constructor(
    private agendaService: AgendaService,
    private loadingService: LoadingService,
    private ModalController: ModalController) { }

  ngOnInit() {
    this.getHorariosDispBloq()
    this.tipoUsuario = localStorage.getItem('one.tipologin')
    this.userData = JSON.parse(localStorage.getItem('one.user'))
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

  }




  async criarBloqueioButton() {
    this.criarBloqueioModal()
  }



  async criarBloqueioModal() {
    const modal = await this.ModalController.create({
      component: NovoBloqueioComponent,
      componentProps: {
        dadosAgendamento: this.dadosAgendamento,
        infoProfissionaleAgenda: this.infoProfissionaleAgenda,
        profissionalInfo: this.profissionalInfo,
        profissionalId: this.profissionalId,
      },
      backdropDismiss: false,
    })
    modal.onDidDismiss().then(retorno => {
      if (retorno.data != 0) {
        document.getElementsByTagName('ion-modal')[0].dismiss(retorno.data)

      }
    })

    return await modal.present()
  }


  async addAppointment() {
    const modal = await this.ModalController.create({
      component: NovoAgendamentoProfissionalComponent,
      componentProps: {
        //userD ata: this.userData,
        parametrosLight: this.parametrosLight,
        dataSelecionada: this.dataSelecionada,
        dadosAgendamento: this.dadosAgendamento,
        dadosAgendaProfissional: this.infoProfissionaleAgenda,
        profissionalInfo: this.profissionalInfo,
        profissionalId: this.profissionalId,
      },
    })
    modal.onDidDismiss().then(retorno => {
      if (retorno != undefined) {
        document.getElementsByTagName('ion-modal')[0].dismiss(retorno)
        //colocar chamada da API de edição
        //this.proximosAgendamentos(this.dataSelecionada, this.dataSelecionada)
      }
    })

    return await modal.present()
  }


  async getHorariosDispBloq() {
    // await this.loadingService.present()
    await this.agendaService.getHorarioDispBloqueio(this.dadosAgendamento.dia, (this.profissionalInfo ? this.profissionalInfo.profissionalId : null)).subscribe(
      result => {

        let listHorariosInicio = []
        let listHorariosFim = []
        result.map(x => {
          if (x.naoPodeSerInicio != true) {
            listHorariosInicio.push(x)
          }
          if (x.naoPodeSerFim != true) {
            listHorariosFim.push(x)
          }
        })
        listHorariosInicio = listHorariosInicio.filter(x => x.horario >= this.dadosAgendamento.horarioInicio && x.horario < this.dadosAgendamento.horarioFim)
        listHorariosFim = listHorariosFim.filter(x => x.horario >= this.dadosAgendamento.horarioInicio && x.horario < this.dadosAgendamento.horarioFim)

        // listHorariosInicio = listHorariosInicio.filter(x => x.horario >= this.infoProfissionaleAgenda.horarioInicioProfissional && x.horario < this.infoProfissionaleAgenda?.horarioFimProfissional)
        // listHorariosFim = listHorariosFim.filter(x => x.horario >= this.infoProfissionaleAgenda.horarioInicioProfissional && x.horario < this.infoProfissionaleAgenda?.horarioFimProfissional)

        this.horariosBloqDisponiveis.push(JSON.parse(JSON.stringify(listHorariosInicio)))
        this.horariosBloqDisponiveis.push(JSON.parse(JSON.stringify(listHorariosFim)))
        this.loadingService.dismiss()
        for (let i = 0; i < this.horariosBloqDisponiveis?.length; i++) {


          this.horariosBloqDisponiveis[i].map(x => x['disabled'] = false)

        }

      },
      fail => {
        this.loadingService.dismiss()
      }
    )
  }

  async resumoAgendamento() {
    const modal = await this.ModalController.create({
      component: ResumoAgendamentoProfissionalComponent,
      componentProps: {
        parametrosLight: this.parametrosLight,
        registerServicePermission: this.registerServicePermission,
        registerProductPermission: this.registerProductPermission,
        userData: this.userData,
        dataSelecionada: this.dataSelecionada,
        dadosAgendamento: this.dadosAgendamento,
        possuiFicha: this.possuiFicha,
        naotemcliente: true

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



  close() {
    this.ModalController.dismiss(0);
  }

}

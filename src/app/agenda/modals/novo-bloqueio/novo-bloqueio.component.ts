import { Component, OnInit, HostListener } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AgendaService } from '../../services/agenda.service'
import { LoadingService } from '../../../core/services/loading.service';
import { InfoProfissionaleAgendaModel } from '../../models/infoProfissionaleAgendaModel'
import { ProfissionalBloqueioModel } from '../../models/profissionalBloqueioModel'

@Component({
  selector: 'app-novo-bloqueio',
  templateUrl: './novo-bloqueio.component.html',
  styleUrls: ['./novo-bloqueio.component.scss'],
})
export class NovoBloqueioComponent implements OnInit {

  public dadosAgendamento: any;
  public horariosBloqDisponiveis: any = [];
  public controlBotoesDesabilitados: any = []
  public horarioSelecionado: any = []
  public infoProfissionaleAgenda: InfoProfissionaleAgendaModel;

  public screenHeight: any;
  public screenWidth: any;
  public divHeight: any;
  public rowHeight: any;
  public profissionalId: number;
  public observacao: string;

  public isIEOrEdgeOrFF: boolean = /msie\s|Firefox|trident\/|edge\//i.test(window.navigator.userAgent); //saber qual o navegador que o usuario está

  public profissionalInfo: any// vem como parametro do modal de mais opções
  public bloqueioButtonWaitingAPI: boolean = false; //faz o controle do bloqueio do botão para que não seja possível acionar o mesmo no intervalo de espera do retorno da API de bloqueio


  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    // this.addAppointmentButtonHeight = this.screenHeight - 90;
    // this.addAppointmentButtonHeight = this.addAppointmentButtonHeight.toString() + 'px'
    this.divHeight = this.screenHeight < 1024 ? this.screenHeight - 363 : 263
    this.divHeight = this.divHeight.toString() + 'px'
    this.rowHeight = this.screenHeight - 190
    this.rowHeight = this.rowHeight.toString() + 'px'
  }

  constructor(private modalcontroller: ModalController,
    private agendaService: AgendaService,
    private loadingService: LoadingService,
    private ModalController: ModalController,) { }

  ngOnInit() {
    this.getScreenSize()
    this.getHorariosDispBloq()
  }


  async getHorariosDispBloq() {
    await this.loadingService.present()
    this.agendaService.getHorarioDispBloqueio(this.dadosAgendamento.dia, this.profissionalId).subscribe(
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
        listHorariosFim = listHorariosFim.filter(x => x.horario >= this.dadosAgendamento.horarioInicio && x.horario <= this.dadosAgendamento.horarioFim)



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

  closeModal() {
    this.modalcontroller.dismiss()
  }

  selecionaHorario(event: any, servico: any, horarioSelecionado: any, indexHorario: number, indexColuna: number) {


    if (this.horarioSelecionado.filter(x => x.coluna == indexColuna)[0] != undefined) {
      //Verificar se o childnodes é nulo ou undefined para corrigir o erro com o childNodes[0]
      if (this.horarioSelecionado.filter(x => x.coluna == indexColuna)[0].botao.target.shadowRoot.childNodes[0].children[0] != null ||
        this.horarioSelecionado.filter(x => x.coluna == indexColuna)[0].botao.target.shadowRoot.childNodes[0].children[0] != undefined) {
        this.horarioSelecionado.filter(x => x.coluna == indexColuna)[0].botao.target.shadowRoot.childNodes[0].children[0].style.color = "rgba(0, 0, 0, 0.712)"
        this.horarioSelecionado.filter(x => x.coluna == indexColuna)[0]?.botao.target.shadowRoot.childNodes[0].setAttribute('style', 'background-color: white !important')
      }
      else {
        this.horarioSelecionado.filter(x => x.coluna == indexColuna)[0].botao.target.shadowRoot.childNodes[1].children[0].style.color = "rgba(0, 0, 0, 0.712)"
        this.horarioSelecionado.filter(x => x.coluna == indexColuna)[0]?.botao.target.shadowRoot.childNodes[1].setAttribute('style', 'background-color: white !important')
      }

    }
    //Verificar se o childnodes é nulo ou undefined para corrigir o erro com o childNodes[0]
    if (event.target.shadowRoot.childNodes[0].children[0] != null || event.target.shadowRoot.childNodes[0].children[0] != undefined) {
      event.target.shadowRoot.childNodes[0].setAttribute('style', 'background-color: var(--ion-color-primary) !important')
      event.target.shadowRoot.childNodes[0].children[0].style.color = "white"
    }
    else {
      event.target.shadowRoot.childNodes[1].setAttribute('style', 'background-color: var(--ion-color-primary) !important')
      event.target.shadowRoot.childNodes[1].children[0].style.color = "white"
    }

    this.horarioSelecionado = this.horarioSelecionado.filter(x => x.coluna != indexColuna)
    this.horarioSelecionado.push({ horario: horarioSelecionado, coluna: indexColuna, botao: event })


    if (indexColuna == 0) {

      for (let i = 0; i < this.horariosBloqDisponiveis[1]?.length; i++) {
        if (this.horariosBloqDisponiveis[1][i].horario <= this.horariosBloqDisponiveis[0][indexHorario].horario) {
          this.horariosBloqDisponiveis[1][i].disabled = true
          //this.controlBotoesDesabilitados.push({ horario: this.horariosBloqDisponiveis[1][i], coluna: 1, botaoControlador: event})

        }
        else {
          if (this.horariosBloqDisponiveis[1][i].disabled == true) {
            this.horariosBloqDisponiveis[1][i].disabled = false
          }
        }
      }
    }
    else if (indexColuna == 1) {
      for (let i = 0; i < this.horariosBloqDisponiveis[0]?.length; i++) {
        if (this.horariosBloqDisponiveis[0][i].horario >= this.horariosBloqDisponiveis[0][indexHorario].horario) {
          this.horariosBloqDisponiveis[0][i].disabled = true
          //this.controlBotoesDesabilitados.push({horario: this.horariosBloqDisponiveis[0][i], coluna: 0, botaoControlador: event})
        }

        else {
          if (this.horariosBloqDisponiveis[0][i].disabled == true) {
            this.horariosBloqDisponiveis[0][i].disabled = false
          }
        }
      }
    }
    this.horariosBloqDisponiveis[indexColuna]


  }


  returnPage() {
    this.modalcontroller.dismiss()
  }

  detectiOS() {
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i))
      return true;
    else
      return false;
  }

  criarBloqueio() {
    this.bloqueioButtonWaitingAPI = true
    let bloqueioModel = new ProfissionalBloqueioModel()
    bloqueioModel.agendaId = 0
    bloqueioModel.data = this.dadosAgendamento.dia
    bloqueioModel.horarioInicio = this.horarioSelecionado.filter(x => x.coluna == 0)[0].horario.horario
    bloqueioModel.horarioFim = this.horarioSelecionado.filter(x => x.coluna == 1)[0].horario.horario
    bloqueioModel.profissionalId = this.profissionalId
    bloqueioModel.observacao = this.observacao;
    this.agendaService.criarBloqueio(bloqueioModel).subscribe(
      result => {
        bloqueioModel.agendaId = result
        bloqueioModel['bloqueio'] = 1
        bloqueioModel['status'] = 'B'
        this.modalcontroller.dismiss(bloqueioModel)
      },
      fail => {
        this.bloqueioButtonWaitingAPI = false
      }
    )
  }

}

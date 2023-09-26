import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ToastService } from 'app/core/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { AgendaService } from '../../services/agenda.service';

@Component({
  selector: 'app-outros-agendamentos-do-cliente',
  templateUrl: './outros-agendamentos-do-cliente.component.html',
  styleUrls: ['./outros-agendamentos-do-cliente.component.scss'],
})
export class OutrosAgendamentosDoClienteComponent implements OnInit {
  public agendamentos: any;
  public dataAgendamento: any;
  public clienteId: any;
  public corStatus: any;
  public parametrosLight: any;
  innerWidth: number;
  screenHeight: number;
  gridWidth: any;

  constructor(private modalController: ModalController,
    private toastService: ToastService,
    private Translate: TranslateService,
    private alertController: AlertController,
    private agendaService: AgendaService) { }

  ngOnInit() {

    this.outrosAgendamentos()
  }

  closeModal() {
    this.modalController.dismiss();
  }

  outrosAgendamentos() {

    let lang = localStorage.getItem('one.lang') != "" && localStorage.getItem('one.lang') != undefined
      && localStorage.getItem('one.lang') != null && localStorage.getItem('one.lang') != "null"
      ? localStorage.getItem('one.lang')
      : JSON.parse(localStorage.getItem('one.user')).authenticatedBranch.linguaPais;

    this.agendaService.getObterAgendamentoDoCliente(this.dataAgendamento, this.clienteId).subscribe(
      result => {
        this.agendamentos = result;

        this.agendamentos.map(x => {
          x['diaSemana'] = new Date(x.dataAg).getDay();
          x.dataAg = new Date(x.dataAg).toLocaleDateString(lang).split("T")[0];
        })
      },

    )
  }

  setBorderStatus(status: string) {
    switch (status) {
      case 'A':
        this.corStatus = '#FF0DA5';
        return '7px solid #FF0DA5';
      case 'P':
        this.corStatus = '#C2D69B';
        return '7px solid #C2D69B';
      case 'E':
        this.corStatus = '#365F91';
        return '7px solid #365F91';
      case 'C':
        this.corStatus = '#A700FF';
        return '7px solid #A700FF';
      case 'R':
        this.corStatus = '#7F7F7F';
        return '7px solid #7F7F7F';
      case 'M':
        this.corStatus = '#00FBFF';
        return '7px solid #00FBFF';
      case 'N':
        this.corStatus = '#86592D';
        return '7px solid #86592D';
      case 'X':
        this.corStatus = '#0518A3';
        return '7px solid #0518A3';
    }
  }

  temSegundonome(nome: string) {
    return nome?.split(' ')[1] !== undefined && nome?.split(' ')[1] !== null;
  }

  getParametrosLight() {
    this.agendaService.getParametrosLight().subscribe(
      result => {
        this.parametrosLight = result
      },
      fail => {
      }
    )
  }

  getScreenSize(event?) {
    this.innerWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.gridWidth = this.innerWidth - 20;
    this.gridWidth = this.gridWidth.toString() + 'px';
  }
}

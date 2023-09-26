import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable, throwError } from 'rxjs';
import { ToastService } from 'app/core/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { DateUtils } from 'app/core/common/data-type-utils/date-utils';
import { LoadingService } from 'app/core/services/loading.service';
import { AgendamentoModel } from '../../models/agendamentoModel';
import { GetServicoProfissionalModel } from '../../models/getServicoProfissionalModel';
import { ProfissionalResumoModel } from '../../models/profissionalResumoModel';
import { HorariosDisponiveisModel } from '../../models/proximosAgendamentosModel';
import { AgendaService } from '../../services/agenda.service';
import { Calendar } from '@ionic-native/calendar/ngx';

import { HttpClient } from '@angular/common/http';

import { switchMap, catchError } from 'rxjs/operators';


@Component({
  selector: 'app-editar-agendamento-cliente-modal',
  templateUrl: './editar-agendamento-cliente-modal.component.html',
  styleUrls: ['./editar-agendamento-cliente-modal.component.scss'],
})
export class EditarAgendamentoClienteModalComponent implements OnInit {
  @Input() agenda: AgendamentoModel;

  public agendaForm: FormGroup;
  public listaHorariosDisponiveis: HorariosDisponiveisModel[];
  public listaProfissionaisDisponiveis: any = [];
  public listaProfissionaisPesquisados: any = [];
  public listaServicos: any = [];
  public listaServicosPesquisados: any = [];
  public horarioSelecionado: HorariosDisponiveisModel;
  public profissionalSelecionado: ProfissionalResumoModel;
  public servicoSelecionado: GetServicoProfissionalModel;
  public userData: any;

  public profissionalId: any;
  public servicoId: any;
  public fuso: any;
  public horarioAux: any;
  public horarioInicio: any;
  public linguaPais: any;
  public horarioFim: any;

  public hasError = false;
  public errorMessage = '';

  constructor(private formBuild: FormBuilder,
    private modalController: ModalController,
    private loadingService: LoadingService,
    private agendaService: AgendaService,
    private Calendar: Calendar,
    public translate: TranslateService,
    private toast: ToastService,
    public http: HttpClient,) {
    this.profissionalSelecionado = new ProfissionalResumoModel();
    this.servicoSelecionado = new GetServicoProfissionalModel();
    this.horarioSelecionado = new HorariosDisponiveisModel();
  }

  ngOnInit() {
    this.profissionalSelecionado.nome = this.agenda['nomeColaborador'];
    this.profissionalSelecionado.profissionalId = this.agenda['colaboradorId'];
    this.profissionalId = this.agenda['colaboradorId'];

    this.servicoSelecionado.nomeServico = this.agenda['descricaoServico'];
    this.servicoSelecionado.servicoId = this.agenda['servicoId'];
    this.servicoId = this.agenda['servicoId'];

    this.horarioSelecionado.horarioInicio = this.agenda['horarioInicio'];
    this.horarioInicio = this.agenda['horarioInicio'];
    this.horarioSelecionado.horarioFinal = this.agenda['horarioFim'];
    this.horarioSelecionado['horarioFormatado'] = this.horarioSelecionado.horarioInicio.toString()?.substr(0, 5)
      + ' - ' + this.horarioSelecionado.horarioFinal.toString()?.substr(0, 5);

    this.userData = JSON.parse(localStorage.getItem('one.user'));
    let user = JSON.parse(localStorage.getItem('one.user'));
    let filial = user.authenticatedBranch;
    this.fuso = parseInt(filial.fuso, 10);
    this.linguaPais = filial.linguaPais;
    this.getProfissionais();
    this.getServicosProfissional();
    this.getHorariosDisponiveisProfissional();

    this.agendaForm = this.formBuild.group({
      dataAg: new FormControl(new Date(this.agenda.dataAg), Validators.required),
      nomeColab: new FormControl(this.agenda['nomeColaborador'], Validators.required),
      nomeServico: new FormControl(this.agenda['descricaoServico'], Validators.required),
      horarioSelecionado: new FormControl(this.horarioSelecionado['horarioFormatado'], Validators.required)

    });
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async editar() {
    await this.loadingService.present();
    if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
      let dataAgstr = DateUtils.DateToString(new Date(this.agendaForm.controls.dataAg.value));
      let dataAgDateTime = new Date(dataAgstr);
      dataAgDateTime.setHours(dataAgDateTime.getHours() + this.fuso);
      this.agendaForm.controls.dataAg.setValue(dataAgDateTime);
    }
    const ag: AgendamentoModel = {
      profissionalId: this.profissionalId,
      servicoId: this.servicoId,
      horarioInicio: this.horarioInicio,
      horarioFim: this.horarioFim,
      dataAg: this.agendaForm.controls.dataAg.value,
      agendasId: this.agenda.agendasId,
    };

    this.agendaService.editarAgentamentoCliente(ag)
      .subscribe(
        res => {
          this.loadingService.dismiss();
          this.modalController.dismiss({ agenda: ag });
        },
        fail => {
          this.loadingService.dismiss();
          if (fail.error == 'API.OAGENDAMENTO.ALTERARAGENDAMENTOCLIENTE.EXISTEEVENTO') {
            this.toast.presentToast(this.translate.instant('AGENDA.MODALS.NOVOAGENDAMENTO.EXISTEAGENDAMENTO'), 'danger');
          }
          else {
            this.toast.presentToast(fail + " - " + this.translate.instant('AGENDA.MODALS.NOVOAGENDAMENTO.DANGER'), 'danger');
          }
          this.modalController.dismiss();
        }
      );
  }

  async getProfissionais() {
    await this.loadingService.present();
    if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
      let dataAgstr = DateUtils.DateToString(new Date(this.agendaForm.controls.dataAg.value));
      let dataAgDateTime = new Date(dataAgstr);
      dataAgDateTime.setHours(dataAgDateTime.getHours() + this.fuso);
      this.agendaForm.controls.dataAg.setValue(dataAgDateTime);
    }
    this.agendaService.getProfissionaisDisponiveis(this.servicoId,
      DateUtils.DateToString(new Date(this.agendaForm.controls.dataAg.value)))
      .subscribe(
        result => {
          this.listaProfissionaisDisponiveis = result;
          this.listaProfissionaisPesquisados = result;
          this.loadingService.dismiss();
        },
        fail => {
          this.loadingService.dismiss();
        }
      );
  }

  async getServicosProfissional() {
    await this.loadingService.present();

    this.agendaService.getServicosProfissionalCliente((this.profissionalSelecionado ? this.profissionalId : null))
      .subscribe(
        result => {
          this.listaServicos = result;
          const listFilteredServices = [];
          for (let i = 0; i < this.listaServicos?.length; i++) {
            for (let j = 0; j < this.listaServicos[i].servicos?.length; j++) {
              listFilteredServices.push(this.listaServicos[i].servicos[j]);
            }
          }

          this.listaServicosPesquisados = listFilteredServices;
          this.loadingService.dismiss();
        },
        fail => {
          this.loadingService.dismiss();
        }
      );
  }

  changeData(data: Date) {
    this.horarioInicio = undefined;
    this.horarioFim = undefined;
    this.horarioSelecionado = undefined;

    var dateToday = new Date(new Date().setHours(0, 0, 0, 0))
    if (data >= dateToday) {
      this.getHorariosDisponiveisProfissional();
    }
    else {
      this.listaHorariosDisponiveis = null;
    }

  }

  changeProfissional(profissional: ProfissionalResumoModel) {
    this.horarioInicio = undefined;
    this.horarioFim = undefined;
    this.horarioSelecionado = undefined;
    this.profissionalId = profissional
    this.getHorariosDisponiveisProfissional();
    this.getServicosProfissional();
  }

  changeServico(servico: GetServicoProfissionalModel) {
    this.horarioInicio = undefined;
    this.horarioFim = undefined;
    this.horarioSelecionado = undefined;
    this.servicoId = servico;
    this.getHorariosDisponiveisProfissional();
    this.getProfissionais();
  }

  changeHorario(horario: HorariosDisponiveisModel) {
    if (this.horarioSelecionado !== undefined &&
      this.listaHorariosDisponiveis.filter(x => x.horarioInicio === this.horarioSelecionado.horarioInicio &&
        x.horarioFinal === this.horarioSelecionado.horarioFinal)[0] === undefined) {
      this.listaHorariosDisponiveis.push(this.horarioSelecionado);
    }

    this.horarioSelecionado = horario;
    this.horarioAux = horario
    this.horarioInicio = this.horarioAux.substring(5, 0) + ":00"
    this.horarioFim = this.horarioAux.substring(8) + ":00"
  }

  async getHorariosDisponiveisProfissional() {

    await this.loadingService.present();
    if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
      let dataAgstr = DateUtils.DateToString(new Date(this.agendaForm.controls.dataAg.value));
      let dataAgDateTime = new Date(dataAgstr);
      dataAgDateTime.setHours(dataAgDateTime.getHours() + this.fuso);
      this.agendaForm.controls.dataAg.setValue(dataAgDateTime);
    }

    this.agendaService.getHorariosDisponiveis(this.profissionalId,
      this.servicoId, DateUtils.DateToString(new Date(this.agendaForm.controls.dataAg.value)),
      this.userData.authenticatedUser.cliForColsId)
      .subscribe(
        result => {
          this.loadingService.dismiss();
          this.listaHorariosDisponiveis = result;

          this.listaHorariosDisponiveis.map(x => x['horarioFormatado'] = x.horarioInicio.toString()?.substr(0, 5) + ' - ' +
            x.horarioFinal.toString()?.substr(0, 5));
        },
        fail => {
          this.loadingService.dismiss();
          this.listaHorariosDisponiveis = undefined;
        }
      );
  }

  pesquisaServicosProfissional(searchTerm: string) {
    const listFilteredServices = [];

    if (searchTerm === '') {
      for (let i = 0; i < this.listaServicos?.length; i++) {
        for (let j = 0; j < this.listaServicos[i].servicos?.length; j++) {
          listFilteredServices.push(this.listaServicos[i].servicos[j]);
        }
      }

      this.listaServicosPesquisados = listFilteredServices;
      return;
    }

    for (let i = 0; i < this.listaServicos?.length; i++) {
      for (let j = 0; j < this.listaServicos[i].servicos?.length; j++) {
        if (this.listaServicos[i].servicos[j].nomeServico.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
          listFilteredServices.push(this.listaServicos[i].servicos[j]);
        }
      }
    }
    this.listaServicosPesquisados = listFilteredServices.slice(0, 5);
  }

  pesquisaProfissionais(searchTerm: string) {
    const listFilteredProfissionais = [];

    for (let i = 0; i < this.listaProfissionaisDisponiveis?.length; i++) {
      if (this.listaProfissionaisDisponiveis[i].nome?.toLowerCase().indexOf(searchTerm?.toLowerCase()) !== -1) {
        listFilteredProfissionais.push(this.listaProfissionaisDisponiveis[i]);
      }
    }
    this.listaProfissionaisPesquisados = JSON.parse(JSON.stringify(listFilteredProfissionais.slice(0, 5)));
  }

  public valueNormalizer = (text: Observable<string>): any =>
    text.pipe(switchMap(this.service));

  public service = (text: string): any =>
    this.http.post('normalize/url', { text }).pipe(
      catchError((response: any, caught: Observable<object>) => {
        this.hasError = true;
        this.errorMessage = response.error;

        return throwError(response.error);
      })
    );
}

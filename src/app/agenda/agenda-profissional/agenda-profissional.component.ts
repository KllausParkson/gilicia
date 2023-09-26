import { EditarObservacaoBloqueioComponent } from './../modals/editar-observacao-bloqueio/editar-observacao-bloqueio.component';
import { Component, OnInit, HostListener } from '@angular/core';
import { ProximosAgendamentosModel } from '../models/proximosAgendamentosModel';
import { AgendaService } from '../services/agenda.service';
import { environment } from '../../../environments/environment';
import { NovoAgendamentoComponent } from '../modals/novo-agendamento/novo-agendamento.component';
import { AlertController, IonRouterOutlet, ModalController, Platform } from '@ionic/angular';
import { LoadingService } from '../../core/services/loading.service';
import { ChangeDetectorRef } from '@angular/core';
import { DateUtils } from 'app/core/common/data-type-utils/date-utils';
import { FormGroup, FormBuilder, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { OpcoesAgendamentoComponent } from '../modals/opcoes-agendamento/opcoes-agendamento.component';
import { AgendamentoModel } from '../models/agendamentoModel';
import { OpcoesHorariolivreComponent } from '../modals/opcoes-horariolivre/opcoes-horariolivre.component';
import { InfoProfissionaleAgendaModel } from '../models/infoProfissionaleAgendaModel';
import { ParametrosLightModel } from '../models/parametrosLightModel';

import { NovoAgendamentoProfissionalComponent } from '../modals/novo-agendamento-profissional/novo-agendamento-profissional.component';

import { OpcoesBloqueioComponent } from '../modals/opcoes-bloqueio/opcoes-bloqueio.component';

import { Capacitor } from '@capacitor/core';
import { TranslateService } from '@ngx-translate/core';
import { ResumoAgendamentoProfissionalComponent } from '../modals/resumo-agendamento-profissional/resumo-agendamento-profissional.component';
import { NovoBloqueioComponent } from '../modals/novo-bloqueio/novo-bloqueio.component';
import { element } from 'protractor';
import { LoginService } from 'app/login/services/login.service';
import { App } from '@capacitor/app';
// Para o Capacitor 3
// import { Plugins } from '@capacitor/core';
// const { App } = Plugins;

@Component({
  selector: 'app-agenda-profissional',
  templateUrl: './agenda-profissional.component.html',
  styleUrls: ['./agenda-profissional.component.scss'],
})
export class AgendaProfissionalComponent implements OnInit {
  public checkCarregamento: boolean = false;

  constructor(
    private agendaService: AgendaService,
    private modalController: ModalController,
    private ref: ChangeDetectorRef,
    private alertController: AlertController,
    public translate: TranslateService,
    private loadingService: LoadingService,
    public platform: Platform,
    private routerOutlet: IonRouterOutlet,
    private loginService: LoginService
  ) { this.configBackButton(); }

  screenWidth: number;
  screenHeight: number;

  public logo;
  public tipoLogin: any
  public agendamentos: any; // Array<ProximosAgendamentosModel>;
  private userData: any;
  public dataInicial: any = new Date();
  public diaDaSemana: number = new Date().getDay();
  public agendamentoSelecionadoIndex: number;
  public formGroup: FormGroup;
  public minInicio: Date = new Date();
  public infoProfissionaleAgenda: InfoProfissionaleAgendaModel;
  public listProfissionalBloq: any;
  public listAgendamentoseBloqs: any[];
  public addAppointmentButtonHeight: any;
  public cardHeight: any;
  public cardWitdh: any;
  public algumHorarioDisp: boolean;
  public indexhorarioDisp: any;
  public webBrowser = false;

  public parametrosLight: ParametrosLightModel;
  public profissionalId: number;
  public mobilidadeInadimplente: boolean;
  public didInit: boolean = false;
  public userCheck: any;
  public registerProductPermission: any;
  public registerServicePermission: any;
  public overlayDivControl = false;
  public iOS: boolean;
  public corStatus: string;
  public maisOpcoesFlag = false;
  public lang = localStorage.getItem('one.lang') != '' && localStorage.getItem('one.lang') != undefined
    && localStorage.getItem('one.lang') != null && localStorage.getItem('one.lang') != 'null'
    ? localStorage.getItem('one.lang')
    : JSON.parse(localStorage.getItem('one.user')).authenticatedBranch.linguaPais;
  public hoje = new Date();
  public hojeCorrigido: string;
  public dataSelecionada: any;
  public dataFormatada: string = new Date().toLocaleDateString(this.lang).split('T')[0];
  public fuso: any;
  public linguaPais: any;
  public agendamentoHoje: boolean;
  public dataHojeIniciarAtendimento: any;
  public diaHojeInit: boolean = true;
  public nameSizeCut: number;

  public claims;
  public claims_Agenda;
  public statusBoleto: boolean;

  public basehref: any;

  // @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.addAppointmentButtonHeight = this.iOS ? this.screenHeight - 184 : this.screenHeight - 190;
    this.addAppointmentButtonHeight = this.addAppointmentButtonHeight.toString() + 'px';
    var tamanhoCards = localStorage.getItem('calendarioExpandido') == '0' ? 310 : 485;
    this.cardHeight = this.screenHeight - tamanhoCards;
    this.cardHeight = this.cardHeight.toString() + 'px';
    this.cardWitdh = this.screenWidth - 10;
    this.cardWitdh = this.cardWitdh.toString() + 'px';
  }

  async ngOnInit() {

    this.basehref = localStorage.getItem('basehref')
    let user = JSON.parse(localStorage.getItem('one.user'));
    let filial = user.authenticatedBranch;
    this.fuso = parseInt(filial.fuso, 10);
    this.linguaPais = filial.linguaPais;
    this.getMobilidade(user.authenticatedBranch.empresaId, user.authenticatedBranch.filialId)
    if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
      this.hoje.setHours(this.hoje.getHours() + this.fuso);
      this.hojeCorrigido = new Date(this.hoje.getFullYear(), this.hoje.getMonth(), this.hoje.getDate(), 0).toISOString();
      this.dataSelecionada = new Date(this.hoje.getFullYear(), this.hoje.getMonth(), this.hoje.getDate(), 0).toISOString();
    }
    else {
      this.hojeCorrigido = new Date(this.hoje.getFullYear(), this.hoje.getMonth(), this.hoje.getDate(), 0).toISOString();
      this.dataSelecionada = this.hojeCorrigido;
    }
    await this.loginService.buscaEmpresaMobilidadeId(JSON.parse(localStorage.getItem('one.user')).authenticatedBranch.mobilidadeId)
      .then(
        res => {
          //this.bannerWhatsApp(res.cidade)
        }
      );

    this.platform.resume.subscribe(async () => {
      let user = JSON.parse(localStorage.getItem('one.user'));
      let filial = user.authenticatedBranch;
      this.fuso = parseInt(filial.fuso, 10);
      this.linguaPais = filial.linguaPais;
      this.getMobilidade(user.authenticatedBranch.empresaId, user.authenticatedBranch.filialId)
      if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
        this.hoje.setHours(this.hoje.getHours() + this.fuso);
        this.hojeCorrigido = new Date(this.hoje.getFullYear(), this.hoje.getMonth(), this.hoje.getDate(), 0).toISOString();
        this.dataSelecionada = this.hojeCorrigido;
      }
      else {
        this.hojeCorrigido = new Date(this.hoje.getFullYear(), this.hoje.getMonth(), this.hoje.getDate(), 0).toISOString();
        this.dataSelecionada = this.hojeCorrigido;
      }
      this.iOS = this.detectiOS();
      this.getScreenSize();
      this.getParametrosLight();
      this.checkIfWebBrowser();
      this.userData = JSON.parse(localStorage.getItem('one.user'));

      if (this.userData.authenticatedUser.nomeUsuario == "true") {
        const alert = await this.alertController.create({
          header: this.translate.instant('AGENDA.FORCELOGOUT'),
          message: this.translate.instant('AGENDA.ERROTERMINAL'),
          buttons: [{
            text: this.translate.instant('OK'),
            handler: () => {
              this.forcarLogout();
            }
          }
          ]
        });
        await alert.present();
      }

      this.profissionalId = this.userData.authenticatedUser.cliForColsId;
      this.logo = this.userData.authenticatedBranch.logoMarca;
      this.tipoLogin = localStorage.getItem('one.tipologin')
      if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
        let AbriuAgCorrigido = new Date(this.hoje.getFullYear(), this.hoje.getMonth(), this.hoje.getDate() + 1, 0).toISOString();
        this.getInfoProfissionaleAgenda(AbriuAgCorrigido.split('T')[0]);
        this.proximosAgendamentos(AbriuAgCorrigido.split('T')[0], AbriuAgCorrigido.split('T')[0]);
        this.getProfissionalBloq(AbriuAgCorrigido.split('T')[0], AbriuAgCorrigido.split('T')[0]);
      }
      else {
        this.getInfoProfissionaleAgenda(this.hojeCorrigido.split('T')[0]);
        this.proximosAgendamentos(this.hojeCorrigido.split('T')[0], this.hojeCorrigido.split('T')[0]);
        this.getProfissionalBloq(this.hojeCorrigido.split('T')[0], this.hojeCorrigido.split('T')[0]);
      }



      this.userCheck = JSON.parse(localStorage.getItem('one.user'));

      if (this.userCheck.claims['Serviços'] != null) {
        this.registerServicePermission = this.userData.claims['Serviços'].filter(x => x == "Visualizar") || this.userData.claims['Lançar serviços'].filter(x => x == "Visualizar");
      }

      if (this.userCheck.claims.Produtos != null) {
        this.registerProductPermission = this.userData.claims['Produtos'].filter(x => x == "Visualizar") || this.userData.claims['Lançar produtos'].filter(x => x == "Visualizar");
      }

      // Verifica se a data do agendamento é igual à atual
      this.eventoHoje();
      this.algumHorarioDisp = false; // setando valor default para verificação de disponibilidade alterar depois

      this.setNameSizeCut();

      this.agendaService.getClaims(this.userData.authenticatedBranch.empresaId, this.userData.authenticatedBranch.filialId).subscribe(
        res => {
          localStorage.setItem('claims', JSON.stringify(res));
        });
      this.claims = JSON.parse(localStorage.getItem('claims'));
      this.claims_Agenda = {
        Visualizar: this.claims.Agenda.indexOf("Visualizar") != -1 ? true : false,
        Agendar: this.claims.Agenda.indexOf("Agendar Serviço") != -1 ? true : false,
        Desmarcar: this.claims.Agenda.indexOf("Desmarcar Serviço") != -1 ? true : false,
        Editar: this.claims.Agenda.indexOf("Editar Agendamento") != -1 ? true : false,
        Bloquear: this.claims.Agenda.indexOf("Bloquear Agenda") != -1 ? true : false,
        Desbloquear: this.claims.Agenda.indexOf("Desbloquear Agenda") != -1 ? true : false,
      }
    });


    this.iOS = this.detectiOS();
    this.getScreenSize();
    this.getParametrosLight();
    this.checkIfWebBrowser();
    // document.getElementsByTagName('ion-card')[0].parentElement.parentElement.shadowRoot.getElementById('background-content').
    // style.background = "white"

    this.userData = JSON.parse(localStorage.getItem('one.user'));
    if (this.userData.authenticatedUser.nomeUsuario == "true") {
      const alert = await this.alertController.create({
        header: this.translate.instant('AGENDA.FORCELOGOUT'),
        message: this.translate.instant('AGENDA.ERROTERMINAL'),
        buttons: [{
          text: this.translate.instant('OK'),
          handler: () => {
            this.forcarLogout();
          }
        }
        ]
      });
      await alert.present();
    }

    this.profissionalId = this.userData.authenticatedUser.cliForColsId;
    this.logo = this.userData.authenticatedBranch.logoMarca;
    this.tipoLogin = localStorage.getItem('one.tipologin')
    this.getInfoProfissionaleAgenda(this.hojeCorrigido.split('T')[0]);

    this.getProfissionalBloq(this.hojeCorrigido.split('T')[0], this.hojeCorrigido.split('T')[0]);

    setTimeout(() => {
      this.proximosAgendamentos(this.hojeCorrigido.split('T')[0], this.hojeCorrigido.split('T')[0]);
    }, 500);

    this.userCheck = JSON.parse(localStorage.getItem('one.user'));

    if (this.userCheck.claims['Serviços'] != null) {
      this.registerServicePermission = this.userData.claims['Serviços'].filter(x => x == "Visualizar") || this.userData.claims['Lançar serviços'].filter(x => x == "Visualizar");
    }

    if (this.userCheck.claims.Produtos != null) {
      this.registerProductPermission = this.userData.claims['Produtos'].filter(x => x == "Visualizar") || this.userData.claims['Lançar produtos'].filter(x => x == "Visualizar");
    }

    // Verifica se a data do agendamento é igual à atual
    this.eventoHoje();
    this.algumHorarioDisp = false; // setando valor default para verificação de disponibilidade alterar depois

    this.setNameSizeCut();

    this.agendaService.getClaims(this.userData.authenticatedBranch.empresaId, this.userData.authenticatedBranch.filialId).subscribe(
      res => {
        localStorage.setItem('claims', JSON.stringify(res));
      });
    this.claims = JSON.parse(localStorage.getItem('claims'));
    this.claims_Agenda = {
      Visualizar: this.claims.Agenda.indexOf("Visualizar") != -1 ? true : false,
      Agendar: this.claims.Agenda.indexOf("Agendar Serviço") != -1 ? true : false,
      Desmarcar: this.claims.Agenda.indexOf("Desmarcar Serviço") != -1 ? true : false,
      Editar: this.claims.Agenda.indexOf("Editar Agendamento") != -1 ? true : false,
      Bloquear: this.claims.Agenda.indexOf("Bloquear Agenda") != -1 ? true : false,
      Desbloquear: this.claims.Agenda.indexOf("Desbloquear Agenda") != -1 ? true : false,
    }
    this.alertInadimplente()
  }

  async bannerWhatsApp(cidade) {

    var local = localStorage.getItem('bannerDiario')
    var pais = JSON.parse(localStorage.getItem('one.user')).authenticatedBranch.linguaPais;
    if ((local == null || local != new Date().toDateString()) && pais == "pt-BR" && (cidade.toLowerCase() == 'betim' || cidade.toLowerCase() == 'contagem' || cidade.toLowerCase() == 'belo horizonte')) {
      const alert = await this.alertController.create({
        cssClass: 'alertDiario',
        mode: "ios",
        message: "<div><img src='https://oneproducao.blob.core.windows.net/imgs/ONE BOT STORIES.gif'> </div>",
        buttons: [
          {
            text: "Saiba Mais",
            role: 'confirm',
            cssClass: 'confirmButton',
            handler: (blah) => {
              var url = 'https://api.whatsapp.com/send?phone=5531984533553&text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20a%20nova%20funcionalidade%20One%20Bot!'
              window.open(url, '_system');
              localStorage.setItem('bannerDiario', new Date().toDateString());
            }
          },
          {
            text: "Fechar",
            role: 'cancel',
            cssClass: 'cancelButton',
            handler: (blah) => {
              localStorage.setItem('bannerDiario', new Date().toDateString());
            }
          }
        ]
      });

      await alert.present();
    }
  }
  detectiOS() {
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)) {
      return true;
    } else {
      return false;
    }
  }

  getParametrosLight() {
    this.agendaService.getParametrosLight().subscribe(
      result => {
        this.parametrosLight = result;
      },
      fail => {
      }
    );
  }
  forcarLogout() {
    let name = environment.name;
    let lang = localStorage.getItem('one.lang')
    let rateData = localStorage.getItem('one.rate')
    let termosPolitica = localStorage.getItem('one.termosPolitica')
    let user = localStorage.getItem('one.user')
    let timestamp = localStorage.getItem('one.timestamp')
    let ratestamp = localStorage.getItem('one.ratestamp')
    localStorage.clear()
    localStorage.setItem('one.lang', lang);
    localStorage.setItem('one.user', user);
    localStorage.setItem('one.rate', rateData);
    localStorage.setItem('one.termosPolitica', termosPolitica)
    if (timestamp != null) localStorage.setItem('one.timestamp', timestamp)
    if (ratestamp != null) localStorage.setItem('one.ratestamp', ratestamp)
    var url = window.location.origin;
    //eh necessario testar se esta em producao, pois a url precisa do nome do applicativo
    document.location.href = environment.production ? `${url}/${this.basehref}/login` : document.location.href = `${url}/login`
  }
  updateDate(event: any) {
    this.getScreenSize()
    let eventString: string;

    if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
      let dataAgDateTime = new Date(event);
      dataAgDateTime.setHours(dataAgDateTime.getHours() + this.fuso);
      eventString = DateUtils.DateToString(dataAgDateTime);
      this.dataFormatada = new Date(eventString).toLocaleDateString(this.lang).split('T')[0];
    }
    else {
      this.dataFormatada = new Date(event).toLocaleDateString(this.lang).split('T')[0];
    }
    this.dataSelecionada = new Date(event);
    this.diaDaSemana = new Date(event).getDay();
    this.getInfoProfissionaleAgenda(this.dataFormatada);
    this.getProfissionalBloq(event, event);
    this.proximosAgendamentos(event, event);

    // Ajuste para não exibir os botões Agendar e Bloquear em datas passadas
    var dataselect = this.dataSelecionada.toISOString()?.split("T")[0]
    var datehojeCorrigido = this?.hojeCorrigido?.split("T")[0]
    this.diaHojeInit = dataselect >= datehojeCorrigido;
  }

  async alertInadimplente() {
    if (this.statusBoleto || this.mobilidadeInadimplente) {
      const alert = await this.alertController.create({
        header: this.translate.instant('AGENDA.INATIVO.PROFISSIONALALERT.HEADER'),
        message: this.translate.instant('AGENDA.INATIVO.PROFISSIONALALERT.MESSAGE'),
        buttons: [{
          text: 'OK',
          handler: () => {
            this.forcarLogout();
          }
        }
        ],
        backdropDismiss: false
      });
      await alert.present();
    }
  }
  getMobilidade(empresaId: number, filialId: number) {
    this.agendaService.getEmpresaPorMobilidade(empresaId, filialId).subscribe(
      result => {
        this.mobilidadeInadimplente = result;
        this.alertInadimplente()
      },
      async fail => {
      }
    )
  }
  getStatusInadimplente() {
    this.agendaService.getONiboBoletoApp().subscribe(
      result => {
        this.statusBoleto = result;
      },
      async fail => {
      }
    )
  }

  async proximosAgendamentos(dataInicial: any, dataFinal: any, marcouAgenda: boolean = false) {

    let diaAtual = new Date(dataInicial);
    if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
      diaAtual.setHours(this.hoje.getHours() + this.fuso);
      dataInicial = diaAtual.toISOString().split('T')[0];
      dataFinal = diaAtual.toISOString().split('T')[0];
    }
    else {
      dataInicial = diaAtual.toISOString().split('T')[0];
      dataFinal = diaAtual.toISOString().split('T')[0];
    }
    this.checkCarregamento = false;
    await this.loadingService.present();
    this.agendaService.getProfissionalAgendamentos(dataInicial, dataFinal).subscribe(
      result => {
        this.agendamentos = result;
        this.agendamentos.map(x => {
          x.dataAg = new Date(x.dataAg);
        });

        this.agendamentos = this.listProfissionalBloq?.concat(this.agendamentos);

        const HorariosDisponiveis = [];


        if (this.agendamentos?.length != 0) {
          // ordena os agendamentos em ordem crescente de horário de inicio
          this.agendamentos.sort((a, b) => (a.horarioInicio > b.horarioInicio) ? 1 : ((b.horarioInicio > a.horarioInicio) ? -1 : 0));
          let horarioPrimeiroAgendamento = this.agendamentos[0]?.horarioInicio;
          let horarioUltimoAgendamento = this.agendamentos[this.agendamentos?.length - 1]?.horarioFim;
          let horarioFinalMestre = this.agendamentos[0]?.horarioFim;
          // === responsável por criar os intervalos de horários livres ===
          for (let i = 0; i < this.agendamentos?.length - 1; i++) {
            if (this.agendamentos[i].horarioFim > horarioFinalMestre) {
              horarioFinalMestre = this.agendamentos[i].horarioFim;
            }
            for (let j = i + 1; j < this.agendamentos?.length; j++) {
              if (this.agendamentos[i].horarioFim == this.agendamentos[j].horarioInicio) break //Quando n existe folga entre marcações
              else if (this.agendamentos[i].horarioFim < this.agendamentos[j].horarioInicio && this.agendamentos[i].horarioFim == horarioFinalMestre) {// && this.agendamentos[i].horarioFim <= this.agendamentos[i+1].horarioInicio

                HorariosDisponiveis.push({
                  dia: dataInicial,
                  horarioInicio: this.agendamentos[i].horarioFim,
                  horarioFim: this.agendamentos[j].horarioInicio,
                  horarioLivre: 1,
                  agendaId: -1
                });

                break
              }
              else if (this.agendamentos[i].horarioFim < this.agendamentos[j].horarioFim) {
                break
              }
            }
          }
          HorariosDisponiveis.map(x => {
            this.agendamentos.push(x);
          });
          this.agendamentos.sort((a, b) => (a.horarioInicio > b.horarioInicio) ? 1 : ((b.horarioInicio > a.horarioInicio) ? -1 : 0)); // ordena os agendamentos em ordem crescente de horário de inicio
          if (this.infoProfissionaleAgenda?.horarioInicioProfissional != horarioPrimeiroAgendamento) {
            this.agendamentos.unshift({
              dia: dataInicial,
              horarioInicio: this.infoProfissionaleAgenda?.horarioInicioProfissional,
              horarioFim: horarioPrimeiroAgendamento, horarioLivre: 1, agendaId: -1
            });
          }
          if (horarioUltimoAgendamento != this.infoProfissionaleAgenda?.horarioFimProfissional) {
            this.agendamentos.push({
              dia: dataInicial, horarioInicio: horarioUltimoAgendamento,
              horarioFim: this.infoProfissionaleAgenda?.horarioFimProfissional, horarioLivre: 1, agendaId: -1
            });
          }
        } else {
          if (this.infoProfissionaleAgenda?.horarioInicioProfissional != null) {
            this.agendamentos.push({
              dia: dataInicial,
              horarioInicio: this.infoProfissionaleAgenda?.horarioInicioProfissional,
              horarioFim: this.infoProfissionaleAgenda?.horarioFimProfissional,
              horarioLivre: 1,
              agendaId: -1
            });
          }
        }
        this.checkCarregamento = true;
        this.ref.markForCheck();
        this.loadingService.dismiss();
      },
      fail => {
        this.loadingService.dismiss();
      }
    );
    this.algumHorarioDisp = false;

    if (this.agendamentos !== undefined) {
      for (var i = 0; i < this.agendamentos?.length; i++) {
        if (this.agendamentos[i].horarioLivre != undefined && this.agendamentos[i].horarioLivre == 1) {
          this.indexhorarioDisp = i;
          this.algumHorarioDisp = true;
          break;
        }
      }
    }
  }

  verificaHorarios() {
    this.algumHorarioDisp = false;
    if (this.agendamentos !== undefined) {
      for (var i = 0; i < this.agendamentos?.length; i++) {
        if (this.agendamentos[i].horarioLivre != undefined && this.agendamentos[i].horarioLivre == 1) {
          this.indexhorarioDisp = i;
          this.algumHorarioDisp = true;
          break;
        }
      }
    }

    return true;
  }

  showAppointmentDetails(index: number): void {
    if (this.agendamentoSelecionadoIndex === index) {
      return;
    } else {
      if (this.agendamentoSelecionadoIndex == null) {
        this.agendamentoSelecionadoIndex = 0;
      }

      const agendamentoCard = document.getElementsByClassName('agendamento') as HTMLCollectionOf<HTMLElement>;
      // let playButtons = document.getElementsByClassName('controlStyleButton') as HTMLCollectionOf<HTMLElement>;
      // let horarioInicioCard = document.getElementsByClassName('horarioControl') as HTMLCollectionOf<HTMLElement>;

      if (agendamentoCard[this.agendamentoSelecionadoIndex] === undefined) {
        this.agendamentoSelecionadoIndex = 0;
      }

      // agendamentoCard[this.agendamentoSelecionadoIndex].style.border = 'none'
      agendamentoCard[this.agendamentoSelecionadoIndex].style.border = 'unset';
      agendamentoCard[index].style.border = '1px solid var(--ion-color-secondary)';

      this.agendamentoSelecionadoIndex = index;
    }
    this.agendamentoSelecionadoIndex = index;
  }

  async addAppointment() {
    const modal = await this.modalController.create({
      component: NovoAgendamentoProfissionalComponent,
      componentProps: {
        parametrosLight: this.parametrosLight,
        userData: this.userData,
        dataAg: this.dataSelecionada,
        dataSelecionada: new Date(this.dataSelecionada),
        profissionalId: this.profissionalId
      },
    });
    modal.onDidDismiss().then(retorno => {

      if (retorno.data != undefined) {
        this.proximosAgendamentos(this.dataSelecionada, this.dataSelecionada, true);
      }
    });

    return await modal.present();
  }

  async deleteAppointment(index: number) {
    const agendamento = this.agendamentos[index];
    const pos = this.agendamentos.indexOf(agendamento);
    await this.loadingService.present();
    this.agendaService.desmarcarBloqueioProfissional(agendamento.agendaId).subscribe(
      result => {

        this.agendamentos.splice(pos, 1);

        const data = new Date(this.dataSelecionada).toISOString().split('T')[0];
        this.getProfissionalBloq(data, data);


        this.loadingService.dismiss();
      },
      fail => {
        this.loadingService.dismiss();
      }
    );
  }

  async resumoAgendamento(index: number) {
    const agendamento = this.agendamentos[index];
    const modal = await this.modalController.create({
      component: ResumoAgendamentoProfissionalComponent,
      componentProps: {
        registerServicePermission: this.registerServicePermission,
        registerProductPermission: this.registerProductPermission,
        userData: this.userData,
        dataSelecionada: this.dataSelecionada,
        dadosAgendamento: agendamento,
        possuiFicha: true,
        naotemcliente: true
      },
    });

    return await modal.present();
  }

  setBorderStatus(status: string) {
    switch (status) {
      case 'A':
        this.corStatus = '#45c7ff';
        return '7px solid #45c7ff';
      case 'P':
        this.corStatus = '#C2D69B';
        return '7px solid #C2D69B';
      case 'E':
        this.corStatus = '#365F91';
        return '7px solid #365F91';
      case 'C':
        this.corStatus = '#95B3D6';
        return '7px solid #95B3D6';
      case 'R':
        this.corStatus = '#7F7F7F';
        return '7px solid #7F7F7F';
      case 'M':
        this.corStatus = '#E36C0A';
        return '7px solid #E36C0A';
      case 'N':
        this.corStatus = '#86592D';
        return '7px solid #86592D';
      case 'X':
        this.corStatus = '#1B6104';
        return '7px solid #1B6104';
      case 'B':
        this.corStatus = 'var(--ion-color-danger)';
        return '7px solid var(--ion-color-danger)';
      default:
        this.corStatus = '#A700FF';
        return '7px solid #A700FF';
    }
  }
  setBorderStatusOther(status: string) {
    switch (status) {
      case 'A':
        this.corStatus = '#45c7ff';
        return '1px solid #45c7ff';
      case 'P':
        this.corStatus = '#C2D69B';
        return '1px solid #C2D69B';
      case 'E':
        this.corStatus = '#365F91';
        return '1px solid #365F91';
      case 'C':
        this.corStatus = '#95B3D6';
        return '1px solid #95B3D6';
      case 'R':
        this.corStatus = '#7F7F7F';
        return '7px solid #7F7F7F';
      case 'M':
        this.corStatus = '#E36C0A';
        return '1px solid #E36C0A';
      case 'N':
        this.corStatus = '#86592D';
        return '1px solid #86592D';
      case 'X':
        this.corStatus = '#1B6104';
        return '1px solid #1B6104';
      case 'B':
        this.corStatus = 'var(--ion-color-danger)';
        return '1px solid var(--ion-color-danger)';
      default:
        this.corStatus = '#A700FF';
        return '1px solid #A700FF';
    }
  }


  iniciarAtendimento(index: number) {
    this.loadingService.present();
    this.agendaService.statusEmAtendimento(this.agendamentos[index].agendaId).subscribe(
      result => {
        this.proximosAgendamentos(this.dataSelecionada, this.dataSelecionada);
        this.loadingService.dismiss();

      },
      fail => {
      }
    );
  }

  async deleteAppointmentAlert(index: number) {
    const alert = await this.alertController.create({
      header: this.translate.instant('AGENDA.APPOINTMENT.DESMARCARALERT.HEADER'),
      message: this.translate.instant('AGENDA.APPOINTMENT.DESMARCARALERT.MESSAGE'),
      buttons: [
        {
          text: this.translate.instant('AGENDA.APPOINTMENT.DESMARCARALERT.CANCELAR'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: this.translate.instant('AGENDA.APPOINTMENT.DESMARCARALERT.EXCLUIR'),
          handler: () => {
            this.loadingService.present();
            this.deleteAppointment(index);

          }
        }
      ],
      backdropDismiss: false,
    });

    await alert.present();
  }

  async maisOpcoesModal(index: number) {


    if (this.agendamentos[index].horarioLivre != undefined && this.agendamentos[index].horarioLivre == 1 && !this.maisOpcoesFlag) {
      this.maisOpcoesFlag = true;
      const modal = await this.modalController.create({
        component: OpcoesHorariolivreComponent,
        componentProps: {
          parametrosLight: this.parametrosLight,
          dadosAgendamento: this.agendamentos[index],
          dataSelecionada: this.dataSelecionada,
          infoProfissionaleAgenda: this.infoProfissionaleAgenda,
          profissionalId: this.profissionalId,
          registerServicePermission: this.registerServicePermission,
          registerProductPermission: this.registerProductPermission,
          userData: this.userData,
        },
        backdropDismiss: false,
        cssClass: 'maisOpcoesHorarioLivreModal'
      });
      modal.onDidDismiss().then(retorno => {
        this.maisOpcoesFlag = false;

        if (retorno.data) {
          if (retorno.data.bloqueio == 1) { // significa que foi criado um bloqueio
            this.agendamentos.push(retorno.data);
            this.agendamentos.sort((a, b) => (a.horarioInicio > b.horarioInicio) ? 1 : ((b.horarioInicio > a.horarioInicio) ? -1 : 0));
            this.GeraouRemoveHorariosLivres(retorno.data);
          }
        }

        if (retorno != undefined) {
          this.proximosAgendamentos(this.dataSelecionada, this.dataSelecionada);

        }
      });
      return await modal.present();
    } else if (this.agendamentos[index].bloqueio != undefined && this.agendamentos[index].bloqueio == 1 && !this.maisOpcoesFlag) {
      this.maisOpcoesFlag = true;
      const modal = await this.modalController.create({
        component: OpcoesBloqueioComponent,
        componentProps: {
          parametrosLight: this.parametrosLight,
          dadosAgendamento: this.agendamentos[index],
          infoProfissionaleAgenda: this.infoProfissionaleAgenda
        },
        backdropDismiss: false,
        cssClass: 'maisOpcoesBloqueioModal maisOpcoesModal'

      });
      modal.onDidDismiss().then(retorno => {
        this.maisOpcoesFlag = false;

        if (retorno.data != 0) {


          const indexElemento = this.agendamentos.indexOf(retorno.data);

          this.agendamentos = this.agendamentos.filter(x => x != retorno.data);

          // this.proximosAgendamentos()


          // tratamento para que não haja dois cards de horários livres em sequencia, devido a exclusão de uma marcação(ou seja, quando houver eles serão transformados em um unico card)
          for (let i = 0; i < this.agendamentos?.length; i++) {
            if (this.agendamentos[i + 1] != undefined) {
              if (this.agendamentos[i].horarioLivre == 1 && this.agendamentos[i + 1].horarioLivre == 1) { // checo se há dois cards de horário livre em sequencia
                this.agendamentos[i].horarioFim = this.agendamentos[i + 1].horarioFim; // concatena o horario de término de ambos
                this.agendamentos.splice(i + 1, 1); // remove um dos horários livres
              }
            }
          }

          if (indexElemento <= this.agendamentos?.length - 1) { // se ele entrar aqui significa que o elemento não era o ultimo portanto é necessário checar o anterior e o posterior
            // importante lembrar que o indexElemento nesse ponto não representa mais a posição do elemento inicial, pois o mesmo foi removido, e sim representa a posição do elemento que era posterior a ele

            if (indexElemento == 0) {
              if (this.agendamentos[indexElemento].horarioLivre == 1) {
                this.agendamentos[indexElemento].horarioInicio = this.infoProfissionaleAgenda?.horarioInicioProfissional;
              }
            } else if (this.agendamentos[indexElemento].horarioLivre == 1 && this.agendamentos[indexElemento - 1] != undefined) {
              if (this.agendamentos[indexElemento].horarioInicio != this.agendamentos[indexElemento - 1].horarioFim) {
                this.agendamentos[indexElemento].horarioInicio = this.agendamentos[indexElemento - 1].horarioFim;
              }
            }
            // this.agendamentos = this.agendamentos.filter(x => x != retorno.data)

          }
        }
      });

      return await modal.present();

    } else if (!this.maisOpcoesFlag) {
      this.maisOpcoesFlag = true;
      const modal = await this.modalController.create({
        component: OpcoesAgendamentoComponent,
        componentProps: {
          parametrosLight: this.parametrosLight,
          registerServicePermission: this.registerServicePermission,
          registerProductPermission: this.registerProductPermission,
          userData: this.userData,
          dataSelecionada: this.dataSelecionada,
          dadosAgendamento: this.agendamentos[index],
          profissionalId: this.profissionalId
        },
        backdropDismiss: false,
        cssClass: 'maisOpcoesModal'
      });
      modal.onDidDismiss().then(retorno => {
        this.maisOpcoesFlag = false;

        if (retorno.data != 0) {
          if (retorno.data.edited == false) {
            // this.proximosAgendamentos()


            // tratamento para que não haja dois cards de horários livres em sequencia, devido a exclusão de uma marcação(ou seja, quando houver eles serão transformados em um unico card)
            for (let i = 0; i < this.agendamentos?.length; i++) {
              if (this.agendamentos[i + 1] != undefined) {
                if (this.agendamentos[i].horarioLivre == 1 && this.agendamentos[i + 1].horarioLivre == 1) { // checo se há dois cards de horário livre em sequencia
                  this.agendamentos[i].horarioFim = this.agendamentos[i + 1].horarioFim; // concatena o horario de término de ambos
                  this.agendamentos.splice(i + 1, 1); // remove um dos horários livres
                }
              }
            }
          } else if (retorno.data.edited == true) {


            const agendamento = this.agendamentos.filter(x => retorno.data.agendamento.data.agendamento.agendasId == x.agendaId)[0];
            agendamento.horarioFim = retorno.data.agendamento.data.agendamento.horarioFim;
            agendamento.horarioInicio = retorno.data.agendamento.data.agendamento.horarioInicio;
            agendamento.servicoId = retorno.data.agendamento.data.agendamento.servicoId;
            agendamento.observacao = retorno.data.agendamento.data.agendamento.observacao;
            retorno.data.agendamento.data.servico != undefined ? agendamento.descricaoServico = retorno.data.agendamento.data.servico.nomeServico : agendamento.descricaoServico = agendamento.descricaoServico;
            this.agendamentos = this.agendamentos.filter(x => retorno.data.agendamento.data.agendamento.agendasId != x.agendaId);
            this.agendamentos.push(agendamento);
            this.agendamentos.sort((a, b) => (a.horarioInicio > b.horarioInicio) ? 1 : ((b.horarioInicio > a.horarioInicio) ? -1 : 0));

            this.GeraouRemoveHorariosLivres(agendamento);

            // tratamento para que não haja dois cards de horários livres em sequencia, devido a exclusão de uma marcação(ou seja, quando houver eles serão transformados em um unico card)
            for (let i = 0; i < this.agendamentos?.length; i++) {
              if (this.agendamentos[i + 1] != undefined) {
                if (this.agendamentos[i].horarioLivre == 1 && this.agendamentos[i + 1].horarioLivre == 1) { // checo se há dois cards de horário livre em sequencia
                  this.agendamentos[i].horarioFim = this.agendamentos[i + 1].horarioFim; // concatena o horario de término de ambos
                  this.agendamentos.splice(i + 1, 1); // remove um dos horários livres
                }
              }
            }

          } else if (retorno.data.status.data == 'E') { // editar status para "executado pelo profissional"
            const agendamento = this.agendamentos.filter(x => x.agendaId == retorno.data.agendaId)[0];
            agendamento.status = 'E';
            this.agendamentos = this.agendamentos.filter(x => retorno.data.agendaId != x.agendaId);
            this.agendamentos.push(agendamento);
            this.agendamentos.sort((a, b) => (a.horarioInicio > b.horarioInicio) ? 1 : ((b.horarioInicio > a.horarioInicio) ? -1 : 0));
          } else {
            this.agendamentos = this.agendamentos.filter(x => x != retorno.data);

            // tratamento para que não haja dois cards de horários livres em sequencia, devido a exclusão de uma marcação(ou seja, quando houver eles serão transformados em um unico card)
            for (let i = 0; i < this.agendamentos?.length; i++) {
              if (this.agendamentos[i + 1] != undefined) {
                if (this.agendamentos[i].horarioLivre == 1 && this.agendamentos[i + 1].horarioLivre == 1) { // checo se há dois cards de horário livre em sequencia
                  this.agendamentos[i].horarioFim = this.agendamentos[i + 1].horarioFim; // concatena o horario de término de ambos
                  this.agendamentos.splice(i + 1, 1); // remove um dos horários livres
                }
              }
            }
          }


          // this.GeraouRemoveHorariosLivres(retorno.data)


        }
        this.proximosAgendamentos(this.dataSelecionada, this.dataSelecionada);
      });

      return await modal.present();
    }

  }


  getInfoProfissionaleAgenda(date) {
    let diaAtual: Date;
    let data: string;
    if (date[4] == '-') {
      const [year, month, day] = date.split('-');
      diaAtual = new Date(+year, +month - 1, +day);
    }
    else {
      const [day, month, year] = date.split('/');
      diaAtual = new Date(+year, +month - 1, +day);
    }
    if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
      diaAtual.setHours(diaAtual.getHours() + this.fuso);
      data = diaAtual.toISOString().split('T')[0];
    }
    else {
      data = diaAtual.toISOString().split('T')[0];
    }

    this.agendaService.getinfoProfissionaleAgenda(data).subscribe(
      result => {
        this.infoProfissionaleAgenda = result;
        this.didInit = true
      },
      async fail => {
        const alert = await this.alertController.create({
          header: this.translate.instant('AGENDA.FORCELOGOUT'),
          message: this.translate.instant('AGENDA.ERROTERMINAL'),
          buttons: [{
            text: this.translate.instant('OK'),
            handler: () => {
              this.forcarLogout();
            }
          }]
        });
        await alert.present();
      }
    );
  }

  getProfissionalBloq(dataInicial, dataFinal) {
    let diaAtual = new Date(dataInicial);
    if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
      diaAtual.setHours(this.hoje.getHours() + this.fuso);
      dataInicial = diaAtual.toISOString().split('T')[0];
      dataFinal = diaAtual.toISOString().split('T')[0];
    }
    this.agendaService.getProfissionalBloqueio(dataInicial, dataFinal).then(
      result => {
        this.listProfissionalBloq = result;
        this.listProfissionalBloq.map(x => x.bloqueio = 1); // usado para checar o template no html
        this.listProfissionalBloq.map(x => x.status = 'B'); // esse valor é usado para settar a cor da borda

      },
      fail => {

      }
    );
  }


  GeraouRemoveHorariosLivres(bloqueio) { // a chamada dessa função deve ocorrer com os elementos do this.agendamentos ja ordenados


    let horarioPrimeiroAgendamento;
    let horarioUltimoAgendamento;
    const HorariosDisponiveis = [];

    let indexElemento = this.agendamentos.indexOf(bloqueio);
    if (indexElemento != 0 && indexElemento != this.agendamentos?.length - 1) {
      if (this.agendamentos[indexElemento].horarioFim != this.agendamentos[indexElemento + 1].horarioInicio) {
        this.agendamentos.push({
          dia: this.dataSelecionada,
          horarioInicio: this.agendamentos[indexElemento].horarioFim,
          horarioFim: this.agendamentos[indexElemento + 1].horarioInicio,
          horarioLivre: 1,
          agendaId: -1
        });
      }

    }
    if (indexElemento != 0 && this.agendamentos[indexElemento - 1].horarioLivre == 1 && this.agendamentos[indexElemento - 1].horarioFim > this.agendamentos[indexElemento].horarioInicio) {
      this.agendamentos[indexElemento - 1].horarioFim = this.agendamentos[indexElemento].horarioInicio;

      if (this.agendamentos[indexElemento - 1].horarioFim == this.agendamentos[indexElemento - 1].horarioInicio) {
        this.agendamentos.splice(indexElemento - 1, 1);
        indexElemento = this.agendamentos.indexOf(bloqueio); // é necessario atualizar o indice após a remoção de algum elemento
      }
    }


    if (indexElemento == this.agendamentos?.length - 1) {
      if (this.agendamentos[indexElemento].horarioFim != this.infoProfissionaleAgenda?.horarioFimProfissional) {
        this.agendamentos.push({
          dia: this.dataSelecionada,
          horarioInicio: this.agendamentos[indexElemento].horarioFim,
          horarioFim: this.infoProfissionaleAgenda?.horarioFimProfissional,
          horarioLivre: 1,
          agendaId: -1
        });
      }
    }

    // let elemento = this.agendamentos[this.agendamentos?.length-1]
    this.agendamentos.sort((a, b) => (a.horarioInicio > b.horarioInicio) ? 1 : ((b.horarioInicio > a.horarioInicio) ? -1 : 0)); // ordena os agendamentos em ordem crescente de horário de inicio
    // indexElemento = this.agendamentos.indexOf(elemento)
    // if(indexElemento != 0){

    // }


  }


  checkIfWebBrowser() {

    if (Capacitor.getPlatform() == 'web') {
      this.webBrowser = true;
    }
  }


  onResize(event: any) {
    this.getScreenSize();
  }

  updateAppointmentList(event: any) {
    this.infoProfissionaleAgenda
    this.algumHorarioDisp
    this.overlayDivControl = true;
    this.getScreenSize();
    this.getParametrosLight();
    this.checkIfWebBrowser();
    // document.getElementsByTagName('ion-card')[0].parentElement.parentElement.shadowRoot.getElementById('background-content').style.background = "white"

    this.userData = JSON.parse(localStorage.getItem('one.user'));
    this.profissionalId = this.userData.authenticatedUser.cliForColsId;

    this.logo = this.userData.authenticatedBranch.logoMarca;


    const data = new Date(this.dataSelecionada).toISOString().split('T')[0];

    this.getInfoProfissionaleAgenda(data);
    this.getProfissionalBloq(data, data);
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
    this.proximosAgendamentos(this.dataSelecionada, this.dataSelecionada, true);
    setTimeout(() => {
      this.overlayDivControl = false;
      event.target.complete();
    }, 2000);
  }

  async criarBloqueioModal(index: number) {
    const modal = await this.modalController.create({
      component: NovoBloqueioComponent,
      componentProps: {
        dadosAgendamento: this.agendamentos[index],
        infoProfissionaleAgenda: this.infoProfissionaleAgenda,
        profissionalId: this.profissionalId,
      },
      backdropDismiss: false,
    });

    modal.onDidDismiss().then(retorno => {
      if (retorno.data !== 0 && retorno.data !== undefined && retorno.data !== null) {
        document.getElementsByTagName('ion-modal')[0].dismiss(retorno.data);
        this.agendamentos.push(retorno.data);
        this.agendamentos.sort((a, b) => (a.horarioInicio > b.horarioInicio) ? 1 : ((b.horarioInicio > a.horarioInicio) ? -1 : 0));
        this.GeraouRemoveHorariosLivres(retorno.data);
      }
    });
    return await modal.present();
  }

  async editarObsBloqueioModal(index: number) {
    const modal = await this.modalController.create({
      component: EditarObservacaoBloqueioComponent,
      componentProps: {
        observacao: this.agendamentos[index].observacao,
        agendaId: this.agendamentos[index].agendaId
      },
      backdropDismiss: false,
      cssClass: 'obsBloqueio'

    });

    modal.onDidDismiss().then(retorno => {
      if (retorno.data !== 0 && retorno.data !== undefined && retorno.data !== null) {
        this.agendamentos[index].observacao = retorno.data.observacao;
      }
    });
    return await modal.present();
  }

  eventoHoje() {
    const diaHojeAux = this.hojeCorrigido.split('T')[0];
    this.dataHojeIniciarAtendimento = diaHojeAux + 'T00:00:00';
  }

  addDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + (days));
    return date;
  }

  // Método para calcular o tamanho do nome a ser exibido
  setNameSizeCut() {
    if (this.screenWidth >= 370) { this.nameSizeCut = 16; }
    else { this.nameSizeCut = 9; }
  }

  async deleteBlockAlert(index: number) {
    const alert = await this.alertController.create({
      header: this.translate.instant('AGENDA.APPOINTMENT.DESMARCARALERT.HEADERBLOQUEIO'),
      message: this.translate.instant('AGENDA.APPOINTMENT.DESMARCARALERT.MESSAGEBLOQUEIO'),
      buttons: [
        {
          text: this.translate.instant('AGENDA.APPOINTMENT.DESMARCARALERT.CANCELAR'),
          role: 'cancel',
          cssClass: 'cancelButton',
          handler: (blah) => {
          }
        }, {
          text: this.translate.instant('AGENDA.APPOINTMENT.DESMARCARALERT.REMOVERBLOQUEIO'),
          handler: () => {
            this.loadingService.present();
            this.deleteAppointment(index);

          }
        }
      ],
      backdropDismiss: false,
    });

    await alert.present();
  }

  private configBackButton() {
    // sair do app ao clicar em voltar no celular
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        App.exitApp();
      }
    });
  }
}

import { Component, OnInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { AgendaService } from '../services/agenda.service'
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoadingService } from '../../core/services/loading.service';
import { ColaboradorPesquisadoModel } from '../models/colaboradorPesquisadoModel'
import { ChangeDetectorRef } from '@angular/core'
import { AlertController, IonRouterOutlet, ModalController, Platform } from '@ionic/angular';
import { OpcoesAgendamentoComponent } from '../modals/opcoes-agendamento/opcoes-agendamento.component'
import { OpcoesHorariolivreComponent } from '../modals/opcoes-horariolivre/opcoes-horariolivre.component'
import { OpcoesBloqueioComponent } from '../modals/opcoes-bloqueio/opcoes-bloqueio.component'
import { NovoAgendamentoProfissionalComponent } from '../modals/novo-agendamento-profissional/novo-agendamento-profissional.component'
import { Capacitor } from '@capacitor/core';
import { ResumoAgendamentoProfissionalComponent } from '../modals/resumo-agendamento-profissional/resumo-agendamento-profissional.component';
import { NovoBloqueioComponent } from '../modals/novo-bloqueio/novo-bloqueio.component';
import { InfoProfissionaleAgendaModel } from '../models/infoProfissionaleAgendaModel';
import { TranslateService } from '@ngx-translate/core';
import { EditarObservacaoBloqueioComponent } from '../modals/editar-observacao-bloqueio/editar-observacao-bloqueio.component';
import { ParametrosLightModel } from '../models/parametrosLightModel';
import { LoginService } from 'app/login/services/login.service';
import { DateUtils } from 'app/core/common/data-type-utils/date-utils';
import { App } from '@capacitor/app';

// Para o Capacitor 3
// import { Plugins } from '@capacitor/core';
// const { App } = Plugins;

@Component({
  selector: 'app-agenda-gestor',
  templateUrl: './agenda-gestor.component.html',
  styleUrls: ['./agenda-gestor.component.scss'],
})
export class AgendaGestorComponent implements OnInit {

  public dataSelecionada: any = new Date().toISOString()//.split('T')[0];
  public infoProfissionaleAgenda: InfoProfissionaleAgendaModel;
  public profissionalId: number;
  public dadosAgendamento: any;

  public pesquisaColaboradorLoader: boolean = false;
  public listColaboradoresAgendaveis: any = [];
  public listaColaboradoresPesquisados: any = [];
  public agendamentos: any = [];
  public colaboradorSelecionado: ColaboradorPesquisadoModel;
  public infoColaboradorAgenda: any;
  public fuso: any;
  public linguaPais: any;
  public agendamentoSelecionadoIndex: number;
  //public infoProfissionaleAgenda: any;
  public addAppointmentButtonHeight: any;
  public cardHeight: any;
  public registerProductPermission: any;
  public registerServicePermission: any;
  private userData: any;
  public lang = JSON.parse(localStorage.getItem('one.user')).authenticatedBranch.linguaPais
  public dataInicial: any = new Date();
  public dataFormatada: string = new Date().toLocaleDateString(this.lang).split('T')[0];
  public diaDaSemana: number = new Date().getDay();
  public listProfissionalBloq: any;
  public iOS: boolean;
  public mobilidadeInadimplente: boolean;
  public corStatus: string;
  public algumHorarioDisp: boolean;
  public indexhorarioDisp: any;
  public dataHojeIniciarAtendimento: any;
  public hoje = new Date();
  public parametrosLight: ParametrosLightModel;
  public hojeCorrigido = new Date(this.hoje.getFullYear(), this.hoje.getMonth(), this.hoje.getDate(), 0).toISOString();

  public infoAgendaVaziaBoolean: boolean = false;
  public webBrowser: boolean = false;
  public statusBoleto: boolean;
  public nameSizeCut: number;

  screenWidth: number;
  screenHeight: number;
  public temHorario: boolean = false;
  public carregouAgendamentos: boolean = false;
  public selecionouColaborador: boolean = false;

  public basehref: any;

  //@HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.addAppointmentButtonHeight = this.iOS ? this.screenHeight - 184 : this.screenHeight - 190;
    this.addAppointmentButtonHeight = this.addAppointmentButtonHeight.toString() + 'px'
    var tamanhoCards = localStorage.getItem('calendarioExpandido') == '0' ? 110 : 315;
    this.cardHeight = this.screenHeight - tamanhoCards;
    this.cardHeight = this.cardHeight.toString() + "px";
  }


  constructor(private agendaService: AgendaService,
    private LoadingService: LoadingService,
    private ref: ChangeDetectorRef,
    private ModalController: ModalController,
    private alertController: AlertController,
    public translate: TranslateService,
    private routerOutlet: IonRouterOutlet,
    private platform: Platform,
    private loginService: LoginService
  ) { this.configBackButton(); }

  async ngOnInit() {
    this.sendMessage(0, 0);
    this.basehref = localStorage.getItem('basehref')
    let user = JSON.parse(localStorage.getItem('one.user'));
    let filial = user.authenticatedBranch;
    this.getMobilidade(user.authenticatedBranch.empresaId, user.authenticatedBranch.filialId)
    this.fuso = parseInt(filial.fuso, 10);
    this.linguaPais = filial.linguaPais
    this.getParametrosLight()
    if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
      //this.hoje.setHours(this.hoje.getHours() + this.fuso);
      this.hojeCorrigido = new Date(this.hoje.getFullYear(), this.hoje.getMonth(), this.hoje.getDate(), 0).toISOString();
      this.dataSelecionada = this.hojeCorrigido;
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
      this.linguaPais = filial.linguaPais
      this.getParametrosLight()
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
      this.getParametrosLight()

      this.userData = JSON.parse(localStorage.getItem('one.user'))
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
      //this.getInfoProfissionaleAgenda(new Date().toISOString().split('T')[0]);
      this.iOS = this.detectiOS();
      this.getColaboradores("*")
      this.getScreenSize();
      this.checkIfWebBrowser()
      //CliForCols/PesquisarColaboradoresAgendaveis
      //OAgenda/GetAgendamentosProfissional
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
      // Verifica se a data do agendamento é igual à atual
      this.eventoHoje();
      this.algumHorarioDisp = false; // setando valor default para verificação de disponibilidade alterar depois
      this.setNameSizeCut();
      this.agendaService.getClaims(this.userData.authenticatedBranch.empresaId, this.userData.authenticatedBranch.filialId).subscribe(
        res => {
          localStorage.setItem('claims', JSON.stringify(res));
        });
    });
    this.getParametrosLight()
    document.getElementsByTagName('app-calendario')[0].getElementsByTagName('ion-content')[0].style.height = "150px"

    this.userData = JSON.parse(localStorage.getItem('one.user'))
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
    //this.getInfoProfissionaleAgenda(new Date().toISOString().split('T')[0]);
    this.iOS = this.detectiOS();
    this.getColaboradores("*")
    this.getScreenSize();
    this.checkIfWebBrowser()
    //CliForCols/PesquisarColaboradoresAgendaveis
    //OAgenda/GetAgendamentosProfissional
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

    // Verifica se a data do agendamento é igual à atual
    this.eventoHoje();
    this.algumHorarioDisp = false; // setando valor default para verificação de disponibilidade alterar depois
    this.setNameSizeCut();
    this.agendaService.getClaims(this.userData.authenticatedBranch.empresaId, this.userData.authenticatedBranch.filialId).subscribe(
      res => {
        localStorage.setItem('claims', JSON.stringify(res));
      });
    this.alertInadimplente();
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
  getParametrosLight() {
    this.agendaService.getParametrosLight().subscribe(
      result => {
        this.parametrosLight = result;
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
  async alertInadimplente() {
    if (this.statusBoleto || this.mobilidadeInadimplente) {
      const alert = await this.alertController.create({
        header: this.translate.instant('AGENDA.INATIVO.GESTORALERT.HEADER'),
        message: this.translate.instant('AGENDA.INATIVO.GESTORALERT.MESSAGE'),
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

  private configBackButton() {
    // sair do app ao clicar em voltar no celular
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        App.exitApp();
      }
    });
  }

  updateDate(event: any) {
    this.getScreenSize();
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
    this.dataSelecionada = new Date(new Date(event).getFullYear(), new Date(event).getMonth(), new Date(event).getDate(), 0).toISOString();
    this.diaDaSemana = new Date(event).getDay();
    if (this.colaboradorSelecionado?.profissionalId !== undefined) {
      this.updateAppointmentList(event)
      this.temHorario = false;
      this.carregouAgendamentos = false;
      //this.getProfissionalBloq(event, event)
    }
    //this.proximosAgendamentos(event, event)
  }
  async editarObsBloqueioModal(index: number) {
    const modal = await this.ModalController.create({
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

  getStatusInadimplente() {
    this.agendaService.getONiboBoletoApp().subscribe(
      result => {
        this.statusBoleto = result;
      },
      async fail => {
      }
    )
  }

  getColaboradores(searchTerm: string) {
    this.pesquisaColaboradorLoader = true;

    this.agendaService.getColaboradoresAgendaveisPesquisadosComoGestor(searchTerm, true)
      .subscribe(
        result => {
          this.pesquisaColaboradorLoader = false;
          this.listColaboradoresAgendaveis = result;
          this.listaColaboradoresPesquisados = result;

        },
        fail => {
          this.pesquisaColaboradorLoader = false;
          //this.onError(fail);
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
  pesquisaColaboradores(searchTerm: string) {
    const listFilteredColaboradores = [];
    for (let i = 0; i < this.listColaboradoresAgendaveis?.length; i++) {
      if (this.listColaboradoresAgendaveis[i].nomeProfissional?.toLowerCase().indexOf(searchTerm?.toLowerCase()) !== -1) {
        listFilteredColaboradores.push(this.listColaboradoresAgendaveis[i]);
      }
    }
    this.listaColaboradoresPesquisados = listFilteredColaboradores
  }


  detectiOS() {
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i))
      return true;
    else
      return false;
  }


  public valueNormalizer = (text: Observable<string>) => text.pipe(map((text: string) => {
    return {
      value: null,
      text: ""
    };
  }));

  async resumoAgendamento(index: number) {
    const agendamento = this.agendamentos[index];
    const modal = await this.ModalController.create({
      component: ResumoAgendamentoProfissionalComponent,
      componentProps: {
        parametrosLight: this.parametrosLight,
        registerServicePermission: this.registerServicePermission,
        registerProductPermission: this.registerProductPermission,
        userData: this.userData,
        dataSelecionada: this.dataSelecionada,
        dadosAgendamento: agendamento,
        possuiFicha: true,
        naotemcliente: false
      },
    });

    return await modal.present();
  }

  iniciarAtendimento(index: number) {

    this.LoadingService.present();
    this.agendaService.statusEmAtendimento(this.agendamentos[index].agendaId).subscribe(
      result => {
        this.proximosAgendamentos(this.dataSelecionada, this.dataSelecionada)
        this.LoadingService.dismiss()

      },
      fail => {
      }
    );

  }

  //this.infoProfissionaleAgenda

  getInfoColaboradorAgenda(date) {
    if (this.colaboradorSelecionado?.profissionalId !== undefined) {
      let diaAtual = new Date(date);
      let data: string;
      if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
        diaAtual.setHours(this.hoje.getHours() + this.fuso);
        data = diaAtual.toISOString().split('T')[0];
      }
      else {
        data = diaAtual.toISOString().split('T')[0];
      }

      this.agendaService.getinfoProfissionaleAgenda(data, this.colaboradorSelecionado.profissionalId).subscribe(
        result => {
          this.infoColaboradorAgenda = result
          if (result.horarioInicioProfissional != null) {
            this.temHorario = true;
          }
          this.infoAgendaVaziaBoolean = false
        },
        fail => {
          this.infoColaboradorAgenda = undefined
          this.infoAgendaVaziaBoolean = true
        }
      )
    }
  }




  async proximosAgendamentos(dataInicial: any, dataFinal: any) {
    let diaAtual = new Date(dataInicial);
    if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
      diaAtual.setHours(this.hoje.getHours() + this.fuso);
      dataInicial = diaAtual.toISOString().split('T')[0];
      dataFinal = diaAtual.toISOString().split('T')[0];
    }
    await this.LoadingService.present();
    this.agendaService.getProfissionalAgendamentos(dataInicial, dataFinal, this.colaboradorSelecionado.profissionalId).subscribe(
      result => {
        this.agendamentos = result;
        this.agendamentos.map(x => {
          x.dataAg = new Date(x.dataAg);
        });

        this.agendamentos = this.listProfissionalBloq.concat(this.agendamentos);

        const HorariosDisponiveis = [];

        if (this.agendamentos?.length != 0) {
          // ordena os agendamentos em ordem crescente de horário de inicio
          this.agendamentos.sort((a, b) => (a.horarioInicio > b.horarioInicio) ? 1 : ((b.horarioInicio > a.horarioInicio) ? -1 : 0));

          let horarioPrimeiroAgendamento = this.agendamentos[0]?.horarioInicio;
          let horarioUltimoAgendamento = this.agendamentos[this.agendamentos?.length - 1]?.horarioFim;
          let horarioFinalMestre = this.agendamentos[0]?.horarioFim;
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

          if (this.infoColaboradorAgenda.horarioInicioProfissional != horarioPrimeiroAgendamento) {
            this.agendamentos.unshift({
              dia: dataInicial, horarioInicio: this.infoColaboradorAgenda.horarioInicioProfissional,
              horarioFim: horarioPrimeiroAgendamento, horarioLivre: 1, agendaId: -1
            });
          }

          if (horarioUltimoAgendamento != this.infoColaboradorAgenda?.horarioFimProfissional) {
            this.agendamentos.push({
              dia: dataInicial, horarioInicio: horarioUltimoAgendamento,
              horarioFim: this.infoColaboradorAgenda?.horarioFimProfissional, horarioLivre: 1, agendaId: -1
            });
          }
        } else {
          this.agendamentos.push({
            dia: dataInicial,
            horarioInicio: this.infoColaboradorAgenda.horarioInicioProfissional,
            horarioFim: this.infoColaboradorAgenda?.horarioFimProfissional,
            horarioLivre: 1,
            agendaId: -1
          });
        }
        this.carregouAgendamentos = true;
        this.ref.markForCheck();
        this.LoadingService.dismiss();
      },
      fail => {
        this.LoadingService.dismiss();
      }
    );
    this.algumHorarioDisp = false;
    for (var i = 0; i < this.agendamentos?.length; i++) {
      if (this.agendamentos[i].horarioLivre != undefined && this.agendamentos[i].horarioLivre == 1) {
        this.indexhorarioDisp = i;
        this.algumHorarioDisp = true;
        break;
      }
    }
  }

  verificaHorarios() {
    this.algumHorarioDisp = false;
    for (var i = 0; i < this.agendamentos?.length; i++) {
      if (this.agendamentos[i].horarioLivre != undefined && this.agendamentos[i].horarioLivre == 1) {
        this.indexhorarioDisp = i;
        this.algumHorarioDisp = true;
        break;
      }
    }
    return true;
  }

  changeColaborador(event: any) {
    localStorage.setItem('oneProfissionalSelecionado', event.profissionalId)
    //var buttonControl = document.getElementById("Estilizacao").parentNode.parentNode.parentNode.parentNode.querySelector('kendo-dialog-actions').getElementsByClassName("k-primary")[0] as HTMLElement
    let error: boolean = true;
    this.temHorario = false;
    this.carregouAgendamentos = false;
    if (event != undefined) {
      this.selecionouColaborador = true;
      if (this.listColaboradoresAgendaveis != undefined && this.listColaboradoresAgendaveis != null) {
        let colaborador = this.listColaboradoresAgendaveis.filter(x => x.profissionalId == event.profissionalId)[0];
        if (colaborador != undefined && colaborador != null) {
          this.colaboradorSelecionado = colaborador;

          this.getInfoColaboradorAgenda(this.dataSelecionada)
          this.getProfissionalBloq(this.dataSelecionada, this.dataSelecionada)
          //this.proximosAgendamentos(new Date().toISOString().split('T')[0],new Date().toISOString().split('T')[0])


          error = false;
        }
        else {
          error = true;
        }
      }
      else {
        error = true;
      }
    }
    if (error) {
      //this.clientePreenchido = false;
      //buttonControl.setAttribute("disabled", "true")
      const fail = {
        error: "AGENDA.AGENDAGESTOR.ERROR.COLABORADORNAOENCONTRADO"
      }
      //this.onError(fail);
    }
    //this.pesquisaClienteLoader = false;
    this.sendMessage(this.dataSelecionada, event.profissionalId)
  }

  sendMessage(data, profId): void {
    // send message to subscribers via observable subject
    this.agendaService.sendUpdate(data, profId);
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

    this.agendaService.getinfoProfissionaleAgenda(date).subscribe(
      result => {
        this.infoProfissionaleAgenda = result
      },
      fail => {
      }
    );
  }

  async criarBloqueioModal(index: number) {

    const modal = await this.ModalController.create({
      component: NovoBloqueioComponent,
      componentProps: {
        parametrosLight: this.parametrosLight,
        dadosAgendamento: this.agendamentos[index],
        infoProfissionaleAgenda: this.infoProfissionaleAgenda,
        profissionalId: this.colaboradorSelecionado.profissionalId,
      },
      backdropDismiss: false,
    });

    modal.onDidDismiss().then(retorno => {
      if (retorno.data !== 0 && retorno.data !== undefined && retorno.data !== null) {
        document.getElementsByTagName('ion-modal')[0].dismiss(retorno.data)
        this.agendamentos.push(retorno.data)
        this.agendamentos.sort((a, b) => (a.horarioInicio > b.horarioInicio) ? 1 : ((b.horarioInicio > a.horarioInicio) ? -1 : 0));
        this.GeraouRemoveHorariosLivres(retorno.data)
      }
    });
    return await modal.present();
  }

  async deleteAppointment(index: number) {
    let agendamento = this.agendamentos[index];
    let pos = this.agendamentos.indexOf(agendamento);
    await this.LoadingService.present();
    this.agendaService.desmarcarBloqueioProfissional(agendamento.agendaId).subscribe(
      result => {
        this.agendamentos.splice(pos, 1)

        const data = new Date(this.dataSelecionada).toISOString().split('T')[0];
        this.getProfissionalBloq(data, data);

        this.LoadingService.dismiss()
      },
      fail => {
        this.LoadingService.dismiss()
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

            this.LoadingService.present();
            this.deleteAppointment(index);

          }
        }
      ],
      backdropDismiss: false,
    });

    await alert.present();
  }


  showAppointmentDetails(index: number): void {
    if (this.agendamentoSelecionadoIndex == index) {
      return
    }
    else {
      if (this.agendamentoSelecionadoIndex == null) {
        this.agendamentoSelecionadoIndex = 0
      }


      let agendamentoCard = document.getElementsByClassName('agendamento') as HTMLCollectionOf<HTMLElement>
      //let playButtons = document.getElementsByClassName('controlStyleButton') as HTMLCollectionOf<HTMLElement>
      let horarioInicioCard = document.getElementsByClassName('horarioControl') as HTMLCollectionOf<HTMLElement>

      if (agendamentoCard[this.agendamentoSelecionadoIndex] == undefined) {
        this.agendamentoSelecionadoIndex = 0

      }
      agendamentoCard[this.agendamentoSelecionadoIndex].style.border = 'unset';
      agendamentoCard[index].style.border = '1px solid var(--ion-color-secondary)'




      this.agendamentoSelecionadoIndex = index
    }
    this.agendamentoSelecionadoIndex = index;
  }


  getProfissionalBloq(dataInicial, dataFinal) {

    if (this.colaboradorSelecionado?.profissionalId !== undefined) {
      let diaAtual = new Date(this.dataSelecionada);
      if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
        diaAtual.setHours(this.hoje.getHours() + this.fuso);
        dataInicial = diaAtual.toISOString().split('T')[0];
        dataFinal = diaAtual.toISOString().split('T')[0];
      }
      this.agendaService.getProfissionalBloqueio(dataInicial, dataFinal, this.colaboradorSelecionado.profissionalId).then(
        result => {
          this.listProfissionalBloq = result
          this.listProfissionalBloq.map(x => x['bloqueio'] = 1) //usado para checar o template no html
          this.listProfissionalBloq.map(x => x['status'] = 'B') //esse valor é usado para settar a cor da borda

          this.proximosAgendamentos(dataInicial, dataFinal)

        },
        fail => {

        })
    }
  }

  // Método para calcular o tamanho do nome a ser exibido
  setNameSizeCut() {
    if (this.screenWidth >= 370) { this.nameSizeCut = 16; }
    else { this.nameSizeCut = 9; }
  }

  async maisOpcoesModal(index: number) {
    if (this.agendamentos[index].horarioLivre != undefined && this.agendamentos[index].horarioLivre == 1) {

      const modal = await this.ModalController.create({
        component: OpcoesHorariolivreComponent,
        componentProps: {
          parametrosLight: this.parametrosLight,
          dadosAgendamento: this.agendamentos[index],
          dataSelecionada: this.dataSelecionada,
          profissionalInfo: this.colaboradorSelecionado,
          infoProfissionaleAgenda: this.colaboradorSelecionado,
          profissionalId: this.colaboradorSelecionado.profissionalId,
        },
        backdropDismiss: false,
        cssClass: 'maisOpcoesHorarioLivreModal'
      })
      modal.onDidDismiss().then(retorno => {
        if (retorno.data.bloqueio == 1) { //significa que foi criado um bloqueio
          this.agendamentos.push(retorno.data)
          this.agendamentos.sort((a, b) => (a.horarioInicio > b.horarioInicio) ? 1 : ((b.horarioInicio > a.horarioInicio) ? -1 : 0));
          this.GeraouRemoveHorariosLivres(retorno.data)
        }


        else if (retorno != undefined) {
          this.proximosAgendamentos(this.dataSelecionada, this.dataSelecionada)


        }
      })

      return await modal.present()



    }

    else if (this.agendamentos[index].bloqueio != undefined && this.agendamentos[index].bloqueio == 1) {


      const modal = await this.ModalController.create({
        component: OpcoesBloqueioComponent,
        componentProps: {
          parametrosLight: this.parametrosLight,
          dadosAgendamento: this.agendamentos[index],
          infoProfissionaleAgenda: this.colaboradorSelecionado
        },
        backdropDismiss: false,
        cssClass: 'maisOpcoesHorarioLivreModal'
      })
      modal.onDidDismiss().then(retorno => {


        if (retorno.data != 0) {


          let indexElemento = this.agendamentos.indexOf(retorno.data)

          this.agendamentos = this.agendamentos.filter(x => x != retorno.data)
          for (let i = 0; i < this.agendamentos?.length; i++) {
            if (this.agendamentos[i + 1] != undefined) {
              if (this.agendamentos[i].horarioLivre == 1 && this.agendamentos[i + 1].horarioLivre == 1) { //checo se há dois cards de horário livre em sequencia
                this.agendamentos[i].horarioFim = this.agendamentos[i + 1].horarioFim //concatena o horario de término de ambos
                this.agendamentos.splice(i + 1, 1) //remove um dos horários livres
              }
            }
          }
          if (indexElemento <= this.agendamentos?.length - 1) { //se ele entrar aqui significa que o elemento não era o ultimo portanto é necessário checar o anterior e o posterior
            //importante lembrar que o indexElemento nesse ponto não representa mais a posição do elemento inicial, pois o mesmo foi removido, e sim representa a posição do elemento que era posterior a ele
            if (indexElemento == 0) {
              if (this.agendamentos[indexElemento].horarioLivre == 1) {
                this.agendamentos[indexElemento].horarioInicio = this.infoColaboradorAgenda.horarioInicioProfissional
              }
            }

            else if (this.agendamentos[indexElemento].horarioLivre == 1 && this.agendamentos[indexElemento - 1] != undefined) {
              if (this.agendamentos[indexElemento].horarioInicio != this.agendamentos[indexElemento - 1].horarioFim) {
                this.agendamentos[indexElemento].horarioInicio = this.agendamentos[indexElemento - 1].horarioFim
              }
            }
            //this.agendamentos = this.agendamentos.filter(x => x != retorno.data)

          }
        }
      })

      return await modal.present()

    }

    else {

      const modal = await this.ModalController.create({
        component: OpcoesAgendamentoComponent,
        componentProps: {
          parametrosLight: this.parametrosLight,
          registerServicePermission: this.registerServicePermission,
          registerProductPermission: this.registerProductPermission,
          userData: this.userData,
          profissionalInfo: this.colaboradorSelecionado,
          dataSelecionada: this.dataSelecionada,
          dadosAgendamento: this.agendamentos[index]
        },
        backdropDismiss: false,
        cssClass: 'maisOpcoesModal'
      })
      modal.onDidDismiss().then(retorno => {
        if (retorno.data != 0) {
          if (retorno.data.edited == false) {


            //tratamento para que não haja dois cards de horários livres em sequencia, devido a exclusão de uma marcação(ou seja, quando houver eles serão transformados em um unico card)
            for (let i = 0; i < this.agendamentos?.length; i++) {
              if (this.agendamentos[i + 1] != undefined) {
                if (this.agendamentos[i].horarioLivre == 1 && this.agendamentos[i + 1].horarioLivre == 1) { //checo se há dois cards de horário livre em sequencia
                  this.agendamentos[i].horarioFim = this.agendamentos[i + 1].horarioFim //concatena o horario de término de ambos
                  this.agendamentos.splice(i + 1, 1) //remove um dos horários livres
                }
              }
            }
          }
          else if (retorno.data.edited == true) {

            let agendamento = this.agendamentos.filter(x => retorno.data.agendamento.data.agendamento.agendasId == x.agendaId)[0]
            agendamento.horarioFim = retorno.data.agendamento.data.agendamento.horarioFim
            agendamento.horarioInicio = retorno.data.agendamento.data.agendamento.horarioInicio
            agendamento.servicoId = retorno.data.agendamento.data.agendamento.servicoId
            agendamento.observacao = retorno.data.agendamento.data.agendamento.observacao
            retorno.data.agendamento.data.servico != undefined ? agendamento.descricaoServico = retorno.data.agendamento.data.servico.nomeServico : agendamento.descricaoServico = agendamento.descricaoServico
            this.agendamentos = this.agendamentos.filter(x => retorno.data.agendamento.data.agendamento.agendasId != x.agendaId)
            this.agendamentos.push(agendamento)
            this.agendamentos.sort((a, b) => (a.horarioInicio > b.horarioInicio) ? 1 : ((b.horarioInicio > a.horarioInicio) ? -1 : 0));

            this.GeraouRemoveHorariosLivres(agendamento)

            //tratamento para que não haja dois cards de horários livres em sequencia, devido a exclusão de uma marcação(ou seja, quando houver eles serão transformados em um unico card)
            for (let i = 0; i < this.agendamentos?.length; i++) {
              if (this.agendamentos[i + 1] != undefined) {
                if (this.agendamentos[i].horarioLivre == 1 && this.agendamentos[i + 1].horarioLivre == 1) { //checo se há dois cards de horário livre em sequencia
                  this.agendamentos[i].horarioFim = this.agendamentos[i + 1].horarioFim //concatena o horario de término de ambos
                  this.agendamentos.splice(i + 1, 1) //remove um dos horários livres
                }
              }
            }

          }

          else if (retorno.data.status.data == 'E') { //editar status para "executado pelo profissional"
            let agendamento = this.agendamentos.filter(x => x.agendaId == retorno.data.agendaId)[0]
            agendamento.status = 'E'
            this.agendamentos = this.agendamentos.filter(x => retorno.data.agendaId != x.agendaId)
            this.agendamentos.push(agendamento)
            this.agendamentos.sort((a, b) => (a.horarioInicio > b.horarioInicio) ? 1 : ((b.horarioInicio > a.horarioInicio) ? -1 : 0));
          }

          else {
            this.agendamentos = this.agendamentos.filter(x => x != retorno.data)

            //tratamento para que não haja dois cards de horários livres em sequencia, devido a exclusão de uma marcação(ou seja, quando houver eles serão transformados em um unico card)
            for (let i = 0; i < this.agendamentos?.length; i++) {
              if (this.agendamentos[i + 1] != undefined) {
                if (this.agendamentos[i].horarioLivre == 1 && this.agendamentos[i + 1].horarioLivre == 1) { //checo se há dois cards de horário livre em sequencia
                  this.agendamentos[i].horarioFim = this.agendamentos[i + 1].horarioFim //concatena o horario de término de ambos
                  this.agendamentos.splice(i + 1, 1) //remove um dos horários livres
                }
              }
            }
          }
          //this.GeraouRemoveHorariosLivres(retorno.data)


        }

        this.proximosAgendamentos(this.dataSelecionada, this.dataSelecionada)
      })

      return await modal.present()
    }

  }


  GeraouRemoveHorariosLivres(bloqueio) { // a chamada dessa função deve ocorrer com os elementos do this.agendamentos ja ordenados


    let horarioPrimeiroAgendamento;
    let horarioUltimoAgendamento;
    let HorariosDisponiveis = []

    let indexElemento = this.agendamentos.indexOf(bloqueio)
    if (indexElemento != 0 && indexElemento != this.agendamentos?.length - 1) {
      if (this.agendamentos[indexElemento].horarioFim != this.agendamentos[indexElemento + 1].horarioInicio) {
        this.agendamentos.push({ dia: this.dataSelecionada, horarioInicio: this.agendamentos[indexElemento].horarioFim, horarioFim: this.agendamentos[indexElemento + 1].horarioInicio, horarioLivre: 1, agendaId: -1 })
      }

    }
    if (indexElemento != 0 && this.agendamentos[indexElemento - 1].horarioLivre == 1 && this.agendamentos[indexElemento - 1].horarioFim > this.agendamentos[indexElemento].horarioInicio) {
      this.agendamentos[indexElemento - 1].horarioFim = this.agendamentos[indexElemento].horarioInicio

      if (this.agendamentos[indexElemento - 1].horarioFim == this.agendamentos[indexElemento - 1].horarioInicio) {
        this.agendamentos.splice(indexElemento - 1, 1)
        indexElemento = this.agendamentos.indexOf(bloqueio)//é necessario atualizar o indice após a remoção de algum elemento
      }
    }
    if (indexElemento == this.agendamentos?.length - 1) {
      if (this.agendamentos[indexElemento].horarioFim != this.infoColaboradorAgenda?.horarioFimProfissional) {
        this.agendamentos.push({ dia: this.dataSelecionada, horarioInicio: this.agendamentos[indexElemento].horarioFim, horarioFim: this.infoColaboradorAgenda?.horarioFimProfissional, horarioLivre: 1, agendaId: -1 })
      }
    }

    this.agendamentos.sort((a, b) => (a.horarioInicio > b.horarioInicio) ? 1 : ((b.horarioInicio > a.horarioInicio) ? -1 : 0)); //ordena os agendamentos em ordem crescente de horário de inicio

  }


  async addAppointment() {
    const modal = await this.ModalController.create({
      component: NovoAgendamentoProfissionalComponent,
      componentProps: {
        parametrosLight: this.parametrosLight,
        userData: this.userData,
        dataAg: this.dataSelecionada,
        profissionalInfo: this.colaboradorSelecionado,
        dataSelecionada: new Date(this.dataSelecionada)
      },
    })
    modal.onDidDismiss().then(retorno => {
      if (retorno.data != undefined) {
        this.proximosAgendamentos(this.dataSelecionada, this.dataSelecionada)
      }
    })

    return await modal.present()
  }

  onResize(event: any) {
    this.getScreenSize()
  }


  checkIfWebBrowser() {
    if (Capacitor.getPlatform() == 'web') {
      this.webBrowser = true
    }
  }

  updateAppointmentList(event: any) {

    //this.overlayDivControl = true


    this.userData = JSON.parse(localStorage.getItem('one.user'))
    //this.getInfoProfissionaleAgenda(new Date().toISOString().split('T')[0]);
    this.getScreenSize();
    this.checkIfWebBrowser()
    let data = new Date(this.dataSelecionada).toISOString().split('T')[0];
    let diaAtual = new Date(this.dataSelecionada);
    if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
      diaAtual.setHours(this.hoje.getHours() + this.fuso);
      data = diaAtual.toISOString().split('T')[0];
    }
    else {
      data = diaAtual.toISOString().split('T')[0];
    }
    this.getInfoProfissionaleAgenda(data);
    this.getProfissionalBloq(data, data);
    this.getInfoColaboradorAgenda(data)
    //CliForCols/PesquisarColaboradoresAgendaveis
    //OAgenda/GetAgendamentosProfissional
    setTimeout(() => {
      //this.overlayDivControl = false
      if (event.target?.complete() !== undefined) {
        event.target.complete();
      }
    }, 2000)
  }

  eventoHoje() {
    const diaHojeAux = this.hojeCorrigido.split('T')[0];

    this.dataHojeIniciarAtendimento = diaHojeAux + 'T00:00:00';
  }

  async alertConfirmar(agendasId) {
    const alert = await this.alertController.create({
      header: this.translate.instant('AGENDA.APPOINTMENT.CONFIRMARALERT.HEADER'),
      message: this.translate.instant('AGENDA.APPOINTMENT.CONFIRMARALERT.MESSAGE'),
      buttons: [{
        text: this.translate.instant('AGENDA.APPOINTMENT.CONFIRMARALERT.NO')
      }, {
        text: this.translate.instant('AGENDA.APPOINTMENT.CONFIRMARALERT.YES'),
        handler: () => {
          this.agendaService.patchGestorConfirmaAgendamento(agendasId).subscribe(res => {
            this.proximosAgendamentos(this.dataSelecionada, this.dataSelecionada)
          },
            fail => {
            });
        }
      }
      ],
      backdropDismiss: false
    });
    await alert.present();
  }

  async confirmarAgendamento(agendasId: number) {
    this.alertConfirmar(agendasId)
  }

}

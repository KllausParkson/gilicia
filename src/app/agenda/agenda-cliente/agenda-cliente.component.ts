import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ProximosAgendamentosModel } from '../models/proximosAgendamentosModel';
import { AgendaService } from '../services/agenda.service';
import { environment } from '../../../environments/environment';
import { NovoAgendamentoComponent } from '../modals/novo-agendamento/novo-agendamento.component';
import { AlertController, IonRouterOutlet, ModalController } from '@ionic/angular';
import { LoadingService } from '../../core/services/loading.service';
import { ChangeDetectorRef } from '@angular/core';
import { ParametrosLightModel } from '../models/parametrosLightModel';
import { TranslateService } from '@ngx-translate/core';
import { Calendar } from '@ionic-native/calendar/ngx';
import { EditarAgendamentoClienteModalComponent } from '../modals/editar-agendamento-cliente-modal/editar-agendamento-cliente-modal.component';
import { Platform } from '@ionic/angular';
import { AvaliarColaboradorModalComponent } from '../../shared/avaliar-colaborador-modal/avaliar-colaborador-modal.component';
import { cliforColsAssociacaoModel, usuarioSelecionavel } from '../models/cliforColsAssociacaoModel'

//import {App} from '@capacitor/core';
import { EscolherEstabelecimentoModalComponent } from 'app/login/modals/escolher-estabelecimento-modal/escolher-estabelecimento-modal.component';
import { timeStamp } from 'console';
import { App } from '@capacitor/app';
import { ConfirmarPerfilModalComponent } from 'app/shared/confirmar-perfil-modal/confirmar-perfil-modal.component';
import { PerfilModel } from 'app/perfil/models/perfil-model';
import { ServicoProfissionalComponent } from '../modals/servico-profissional/servico-profissional.component';

// Para o Capacitor 3
// import { Plugins } from '@capacitor/core';
// const { App } = Plugins;

@Component({
  selector: 'app-agenda-cliente',
  templateUrl: './agenda-cliente.component.html',
  styleUrls: ['./agenda-cliente.component.scss'],
})
export class AgendaClienteComponent implements OnInit {
  public logo;
  public loadingAgendamentos: boolean = true;
  public agendamentos: any; // Array<ProximosAgendamentosModel>;
  public agendamentosAux: any;
  private userData: any;
  public innerWidth: any;
  public mostrarBotaoAgendarCliente: any;
  public screenHeight: any;
  public addAppointmentButtonHeight: any;
  public gridWidth: any;
  public parametrosLight: ParametrosLightModel;
  public iOS: boolean;
  public corStatus: string;
  public diaDaSemana: number;
  public semLogo = 'https://oneproducao.blob.core.windows.net/one2/Imagens/One_Logo.png';
  public statusBoleto: boolean;
  public basehref: any;
  public mobilidadeInadimplente: boolean;
  public perfilUsuario: PerfilModel;
  public usuarioSelecionado: usuarioSelecionavel;
  public temAssinatura = false;
  public CPF: string;

  @HostListener('window:resize', ['$event'])

  getScreenSize(event?) {
    this.innerWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.addAppointmentButtonHeight = this.iOS ? this.screenHeight - 190 : this.screenHeight - 190;
    this.addAppointmentButtonHeight = this.addAppointmentButtonHeight.toString() + 'px';
    this.gridWidth = this.innerWidth - 20;
    this.gridWidth = this.gridWidth.toString() + 'px';
    // this.slideContentHeight = innerHeight - 300
    // this.slideContentHeight = this.slideContentHeight.toString() + 'px'
  }


  constructor(
    private agendaService: AgendaService,
    private ModalController: ModalController,
    private ref: ChangeDetectorRef,
    private alertController: AlertController,
    public translate: TranslateService,
    private LoadingService: LoadingService,
    private Calendar: Calendar,
    public platform: Platform,
    private routerOutlet: IonRouterOutlet
  ) { this.configBackButton(); }

  async ngOnInit() {
    this.agendaService.getUsuarioPerfil()
    .subscribe(
      resp => {
        this.perfilUsuario = resp;
      }
    );
    this.userData = JSON.parse(localStorage.getItem('one.user'))
    // this.agendaService.getClienteTemAssinatura().subscribe(res => this.temAssinatura = res);
    // this.agendaService.buscaCPF().subscribe(result => {
    //   this.CPF = result.cpfCliente;
    //   }

    // );
    this.agendaService.currentMessage.subscribe(message => {
      if (message != 'default message') {
        this.usuarioSelecionado = JSON.parse(message); 
        if (this.usuarioSelecionado.cliforcolsId != this.userData.authenticatedUser.cliForColsId)
          this.proximosAgendamentosDependente(this.usuarioSelecionado.cliforcolsId);
        else
          this.proximosAgendamentos();
      }
      else{
        this.usuarioSelecionado = new usuarioSelecionavel();
        this.usuarioSelecionado.cliforcolsId = this.userData.authenticatedUser.cliForColsId;
        this.usuarioSelecionado.nome = this.userData.authenticatedUser.nomeUsuario;
      }
    })
    localStorage.setItem('calendarioExpandido', "0");
    this.basehref = localStorage.getItem('basehref')
    this.getParametrosLight();
    this.iOS = this.detectiOS();
    this.getScreenSize()
    this.getMobilidade(this.userData.authenticatedBranch.empresaId, this.userData.authenticatedBranch.filialId)


    //this.getStatusInadimplente()
    this.platform.resume.subscribe(async () => {
      // this.agendaService.getClienteTemAssinatura().subscribe(res => this.temAssinatura = res);
      // this.agendaService.buscaCPF().subscribe(res => {
      //   debugger
      //   this.CPF = res.cpfCliente;
      //   }

      // );
      this.agendaService.getUsuarioPerfil()
      .subscribe(
         resp => {
          this.perfilUsuario = resp;
        }
      );
      this.userData = JSON.parse(localStorage.getItem('one.user'))
      this.getMobilidade(this.userData.authenticatedBranch.empresaId, this.userData.authenticatedBranch.filialId)

      this.getParametrosLight();
      this.iOS = this.detectiOS();
      this.getScreenSize()


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

      this.logo = this.userData.authenticatedBranch.logoMarca;
      this.proximosAgendamentos()

      this.agendaService.getClaims(this.userData.authenticatedBranch.empresaId, this.userData.authenticatedBranch.filialId).subscribe(
        res => {
          localStorage.setItem('claims', JSON.stringify(res));
          if (res['Agendar Serviços'] != null) {
            this.mostrarBotaoAgendarCliente = res['Agendar Serviços'].filter(x => x == "Visualizar");
          }
          this.ref.detectChanges()
      });
      // setTimeout(async () => {
      //   debugger
      //   if((this.perfilUsuario.celular == undefined || this.perfilUsuario.celular == "") || (this.temAssinatura && (this.CPF == "" || this.CPF == undefined))){
      //     const modal = await this.ModalController.create({
      //       component: ConfirmarPerfilModalComponent,
      //       componentProps: {
      //         perfil: this.perfilUsuario,
      //         cpf: this.CPF
      //       },
      //     });
      //     modal.onDidDismiss().then(retorno => {
      //     });
      //     return await modal.present();
      //   }
      // }, 5000);

    });

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

    this.logo = this.userData.authenticatedBranch.logoMarca;
    this.proximosAgendamentos()
    this.agendaService.getClaims(this.userData.authenticatedBranch.empresaId, this.userData.authenticatedBranch.filialId).subscribe(
      res => {
        localStorage.setItem('claims', JSON.stringify(res));
        if (res['Agendar Serviços'] != null) {
          this.mostrarBotaoAgendarCliente = res['Agendar Serviços'].filter(x => x == "Visualizar");
        }
        this.ref.detectChanges()
      });
      
      // setTimeout(async () => {
      //   if((this.perfilUsuario.celular == undefined || this.perfilUsuario.celular == "") || (this.temAssinatura && (this.CPF == "" || this.CPF == undefined))){
      //     const modal = await this.ModalController.create({
      //       component: ConfirmarPerfilModalComponent,
      //       componentProps: {
      //         perfil: this.perfilUsuario
      //       },
      //     });
      //     modal.onDidDismiss().then(retorno => {
      //     });
      //     return await modal.present();
      //   }
      // }, 5000);
    //this.agendamentos = [1,2]

  }


  detectiOS() {
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)) {
      return true;
    }
    else {
      return false;
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

  getStatusInadimplente() {
    this.agendaService.getONiboBoletoApp().subscribe(
      result => {
        this.statusBoleto = result;
      },
      async fail => {
      }
    )
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
        header: this.translate.instant('AGENDA.INATIVO.CLIENTEALERT.HEADER'),
        message: this.translate.instant('AGENDA.INATIVO.CLIENTEALERT.MESSAGE'),
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

  async proximosAgendamentosDependente(cliforcolId: number) {
    this.loadingAgendamentos = true;
    this.agendamentos = null;

    let lang = localStorage.getItem('one.lang') != "" && localStorage.getItem('one.lang') != undefined
      && localStorage.getItem('one.lang') != null && localStorage.getItem('one.lang') != "null"
      ? localStorage.getItem('one.lang')
      : JSON.parse(localStorage.getItem('one.user')).authenticatedBranch.linguaPais;

    this.agendaService.getProximosAgendamentosDependente(cliforcolId).subscribe(
      result => {
        this.agendamentos = result;
        this.agendamentosAux = JSON.parse(JSON.stringify(this.agendamentos));
        this.agendamentos.map(x => {
          x['diaSemana'] = new Date(x.dataAg).getDay();
          x.dataAg = new Date(x.dataAg).toLocaleDateString(lang).split("T")[0];
        })
        this.ref.markForCheck();
        this.ref.detectChanges()

        this.loadingAgendamentos = false;

      },
      async fail => {
        if(fail.message ){

        }
        this.loadingAgendamentos = false;
        // const alert = await this.alertController.create({
        //   header: this.translate.instant('AGENDA.FORCELOGOUT'),
        //   message: this.translate.instant('AGENDA.ERROTERMINAL'),
        //   buttons: [{
        //     text: this.translate.instant('OK'),
        //     handler: () => {
        //       this.forcarLogout();
        //     }
        //   }
        //   ]
        // });
        // await alert.present();
      }
    )


  }

  async proximosAgendamentos() {
    this.loadingAgendamentos = true;
    this.agendamentos = null;

    let lang = localStorage.getItem('one.lang') != "" && localStorage.getItem('one.lang') != undefined
      && localStorage.getItem('one.lang') != null && localStorage.getItem('one.lang') != "null"
      ? localStorage.getItem('one.lang')
      : JSON.parse(localStorage.getItem('one.user')).authenticatedBranch.linguaPais;

    this.agendaService.getProximosAgendamentos().subscribe(
      result => {
        this.agendamentos = result;
        this.agendamentosAux = JSON.parse(JSON.stringify(this.agendamentos));
        this.agendamentos.map(x => {
          x['diaSemana'] = new Date(x.dataAg).getDay();
          x.dataAg = new Date(x.dataAg).toLocaleDateString(lang).split("T")[0];
        })
        this.ref.markForCheck();
        this.ref.detectChanges()

        this.loadingAgendamentos = false;

      },
      async fail => {
        if(fail.error == "API.OAGENDA.PROXIMOSAGENDAMENTOSCLIENTE.CLIFORCOLS.INATIVO"){
          const alert = await this.alertController.create({
            header: this.translate.instant('AGENDA.FORCELOGOUT'),
            message: "Detectamos que seu cadastro foi desativado enquando você utilizava o App, entre em contato com o estabelecimento para mais informações",
            buttons: [{
              text: this.translate.instant('OK'),
              handler: () => {
                this.forcarLogout();
              }
            }
            ]
          });
          alert.present();
        }

        // se o token for invalido, expirado ou o usuario nao tiver permissao de acesso
        if (fail.error == "API.OAGENDA.INVALIDTOKEN" || fail.status == 401) {
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
          alert.present();
        }

        this.loadingAgendamentos = false;

      }
    )


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

  showAppointmentDetails(index: number): void {
  }

  async addAppointment() {
    // const modal = await this.ModalController.create({
    //   component: NovoAgendamentoComponent,
    //   id:'novoAgendamentoId',
    //   componentProps: {
    //     parametrosLight: this.parametrosLight
    //   },
    // })
    // modal.onDidDismiss().then(async retorno => {
    //   //debugger
    //   if (retorno.data == 1) {
    //     //setTimeout(function(){
    //     if (this.usuarioSelecionado.cliforcolsId != this.userData.authenticatedUser.cliForColsId)
    //       await this.proximosAgendamentosDependente(this.usuarioSelecionado.cliforcolsId);
    //     else
    //       await this.proximosAgendamentos();
    //     //}, 3000);

    //   }
    // })
    const modal = await this.ModalController.create({
      component: ServicoProfissionalComponent,
      cssClass:'servicoProfissional',
      id:'servicoProfissional',
      componentProps: {
        parametrosLight: this.parametrosLight
      },
    })
    modal.onDidDismiss().then(async retorno => {
      if (retorno.data.data == 1) {
        //setTimeout(function(){
        if (this.usuarioSelecionado.cliforcolsId != this.userData.authenticatedUser.cliForColsId)
          await this.proximosAgendamentosDependente(this.usuarioSelecionado.cliforcolsId);
        else
          await this.proximosAgendamentos();
        //}, 3000);
        this.updateAppointmentList(event)
      }
    })
    this.agendaService.storyModal(modal)
    return await modal.present()
  }

  deleteAppointment(index: number) {
    let agendamento = this.agendamentos[index];
    let pos = this.agendamentos.indexOf(agendamento);
    this.LoadingService.present();
    this.agendaService.deleteAppointment(agendamento.agendasId).subscribe(
      result => {
        this.agendamentos.splice(pos, 1);
        this.agendamentosAux.splice(pos, 1);
        this.LoadingService.dismiss();
      },
      fail => {
        this.LoadingService.dismiss();
      }
    );
  }

  async editarAgendamento(index: number) {
    const agendamento = this.agendamentosAux[index];

    const modal = await this.ModalController.create({
      component: EditarAgendamentoClienteModalComponent,
      componentProps: {
        agenda: agendamento
      },
      backdropDismiss: false,
      cssClass: 'editarAgendamentoNoCliente',
    });

    modal.onDidDismiss()
      .then((data) => {
        var input = agendamento.horarioInicio.toString();
        var fields = input.split(':');
        var hora = fields[0];
        let horaFinal: number = +hora
        var minuto = fields[1];
        let minutoFinal: number = +minuto
        let horario = new Date(agendamento.dataAg)
        horario.setHours(horaFinal, minutoFinal, 0)

        let horario2 = new Date(agendamento.dataAg)
        input = agendamento.horarioFim.toString();
        fields = input.split(':');
        hora = fields[0];
        horaFinal = +hora
        minuto = fields[1];
        minutoFinal = +minuto
        horario2.setHours(horaFinal, minutoFinal, 0)
        //this.Calendar.modifyEvent(`${agendamento.descricaoServico} - ${agendamento.nomeColaborador}`,this.userData.authenticatedBranch.nomeEmpresaFilial, null, horario, horario2, `${data.data.agenda.descricaoServico} - ${agendamento.nomeColaborador}`).then((res) => {})
        //ainda não esta funcionando

        // this.agendamentos[index] = data;
        if (this.usuarioSelecionado.cliforcolsId != this.userData.authenticatedUser.cliForColsId)
          this.proximosAgendamentosDependente(this.usuarioSelecionado.cliforcolsId);
        else
          this.proximosAgendamentos();
      }); return await modal.present();

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
  setBorderStatusOther(status: string) {

    switch (status) {
      case 'A':
        this.corStatus = '#FF0DA5';
        return '1px solid #FF0DA5';
      case 'P':
        this.corStatus = '#C2D69B';
        return '1px solid #C2D69B';
      case 'E':
        this.corStatus = '#365F91';
        return '1px solid #365F91';
      case 'C':
        this.corStatus = '#A700FF';
        return '1px solid #A700FF';
      case 'R':
        this.corStatus = '#7F7F7F';
        return '1px solid #7F7F7F';
      case 'M':
        this.corStatus = '#00FBFF';
        return '1px solid #00FBFF';
      case 'N':
        this.corStatus = '#86592D';
        return '1px solid #86592D';
      case 'X':
        this.corStatus = '#0518A3';
        return '1px solid #0518A3';
    }
  }



  async deleteAppointmentAlert(index: number) {
    const alert = await this.alertController.create({
      header: this.translate.instant('AGENDA.APPOINTMENT.DESMARCARALERT.HEADER'),
      message: this.translate.instant('AGENDA.APPOINTMENT.DESMARCARALERT.MESSAGE'),
      buttons: [
        {
          text: this.translate.instant('AGENDA.APPOINTMENT.DESMARCARALERT.CANCELAR'),
          role: 'cancel',
          cssClass: 'cancelButton',
          handler: (blah) => {
          }
        }, {
          text: this.translate.instant('AGENDA.APPOINTMENT.DESMARCARALERT.EXCLUIR'),
          handler: () => {
            this.LoadingService.present();
            this.deleteAppointment(index)
            var input = this.agendamentosAux[index].horarioInicio.toString();
            var fields = input.split(':');
            var hora = fields[0];
            let horaFinal: number = +hora
            var minuto = fields[1];
            let minutoFinal: number = +minuto
            let horario = new Date(this.agendamentosAux[0].dataAg)
            horario.setHours(horaFinal, minutoFinal, 0)

            let horario2 = new Date(this.agendamentosAux[index].dataAg)
            input = this.agendamentosAux[index].horarioFim.toString();
            fields = input.split(':');
            hora = fields[0];
            horaFinal = +hora
            minuto = fields[1];
            minutoFinal = +minuto
            horario2.setHours(horaFinal, minutoFinal, 0)
            this.Calendar.deleteEvent(`${this.agendamentosAux[index].descricaoServico} - ${this.agendamentosAux[index].nomeColaborador}`, this.userData.authenticatedBranch.nomeEmpresaFilial, null, horario, horario2)
          }
        }
      ],
      backdropDismiss: false,

    });

    await alert.present();
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

  updateAppointmentList(event: any) {
    //this.overlayDivControl = true
    this.getParametrosLight();
    this.getScreenSize()
    this.userData = JSON.parse(localStorage.getItem('one.user'))
    this.logo = this.userData.authenticatedBranch.logoMarca
    if (this.usuarioSelecionado.cliforcolsId != this.userData.authenticatedUser.cliForColsId)
      this.proximosAgendamentosDependente(this.usuarioSelecionado.cliforcolsId);
    else
      this.proximosAgendamentos();
    //this.agendamentos = [1,2]
    this.ref.detectChanges()
    if(event)
{    setTimeout(() => {
      //this.overlayDivControl = false
      event.target.complete();
    }, 2000)
  }
}

  temSegundonome(nome: string) {
    return nome?.split(' ')[1] !== undefined && nome?.split(' ')[1] !== null;
  }

  async avaliarProfissional(item) {

    const actions = JSON.parse(item.actions);

    const modal = await this.ModalController.create({
      component: AvaliarColaboradorModalComponent,
      componentProps: {
        servicos: actions[0].parameters.servicos
      },
    });
    modal.onDidDismiss().then(retorno => {

      if (retorno.data === 1) {
        if (this.usuarioSelecionado.cliforcolsId != this.userData.authenticatedUser.cliForColsId)
          this.proximosAgendamentosDependente(this.usuarioSelecionado.cliforcolsId);
        else
          this.proximosAgendamentos();
      }
    });

    return await modal.present();

  }
}

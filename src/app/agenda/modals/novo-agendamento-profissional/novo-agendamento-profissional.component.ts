import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ToastService } from 'app/core/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { AgendaService } from '../../services/agenda.service'
import { FormGroup } from '@angular/forms';
import { DateUtils } from 'app/core/common/data-type-utils/date-utils'
import { LoadingService } from '../../../core/services/loading.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AgendamentoProfissionalModel } from '../../models/agendamentoProfissionalModel'
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { TextAreaDirective } from '@progress/kendo-angular-inputs';
// import { SchedulerService } from '../../services/scheduler.services';
import { CpfcnpjPipe } from 'app/core/pipes/cpfcnpj.pipe';
import { TelefonePipe } from 'app/core/pipes/telefone.pipe';
import { CadastroRapidoClienteComponent } from '../cadastro-rapido-cliente/cadastro-rapido-cliente.component'

@Component({
    selector: 'app-novo-agendamento-profissional',
    templateUrl: './novo-agendamento-profissional.component.html',
    styleUrls: ['./novo-agendamento-profissional.component.scss'],
})
export class NovoAgendamentoProfissionalComponent implements OnInit {

    public horarioAgendadoEdicaoExibicao: any;

    public dadosAgendamento: any; //recebe os dados do agendamento para edição
    public editadoBoolean: boolean = false //é usado caso o usuario tenha aberto o modal em modo de edição de agendamento, nesse caso esse booleano será responsável por mostrar se houve ou não alterações no agendamento
    public formGroup: FormGroup;
    public userData: any; //recebido como parametro
    public editarAgendamento = 0;
    public horarioSelecionado: any;
    public horarioSelecionadoButton: any;
    public listClientes: any[];
    public parametrosLight: any;//recebido como parametro

    public dataSelecionada: any; //data configurada para exibição
    public dataAg: any //data configurada para ser passada como parâmetro de API
    public listServicos: any[];
    public pesquisaServicos: any[];

    public observacao: string = ''
    public pesquisaClienteLoader: boolean = false;
    public pesquisaServicosLoader: boolean = false;
    public listClientesPresentes: any;
    public listHorariosDisponiveis: any = [];
    public servicoSelecionado: any;
    public clienteCadastrado: any;
    public clientePreenchido: boolean;
    public servicoPreenchido: boolean;
    public profissionalId: number;
    public tipoLogin: any;
    createCadastroRapidoForm: FormGroup;

    public gatilhoCadastro: boolean;

    //A variável à seguir define se as informações de email e telefone estarão censuradas ou não
    private mascaraEmailTel: boolean = true;

    public today: Date = new Date(); //datepicker para dataSelecionada precisa disto
    @ViewChild("box_cliente") box_cliente: ComboBoxComponent;
    @ViewChild("box_servico") box_servico: ComboBoxComponent;
    @ViewChild("box_obs") box_obs: TextAreaDirective;

    public screenHeight: any;
    public screenWidth: any;
    public borderHeight: any;
    public divHeight: any;

    public overlayDivControl: boolean = false;
    public fuso: any;
    public linguaPais: any;

    public profissionalInfo: any;

    public cliPresentesSegment: boolean = false;
    public isIEOrEdgeOrFF: boolean = /msie\s|Firefox|trident\/|edge\//i.test(window.navigator.userAgent); //saber qual o navegador que o usuario está

    public clienteDefault: any;

    public scheduleButtonWaitingAPI: boolean = false; //faz o controle do bloqueio do botão para que não seja possível acionar o mesmo no intervalo de espera do retorno da API de agendar

    public horarioPersonalizado = false;

    public horarioInicio = null;
    public horarioFim = null;

    //@HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.borderHeight = this.screenHeight - 550
        this.borderHeight = this.borderHeight.toString() + 'px'
        this.divHeight = this.screenHeight - 500
        this.divHeight = this.divHeight.toString() + 'px'
    }




    constructor(public navCtrl: NavController,
        private ModalController: ModalController,
        private toast: ToastService,
        public translate: TranslateService,
        private loadingService: LoadingService,
        private agendaService: AgendaService,
        private navParams: NavParams,
        public cpfcnpjPipe: CpfcnpjPipe,
        public telefonePipe: TelefonePipe) {

        this.agendaService.getClientesPresentes().subscribe(
            result => {
                this.listClientesPresentes = result
            },
            fail => {

            }
        )
    }

    ngOnInit() {
        //this.getScreenSize()
        let user = JSON.parse(localStorage.getItem('one.user'));
        let filial = user.authenticatedBranch;
        this.fuso = parseInt(filial.fuso, 10);
        this.linguaPais = filial.linguaPais
        this.getParametrosLight();
        this.tipoLogin = localStorage.getItem('one.tipologin')


        if (this.dadosAgendamento != undefined && this.dadosAgendamento.agendaId == -1) {//indica que o modal foi acessado pelo + (porque?)
            this.userData = JSON.parse(localStorage.getItem('one.user'))
            if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
                this.dataSelecionada.setHours(0);
            }

            this.dataSelecionada = new Date(this.dataSelecionada).toUTCString();

            this.dataSelecionada = new Date(Date.parse(this.dataSelecionada))
            this.getServicosProfissional()
        }
        else if (this.dadosAgendamento != undefined) { //se há dados isso significa que o usuario está tentando editar um agendamento
            this.editarAgendamento = 1;
            this.observacao = this.dadosAgendamento.observacao
            this.horarioAgendadoEdicaoExibicao = { horarioInicio: this.dadosAgendamento.horarioInicio, horarioFinal: this.dadosAgendamento.horarioFim }
            this.dadosAgendamento['nomeServico'] = this.dadosAgendamento.descricaoServico

            this.dataSelecionada = new Date(this.dataSelecionada).toUTCString();
            this.dataSelecionada = new Date(Date.parse(this.dataSelecionada))
            this.getServicosProfissional()
            this.getHorariosDisponiveisProfissional()

            // Lógica para selecionar o botão de horário inicial
            setTimeout(() => {
                const botaoHorarioInicial = document.getElementById('1').lastElementChild.getElementsByClassName('2').item(0)
                    .lastElementChild.firstElementChild.firstElementChild;
                botaoHorarioInicial.shadowRoot.firstElementChild.setAttribute('style', 'background-color: var(--ion-color-primary) !important');
                botaoHorarioInicial.shadowRoot.firstElementChild.firstElementChild.setAttribute('style', 'color: white !important');
                this.horarioSelecionadoButton = botaoHorarioInicial;
            }, 1000);
        }
        else {
            if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
                this.dataSelecionada = new Date(this.dataSelecionada).toUTCString();
                this.dataSelecionada = new Date(Date.parse(this.dataSelecionada))
                //this.dataSelecionada.setDate(this.dataSelecionada.getDate() -1);
            }
            this.getServicosProfissional()
        }
    }

    closeModal() {
        this.ModalController.dismiss()
    }

    closeModalEditar() { //Essa funcao executa a conversão de horario antes de fechar o modal, para evitar um bug no card de agendamento
        this.dadosAgendamento.dia = this.dadosAgendamento.dia.toISOString().split('T')[0] + 'T00:00:00'; //Essa linha converte representação de data de agendamento para comparação em botao iniciar atendimento, (NÃO REMOVER).
        this.ModalController.dismiss()
    }


    pesquisaClientes(searchTerm: string) {
        this.pesquisaClienteLoader = true;
        if (searchTerm?.length > 0) {
            this.agendaService.getClientesPesquisados(searchTerm)
                .subscribe(
                    result => {
                        this.pesquisaClienteLoader = false;
                        if (this.mascaraEmailTel) {
                            this.listClientes = this.alteraRetorno(result);
                        }
                        else {
                            this.listClientes = result;
                        }
                    },
                    fail => {
                        this.pesquisaClienteLoader = false;
                        //this.onError(fail);
                    }
                );
        }
    }

    changeCliente(event: any) {
        //var buttonControl = document.getElementById("Estilizacao").parentNode.parentNode.parentNode.parentNode.querySelector('kendo-dialog-actions').getElementsByClassName("k-primary")[0] as HTMLElement
        let error: boolean = true;
        if (event != undefined) {
            if (this.listClientes != undefined && this.listClientes != null) {
                let client = this.listClientes.filter(x => x.clienteId == event.clienteId)[0];

                if (client != undefined && client != null) {
                    this.clienteCadastrado = client;


                    if (this.servicoSelecionado != null && this.servicoSelecionado != undefined) {
                        this.getHorariosDisponiveisProfissional()
                    }
                    //this.formGroup.controls["clienteNome"].setValue(event.nomeCliente);
                    this.clientePreenchido = true;
                    if (this.clientePreenchido && this.servicoPreenchido) {
                        //buttonControl.removeAttribute("disabled")
                    }
                    error = false;
                } else {
                    error = true;
                }
            } else {
                error = true;
            }
        } else {
            this.clienteCadastrado = undefined;
            this.horarioSelecionado = undefined;
        }
        if (error) {
            this.clientePreenchido = false;
            //buttonControl.setAttribute("disabled", "true")
            const fail = {
                error: "SCHEDULER.ERRORS.CLIENTNOTFOUND"
            }
            //this.onError(fail);
        }
        this.pesquisaClienteLoader = false;
    }


    pesquisaServicosProfissional(searchTerm: string) {
        var listFilteredServices = []
        if (searchTerm == '') {
            for (let i = 0; i < this.listServicos?.length; i++) {
                for (let j = 0; j < this.listServicos[i].servicos?.length; j++) {
                    listFilteredServices.push(this.listServicos[i].servicos[j])
                }
            }
            //this.pesquisaServicos = listFilteredServices
            this.pesquisaServicos = listFilteredServices.sort((a, b) => (a.nomeServico > b.nomeServico ? 1 : -1))
            return

        }
        for (let i = 0; i < this.listServicos?.length; i++) {
            for (let j = 0; j < this.listServicos[i].servicos?.length; j++) {
                if (this.listServicos[i].servicos[j].nomeServico.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1) {
                    listFilteredServices.push(this.listServicos[i].servicos[j])
                }
            }
        }
        //this.pesquisaServicos = listFilteredServices.slice(0,5);
        this.pesquisaServicos = listFilteredServices.sort((a, b) => (a.nomeServico > b.nomeServico ? 1 : -1)).slice(0, 5);

    }

    changeServico(event: any) {
        let error: boolean = true;
        if (event != undefined) {
            if (this.listServicos != undefined && this.listServicos != null) {
                let servicos = null;
                for (let i = 0; i < this.listServicos?.length; i++) {
                    for (let j = 0; j < this.listServicos[i].servicos?.length; j++) {
                        if (this.listServicos[i].servicos[j].servicoId == event.servicoId) {
                            servicos = this.listServicos[i].servicos[j]
                            break
                        }
                    }
                    if (servicos != null) {
                        break
                    }
                }
                //let servicos = this.listServicos.filter(x => x.servicoId == event.servicoId)[0];
                if (servicos != undefined && servicos != null) {
                    //var arrayHora = servicos.servicoTempoExecucao.split(":");
                    this.servicoSelecionado = servicos
                    this.box_servico.focus();

                    if (this.editarAgendamento == 1 && this.dadosAgendamento.servicoId != this.servicoSelecionado.servicoId) { //checa o modal foi aberto no modo edição e se a alteração do serviço selecionou um serviço diferente do que já estava agendado
                        this.dadosAgendamento.servicoId = this.servicoSelecionado.servicoId
                        this.getHorariosDisponiveisProfissional()
                        this.editadoBoolean = true //confirma que os dados não batem com os dados originais, portanto houve uma edição
                    }


                    if (this.clienteCadastrado != null && this.clienteCadastrado != undefined) {
                        this.getHorariosDisponiveisProfissional()
                    }



                    this.servicoPreenchido = true;
                    if (this.clientePreenchido && this.servicoPreenchido) {
                        //buttonControl.removeAttribute("disabled")
                    }
                    error = false;
                }
                else {
                    error = true;
                }
            }
            else {
                error = true;
            }
        } else {
            this.servicoSelecionado = undefined;
            this.horarioSelecionado = undefined;
        }
        if (error) {
            this.servicoPreenchido = false;
            //buttonControl.setAttribute("disabled", "true")
            const fail = {
                error: "SCHEDULER.ERRORS.SERVICENOTFOUND"
            }
            //this.onError(fail);
        }
        this.pesquisaServicosLoader = false;
    }


    async getServicosProfissional() {
        await this.loadingService.present()
        this.agendaService.getServicosProfissional((this.profissionalInfo ? this.profissionalInfo.profissionalId : null)).subscribe(
            result => {
                this.listServicos = result
                let listFilteredServices = [];
                for (let i = 0; i < this.listServicos?.length; i++) {
                    for (let j = 0; j < this.listServicos[i].servicos?.length; j++) {
                        listFilteredServices.push(this.listServicos[i].servicos[j])
                    }
                }
                //this.pesquisaServicos = listFilteredServices
                this.pesquisaServicos = listFilteredServices.sort((a, b) => (a.nomeServico > b.nomeServico ? 1 : -1))

                this.loadingService.dismiss()
            },
            fail => {
                this.loadingService.dismiss()
            }
        )
    }

    async getHorariosDisponiveisProfissional() {
        await this.loadingService.present()
        if (this.editarAgendamento == 0) { // indica que um agendamento está sendo criado
            if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
                let diaAtual = new Date(this.dataSelecionada);
                diaAtual.setHours(this.dataSelecionada.getHours() + this.fuso);
                this.dataAg = diaAtual.toISOString();
            }
            else {
                this.dataAg = this.dataSelecionada.toISOString();
            }

            this.agendaService.getHorariosDisponiveis(this.profissionalInfo ? this.profissionalInfo.profissionalId : this.userData.authenticatedUser.cliForColsId, this.servicoSelecionado.servicoId,
                // Isso estava no lugar do this.dataAg
                // (this.dadosAgendamento != undefined && this.dadosAgendamento.agendaId == -1 ? this.dadosAgendamento.dia : this.dataAg)
                this.dataAg, this.clienteCadastrado.clienteId).subscribe(
                    result => {
                        this.loadingService.dismiss()
                        this.listHorariosDisponiveis = result

                        /**********************
                            Esse trecho foi comentado pois seria utilizado para demarcar intervalos de marcação para cards de horário livre,
                            mas essa função não será utilizada, pelo menos por enquanto.
                         **********************/

                    },
                    fail => {
                        this.loadingService.dismiss()
                    }
                )

        }
        else if (this.editarAgendamento == 1) {//indica que um agendamento está sendo editado
            let data = DateUtils.DateToString(this.dataSelecionada)
            //data.setHours( data.getHours() + 3)
            this.agendaService.getHorariosDisponiveis(this.profissionalInfo ? this.profissionalInfo.profissionalId : this.userData.authenticatedUser.cliForColsId, this.dadosAgendamento.servicoId, data, this.dadosAgendamento.clienteId).subscribe(
                result => {
                    this.loadingService.dismiss()
                    this.listHorariosDisponiveis = result
                    let horario = this.listHorariosDisponiveis.filter(x => this.horarioAgendadoEdicaoExibicao.horarioInicio == x.horarioInicio)[0]

                    this.horarioSelecionado = this.horarioAgendadoEdicaoExibicao;


                    this.dadosAgendamento.horarioInicio = this.horarioAgendadoEdicaoExibicao.horarioInicio
                    this.dadosAgendamento.horarioFim = this.horarioAgendadoEdicaoExibicao.horarioFinal

                },
                fail => {
                    this.loadingService.dismiss()
                }
            )
        }

    }

    selecionaHorario(event: any) {
        this.horarioSelecionado = this.listHorariosDisponiveis.filter(x => x.horarioInicio == event)[0]

        if (this.editarAgendamento == 1 && this.dadosAgendamento.horarioInicio != this.horarioSelecionado.horarioInicio) { //checa o modal foi aberto no modo edição e se a alteração do serviço selecionou um serviço diferente do que já estava agendado
            this.dadosAgendamento.horarioInicio = this.horarioSelecionado.horarioInicio
            this.dadosAgendamento.horarioFim = this.horarioSelecionado.horarioFinal
            this.editadoBoolean = true //confirma que os dados não batem com os dados originais, portanto houve uma edição
        }

    }

    async personalizarHorario() {
        this.horarioPersonalizado = !this.horarioPersonalizado;
    }

    selecionaHorarioInicio() {
        if ((document.getElementById("since") as HTMLIonDatetimeElement).value > (document.getElementById("until") as HTMLIonDatetimeElement).value)
            (document.getElementById("until") as HTMLIonDatetimeElement).value = (document.getElementById("since") as HTMLIonDatetimeElement).value;
        this.horarioInicio = (((document.getElementById("since") as HTMLIonDatetimeElement).value as string)).split('T')[1].substring(0, 5)+":00";
        //console.log(this.horarioInicio);
        (document.getElementById("until") as HTMLIonDatetimeElement).min = (((document.getElementById("since") as HTMLIonDatetimeElement).value as string)).split('T')[1].substring(0, 5);
        /*
            Erro: TS2339: Property 'split' does not exist on type 'string | string[]'.Property 'split' does not exist on type 'string[]'.
            Solução: https://stackoverflow.com/questions/47813730/error-ts2339-property-split-does-not-exist-on-type-string-string-prope
            Código anterior a solução.
            Código arrumado:  as string adicionados em l 433 e l435
        */
        
        if (!!this.horarioInicio && !!this.horarioFim) {
            if(this.editarAgendamento == 1){

                this.dadosAgendamento.horarioInicio = this.horarioInicio;
                this.dadosAgendamento.horarioFim = this.horarioFim;
                this.editadoBoolean = true;
            }else{
                var horario: any;
                horario = new Object();
                horario.horarioInicio = this.horarioInicio;
                horario.horarioFinal = this.horarioFim;
                this.horarioSelecionado = horario;
            }
        }
    }

    selecionaHorarioFim() {
        if ((document.getElementById("until") as HTMLIonDatetimeElement).value < (document.getElementById("since") as HTMLIonDatetimeElement).value)
            (document.getElementById("since") as HTMLIonDatetimeElement).value = (document.getElementById("until") as HTMLIonDatetimeElement).value;
        this.horarioFim = (((document.getElementById("until") as HTMLIonDatetimeElement).value as string)).split('T')[1].substring(0,5)+":00";
        //console.log(this.horarioFim);
        /*
            Erro: TS2339: Property 'split' does not exist on type 'string | string[]'.Property 'split' does not exist on type 'string[]'.
            Solução: https://stackoverflow.com/questions/47813730/error-ts2339-property-split-does-not-exist-on-type-string-string-prope
            Código anterior a solução.
            this.horarioFim = (((document.getElementById("until") as HTMLIonDatetimeElement).value as string)).split('T')[1].substring(0,5)+":00"
            Código arrumado: Linha 455
        */
        if (!!this.horarioInicio && !!this.horarioFim) {
            if(this.editarAgendamento == 1){

                this.dadosAgendamento.horarioInicio = this.horarioInicio;
                this.dadosAgendamento.horarioFim = this.horarioFim;
                this.editadoBoolean = true;
            }else{
                var horario: any;
                horario = new Object();
                horario.horarioInicio = this.horarioInicio;
                horario.horarioFinal = this.horarioFim;
                this.horarioSelecionado = horario;
            }
        }
    }


    async agendarAtendimento() {
        this.scheduleButtonWaitingAPI = true;
        await this.loadingService.present()
        let agendamento = new AgendamentoProfissionalModel();

        if (this.editarAgendamento == 0) {
            if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
                this.dataSelecionada.setHours(this.dataSelecionada.getHours() + this.fuso);
            }
            agendamento.dataAg = (this.dadosAgendamento != undefined && this.dadosAgendamento.agendaId == -1 ? this.dataSelecionada : this.dataAg)
            agendamento.horarioInicio = this.horarioSelecionado.horarioInicio
            agendamento.horarioFim = this.horarioSelecionado.horarioFinal
            agendamento.servicoId = this.servicoSelecionado.servicoId
            agendamento.clienteId = this.clienteCadastrado.clienteId
            agendamento.agendasId = 0
            agendamento.observacao = this.observacao
            agendamento.profissionalId = (this.profissionalId ? this.profissionalId : this.profissionalInfo.profissionalId)
            this.agendaService.criarAgendamentoProfissional(agendamento).subscribe(
                result => {
                    agendamento.agendasId = result
                    this.scheduleButtonWaitingAPI = false
                    this.loadingService.dismiss()
                    this.ModalController.dismiss(agendamento)
                },
                fail => {
                    this.scheduleButtonWaitingAPI = false
                    this.loadingService.dismiss()
                    this.showError(fail.error)
                }
            )
        }

        else if (this.editarAgendamento == 1) {
            if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
                this.dataSelecionada.setHours(this.dataSelecionada.getHours() + this.fuso);
            }
            agendamento.dataAg = this.dataSelecionada
            agendamento.horarioInicio = this.dadosAgendamento.horarioInicio
            agendamento.horarioFim = this.dadosAgendamento.horarioFim
            agendamento.servicoId = this.dadosAgendamento.servicoId
            agendamento.clienteId = this.dadosAgendamento.clienteId
            agendamento.agendasId = this.dadosAgendamento.agendaId
            agendamento.observacao = this.observacao
            agendamento.profissionalId = (this.profissionalId ? this.profissionalId : this.profissionalInfo.profissionalId)
            this.agendaService.updateAgendamento(agendamento.agendasId, agendamento).subscribe(
                result => {
                    agendamento.agendasId = result
                    this.loadingService.dismiss()
                    this.dadosAgendamento.dia = this.dadosAgendamento.dia.toISOString().split('T')[0] + 'T00:00:00'; //Essa linha converte representação de data de agendamento para comparação em botao iniciar atendimento, (NÃO REMOVER).
                    this.ModalController.dismiss({ agendamento: agendamento, servico: this.servicoSelecionado })
                },
                fail => {
                    this.loadingService.dismiss()
                    this.showError(fail.error);
                }
            )
        }

    }

    showError(error: string) {
        if (error == 'API.OAGENDAMENTO.MARCARAGENDAMENTOPROFISSIONAL.NAOPERMITESIMULTANEIDADE') {
            this.toast.presentToast(this.translate.instant('AGENDA.ERROR.NAOPERMITESIMULTANEIDADE'), 'danger', 5000);
        }
        else if (error == 'API.OAGENDAMENTO.MARCARAGENDAMENTOPROFISSIONAL.HORARIONAODISPONIVEL') {
            this.toast.presentToast(this.translate.instant('AGENDA.ERROR.HORARIONAODISPONIVEL'), 'danger', 5000);
        }
        else if (error == 'API.OAGENDAMENTO.MARCARAGENDAMENTOPROFISSIONAL.HORARIONOINTERVALO') {
            this.toast.presentToast(this.translate.instant('AGENDA.ERROR.HORARIOINTERVALO'), 'danger', 5000);
        }
        else if (error == 'API.OAGENDAMENTO.ALTERARAGENDAMENTOPROFISSIONAL.HORARIONAODISPONIVEL') {
            this.toast.presentToast(this.translate.instant('AGENDA.ERROR.HORARIONAODISPONIVEL'), 'danger', 5000);
        }
        else if (error == 'API.OAGENDAMENTO.ALTERARAGENDAMENTOPROFISSIONAL.NAOPERMITEENCAIXE') {
            this.toast.presentToast(this.translate.instant('AGENDA.ERROR.NAOPERMITEENCAIXE'), 'danger', 5000);
        }
        else if (error == 'API.OAGENDAMENTO.ALTERARAGENDAMENTOPROFISSIONAL.HORARIONOINTERVALO') {
            this.toast.presentToast(this.translate.instant('AGENDA.ERROR.HORARIOINTERVALO'), 'danger', 5000);
        }
        else{
            this.toast.presentToast("Erro!", 'danger', 5000);
        }
    }

    selectTab(index: number) {
    }

    atualizaMinDateFinal(event: any) {

        // Verifica se o cliente e serviço estão selecionados correntamente
        if (!!this.box_servico.value.descricaoServico && !!this.box_servico.value.nomeCliente) {
            this.clienteCadastrado = this.box_servico.value.nomeCliente;
            this.servicoSelecionado = this.box_servico.value.descricaoServico;
        }

        // Obtem os horários disponíveis do profissionais se cliente e serviço foram selecionados
        if (this.clienteCadastrado != null
            && this.clienteCadastrado != undefined
            && this.servicoSelecionado != null
            && this.servicoSelecionado != undefined) {
            this.getHorariosDisponiveisProfissional()
        }

    }

    selecionaHorarioButton(event: any, horario: any) {

        if (this.isIEOrEdgeOrFF == false) {
            if (this.horarioSelecionadoButton != undefined && this.horarioSelecionadoButton != event.target) {
                //Verificar se o child nodes é nulo ou undefined para corrigir o erro com o childNodes[0]
                if (this.horarioSelecionadoButton.shadowRoot.childNodes[0].children[0] != null || this.horarioSelecionadoButton.shadowRoot.childNodes[0].children[0] != undefined) {
                    this.horarioSelecionadoButton.shadowRoot.childNodes[0].children[0].style.color = "var(--ion-color-primary)"
                    this.horarioSelecionadoButton.shadowRoot.childNodes[0].setAttribute('style', 'background-color: white !important')
                }
                else {
                    this.horarioSelecionadoButton.shadowRoot.childNodes[1].children[0].style.color = "var(--ion-color-primary)"
                    this.horarioSelecionadoButton.shadowRoot.childNodes[1].setAttribute('style', 'background-color: white !important')
                }
            }
            //Verificar se o child nodes é nulo ou undefined para corrigir o erro com o childNodes[0]

            if (event.target.shadowRoot.childNodes[0].children[0] != null || event.target.shadowRoot.childNodes[0].children[0] != undefined) {
                event.target.shadowRoot.childNodes[0].setAttribute('style', 'background-color: var(--ion-color-primary) !important')
                event.target.shadowRoot.childNodes[0].children[0].style.color = "white"
            }
            else {
                event.target.shadowRoot.childNodes[1].setAttribute('style', 'background-color: var(--ion-color-primary) !important')
                event.target.shadowRoot.childNodes[1].children[0].style.color = "white"
            }


            this.horarioSelecionadoButton = event.target;
            this.horarioSelecionado = horario

            //this.horarioSelecionado = this.listHorariosDisponiveis.filter(x => x.horarioInicio == event)[0]

            if (this.editarAgendamento == 1 && this.dadosAgendamento.horarioInicio != this.horarioSelecionado.horarioInicio) { //checa o modal foi aberto no modo edição e se a alteração do serviço selecionou um serviço diferente do que já estava agendado
                this.dadosAgendamento.horarioInicio = this.horarioSelecionado.horarioInicio
                this.dadosAgendamento.horarioFim = this.horarioSelecionado.horarioFinal
                this.editadoBoolean = true //confirma que os dados não batem com os dados originais, portanto houve uma edição
            }



        }
        else {
            if (this.horarioSelecionadoButton != undefined && this.horarioSelecionadoButton != event.target) {
                //Verificar se o childnodes é nulo ou undefined para corrigir o erro com o childNodes[0]
                if (this.horarioSelecionadoButton.shadowRoot.childNodes[0].children[0] != null || this.horarioSelecionadoButton.shadowRoot.childNodes[0].children[0] != undefined) {
                    this.horarioSelecionadoButton.shadowRoot.childNodes[0].children[0].style.color = "var(--ion-color-primary)"
                    this.horarioSelecionadoButton.shadowRoot.childNodes[0].setAttribute('style', 'background-color: white !important')
                }
                else {
                    this.horarioSelecionadoButton.shadowRoot.childNodes[1].children[0].style.color = "var(--ion-color-primary)"
                    this.horarioSelecionadoButton.shadowRoot.childNodes[1].setAttribute('style', 'background-color: white !important')
                }
            }
            //Verificar se o childnodes é nulo ou undefined para corrigir o erro com o childNodes[0]
            if (event.target.shadowRoot.childNodes[0].children[0] != null || event.target.shadowRoot.childNodes[0].children[0] != undefined) {
                event.target.shadowRoot.childNodes[0].children[0].style.color = "white"
                event.target.shadowRoot.childNodes[0].setAttribute('style', 'background-color: var(--ion-color-primary) !important')
            }
            else {
                event.target.shadowRoot.childNodes[1].children[0].style.color = "white"
                event.target.shadowRoot.childNodes[1].setAttribute('style', 'background-color: var(--ion-color-primary) !important')
            }


            this.horarioSelecionadoButton = event.target;
            this.horarioSelecionado = horario

            //this.horarioSelecionado = this.listHorariosDisponiveis.filter(x => x.horarioInicio == event)[0]

            if (this.editarAgendamento == 1 && this.dadosAgendamento.horarioInicio != this.horarioSelecionado.horarioInicio) { //checa o modal foi aberto no modo edição e se a alteração do serviço selecionou um serviço diferente do que já estava agendado
                this.dadosAgendamento.horarioInicio = this.horarioSelecionado.horarioInicio
                this.dadosAgendamento.horarioFim = this.horarioSelecionado.horarioFinal
                this.editadoBoolean = true //confirma que os dados não batem com os dados originais, portanto houve uma edição
            }

        }

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


    onResize(event: any) {
        this.getScreenSize()
    }

    getParametrosLight() {
        this.agendaService.getParametrosLight().subscribe(
            result => {
                let userData = JSON.parse(localStorage.getItem('one.user'))
                this.gatilhoCadastro = result.colaboradorCadastrarCliente || userData.authenticatedUser.perfilGerente;

            },
            fail => {
            }
        );
    }

    async openCadastroRapidoModal() {
        this.overlayDivControl = true;
        const modal = await this.ModalController.create({
            component: CadastroRapidoClienteComponent,
            backdropDismiss: true,
            cssClass: 'modalCadastroRapido'
        });

        modal.onDidDismiss().then(res => {
            this.overlayDivControl = false;
            if (!!res.data) {
                this.pesquisaClientes(res.data);
                this.box_cliente.handleNavigationOpen();
            }
        });

        return await modal.present()
    }

    //Função para ocultar email do cliente
    mascaraEmail(email: String) {
        var index = email.lastIndexOf("@");
        var prefix = email.substring(0, index);
        var postfix = email.substring(index);
        var mask = prefix.split('').map(function (o, i) {
            if (i <= 1) {
                return o;
            } else {
                return '*';
            }
        }).join('');
        return (mask + postfix);

    }
    //Função para ocultar telefone do cliente
    mascaraTelefone(telefone: String) {
        if (telefone?.length >= 1) {
            var index = telefone?.length - 4;
            var prefix = telefone.substring(0, index);
            return (prefix + "-****");
        }
        return this.translate.instant('AGENDA.MODALS.NOVOAGENDAMENTOPROFISSIONAL.NAOCADASTRADO');
    }
    //Função para tratar estas informações
    alteraRetorno(lista: any) {
        for (let i of lista) {
            i.email = this.mascaraEmail(i.email);
            if (i.celular != undefined) {
                i.celular = this.mascaraTelefone(i.celular);
            }
        }
        return lista;
    }

}

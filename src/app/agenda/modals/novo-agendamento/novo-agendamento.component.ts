import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { NavController, IonSlides, AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ToastService } from 'app/core/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { AgendaService } from '../../services/agenda.service'
import { FormGroup, FormBuilder, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { DateUtils } from 'app/core/common/data-type-utils/date-utils'
import { AgendamentoModel } from '../../models/agendamentoModel'
import { AgendamentoClienteDependenteModel } from '../../models/agendamentoClienteDependenteModel'
import { LoadingService } from '../../../core/services/loading.service';
import { ConfirmacaoAgendamentoComponent } from '../../modals/confirmacao-agendamento/confirmacao-agendamento.component'
import { AvaliarAppModalComponent } from '../../modals/avaliar-app-modal/avaliar-app-modal.component'
import { ServicoAssinaturaMarcadoComponent } from '../servico-assinatura-marcado/servico-assinatura-marcado.component';
import { Calendar } from '@ionic-native/calendar/ngx';
import { HorariosPorProfissionaisModel } from '../../models/horariosPorProfissionaisModel'
import { environment } from 'environments/environment';
import { usuarioSelecionavel } from '../../models/cliforColsAssociacaoModel'
import { InadimplenciaComponent } from '../mensagem-inadimplencia/mensagem-inadimplencia.component';
import { CurriculoComponent } from '../curriculo/curriculo-modal.component';

@Component({
  selector: 'app-novo-agendamento',
  templateUrl: './novo-agendamento.component.html',
  styleUrls: ['./novo-agendamento.component.scss'],
})
export class NovoAgendamentoComponent implements OnInit, AfterViewInit {

  @ViewChild('SwipedTabsSlider') SwipedTabsSlider: IonSlides;
  public teste: boolean = true;
  public segment: any = '';
  public lastSegment: any = 'servicos'//variavel para, caso o cliente veja todos os horarios ou selecione o profissional o botão de voltar/prosseguir funcionar corretamente
  public widthpercentage: any;
  public gServicosDisponiveis: any;
  public indexAtualSegment: number = 0;
  public servicosSelecionados: any = [];
  public servicosSelecionadosArray: any = [];
  public count: number = 0;
  public servicosMarcados: any = [];
  public marcados: boolean = true;
  public matrizCheck: any;
  public fuso: any;
  public controllerServProd: any; // recebida pra saber em qual segment começar
  public semFoto = 'https://oneproducao.blob.core.windows.net/one2/Imagens/Sem_FotoPerfil.png';
  public listaProfissionaisDisponiveis: any = [];
  public listaHorariosDisponiveis: any = [];
  public profissionaisSelecionados: any = [];
  public listaHorariosDisponiveisControl: any = [];
  public posicao: number = 0;
  public scrollOne: any;
  public scrollTwo: any;
  public scrollLeft: number;
  public listNovosAgendamentos: any = [];
  public dataSelecionada: any;
  public listaIds: any = [];
  public controlButtons: any = [];
  public idCount: number = 0;
  public horariosSelecionados = []
  public dataExibicao: any;
  public defaultItem: any;
  public listDefaultItem: any = []; //essa lista armazenará os profissionais selecionados, para que quando o usuario clique no botão de voltar, os profissionais ainda estejam selecionados

  public agendamentoSucess: any = 0;
  public agendamentoFailed: any = 0;
  public messageAgendamentoFailed: any;
  public nameServiceFailed: any;
  public ListServiceFailed: any = [];
  public ListServiceSuccess: any = [];

  public isIEOrEdgeOrFF: boolean
  public isChrome: boolean

  public parametrosLight: any;
  public servicoSelecionadoInfo: any;
  public servicoCheckingInfo: any;
  public profissionalSelecionadoInfo: any;
  public didInit: boolean = false;
  public userData: any;
  public listBotoesDesabilitados = []
  public horariosProfissionalId: Array<any> = []; // responsavel por armazenar todos os horarios disponiveis de todos os profissionais que realizam serviço
  public listHorariosExib: Array<any> = []; // responsavel por armazenar os vetores de horarios vet, caso haja repetição de serviço
  public horariosVet: Array<any> = [];
  public listaCarregada: boolean = false;
  public maxServico: boolean = false;//caso o cliente tente marcar mais de 5 serviços
  public informativo: boolean = false

  public buttonIndexesCol = []// responsável por armazenar a a qual coluna e qual linha e qual serviço o horario marcado pertence, para que seja possível estiliza-lo caso o usuario deseje alterar alguma das configurações do agendamento após chegar na tela de resumo.
  public horariosList: string[] = []; // Armazena o horário selecionado de cada coluna
  public profissionaisList: any[] = []; // Armazena os profissionais selecionados de cada coluna
  public classHorario = 'selec-horario';
  public classProfissional = 'selec-profissional';
  public colaboradorCheck: any = []
  public allProfissionais:any // busca de todos os profissionais para o caso de o cliente selecionar ver o colaborador antes dos serviços
  public profissionalEscolhidoCliente:any //profissional selecionado quando a guia de seleção de profissional vem antes da de serviço
  public loaderInfo = {
    start: 0,
    end: 0
  };

  public formGroup: FormGroup;
  public maxInicio: Date;
  public minFim: Date;
  public maxFim: Date;
  public minInicio: Date = new Date();

  public scheduleButtonWaitingAPI: boolean = false; //faz o controle do bloqueio do botão para que não seja possível acionar o mesmo no intervalo de espera do retorno da API de agendar

  // constructor(private ModalController: ModalController) { }
  SwipedTabsIndicator: any = null;
  tabs: any = [];


  public screenHeight: any;
  public screenWidth: any;
  public divHeight: any;
  public columnTimes: any;
  public linguaPais: any;
  public slideContentHeight: any;
  public temHorario: boolean = false;
  public basehref: any;
  public cardHeight: any;

  public horariosProfissionaisDia: Array<HorariosPorProfissionaisModel>;
  public usuarioSelecionado: usuarioSelecionavel;


  //@HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    // this.addAppointmentButtonHeight = this.screenHeight - 90;
    // this.addAppointmentButtonHeight = this.addAppointmentButtonHeight.toString() + 'px'
    this.cardHeight = this.screenHeight - 190 - 150 - 50 - 50
    this.divHeight = this.screenHeight - 180
    this.columnTimes = this.screenHeight - 420
    this.columnTimes = this.columnTimes.toString() + 'px'
    this.divHeight = this.divHeight.toString() + 'px'
    this.cardHeight = this.cardHeight.toString() + 'px'
    this.slideContentHeight = innerHeight - 200
    this.slideContentHeight = this.slideContentHeight.toString() + 'px'
  }





  constructor(public navCtrl: NavController,
    private ModalController: ModalController,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    private elementRef: ElementRef,
    public translate: TranslateService,
    private loadingService: LoadingService,
    private agendaService: AgendaService,
    private alertController: AlertController,
    private Calendar: Calendar,
    private cd: ChangeDetectorRef) {
    this.loadingService.present()
    this.agendaService.getServicosDisponiveis().subscribe(
      result => {
        if(this.controllerServProd==1){
          this.segment='servicos'
          this.lastSegment = 'servicos'
        }
        else{
          this.agendaService.getTodosProfissionais().subscribe(
            result=>{ this.allProfissionais=result
              this.segment='selecionaProfissional'
              this.lastSegment='selecionaProfissional'
            },
            fail=>{}
          )
        }
        this.loadingService.dismiss()
        this.gServicosDisponiveis = result
        this.servicosSelecionados = new Array(this.gServicosDisponiveis?.length)
        for (let i = 0; i < this.gServicosDisponiveis?.length; i++) {
          for (let j = 0; j < this.gServicosDisponiveis[i].servicos?.length; j++) {
            this.servicosSelecionados[i] = new Array(this.gServicosDisponiveis[i].servicos?.length).fill(false)
          }
        }
        this.servicosSelecionados
      },
      fail => {
        this.loadingService.dismiss()
      }
    )
  }


  ngOnInit() {
    this.basehref = localStorage.getItem('basehref');
    this.isIEOrEdgeOrFF = /msie\s|Firefox|trident\/|edge\//i.test(window.navigator.userAgent)
    this.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    this.getScreenSize()
    this.userData = JSON.parse(localStorage.getItem('one.user'))
    this.agendaService.currentMessage.subscribe(message => {
      if (message != 'default message') {
        this.usuarioSelecionado = JSON.parse(message);
      }
      else {
        this.usuarioSelecionado = new usuarioSelecionavel();
        this.usuarioSelecionado.cliforcolsId = this.userData.authenticatedUser.cliForColsId;
        this.usuarioSelecionado.nome = this.userData.authenticatedUser.nomeUsuario;
      }
    })
    let user = JSON.parse(localStorage.getItem('one.user'));
    let filial = user.authenticatedBranch;
    this.fuso = parseInt(filial.fuso, 10);
    this.linguaPais = filial.linguaPais;
    this.getParametrosLight();
    this.formGroup = this.formBuilder.group({
      dataInicio: new FormControl(new Date(), Validators.compose([
        Validators.required
      ])),
      dataFim: new FormControl(new Date(), Validators.compose([
        Validators.required
      ])),
    })

    this.minInicio = new Date()
    this.maxInicio = new Date();
    this.minFim = this.formGroup.value.dataInicio;
    this.maxFim = new Date();



    this.widthpercentage = 100 / this.tabs?.length
    this.widthpercentage = this.widthpercentage + '%'

    let dateStart: Date = this.formGroup.value.Start;
    let dateEnd: Date = this.formGroup.value.End;
    //this.updateIndicatorPosition()
    //this.selectFirstTab()
  }

  horariosProfissionais(dia: string) {
    if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
      let dataAgDateTime = new Date(dia);
      dataAgDateTime.setHours(dataAgDateTime.getHours() + this.fuso);
      dia = DateUtils.DateToString(dataAgDateTime);
    }
    this.loadingService.present()
    let servicosId = this.servicosMarcados.map(({ servicoid }) => servicoid)
    this.agendaService.getHorariosProfissionaisDia(servicosId, dia).subscribe(//API que retorna todos os profissionais, que trabalham nesse dia, que fazem o serviço que foi marcado.
      result => {
        this.horariosProfissionaisDia = result;

        let profissionais = new Array<any>();
        let horarios = new Array<any>();

        this.horariosProfissionaisDia.forEach((el) => {
          profissionais = new Array<any>();
          horarios = new Array<any>();
          el.disponibilidades.forEach(element => {
            horarios.push({
              horariosDisponiveis: element.horarios,
              profissionalId: element.profissionalId,
            })
            profissionais.push({
              profissionalId: element.profissionalId,
              nome: element.profissionalNome,
              foto: element.profissionalFoto,
              permiteSimultaneidadeDeOutroServico: element.profissionalSimultaneidade,
              profissaoId: element.profissaoId,
              profissao: element.profissao,
              instagram: element.instagram,
              curriculo: element.curriculo
            })
          })
          this.listaProfissionaisDisponiveis.push(profissionais)
          this.horariosVet.push(horarios)
        })

        /*
        Profissionais disponiveis
        */

        for (let i = 0; i < this.listaProfissionaisDisponiveis?.length; i++) {
          for (let j = 0; j < this.listaProfissionaisDisponiveis[i]?.length; j++) {
            this.listaProfissionaisDisponiveis[i][j]['servicoNome'] = this.servicosMarcados[i].infoServico.descricao
          }
        }
        this.listDefaultItem = new Array(this.listaProfissionaisDisponiveis?.length + 1).fill(0)
        this.defaultItem = { text: 'Tem preferência de profissional?' }
        for (let i = 0; i < this.listDefaultItem?.length; i++) {
          this.listDefaultItem[i] = this.defaultItem
        }
        this.listaHorariosDisponiveis = new Array(this.listaProfissionaisDisponiveis?.length).fill(0)
        this.listaHorariosDisponiveisControl = new Array(this.listaProfissionaisDisponiveis?.length).fill(0)
        this.profissionaisSelecionados = new Array(this.listaProfissionaisDisponiveis?.length).fill(0)

        /*
        Horários desses profissionais
        */

        for (let i = 0; i < this.horariosVet?.length; i++) {
          for (let j = 0; j < this.horariosVet[i]?.length; j++) {
            this.horariosVet[i][j].servicoId = this.servicosMarcados[i].servicoid
            this.horariosVet[i][j].horariosDisponiveis.map(x => x['disabled'] = false) //add o atributo de controle de disponibilidade do botão para cada horário
            this.horariosVet[i][j] = Object.assign(this.listaProfissionaisDisponiveis[i][j], this.horariosVet[i][j])
            this.horariosVet[i][j].semHorario = this.horariosVet[i][j].horariosDisponiveis?.length == 0

          }
        }

        this.ordenaSimultaneo()

        this.listHorariosExib = this.horariosVet.map(val => val)
        this.temHorario = this.listHorariosExib?.length != 0
        this.listaCarregada = this.listHorariosExib?.length != 0



        this.loadingService.dismiss()

      },
      fail => {
        if (fail.error == "API.OPROFISSIONAIS.HORARIOSTODOSPROFISSIONAISDIA.SERVICOASSINATURAJAMARCADO") {
      }
    }
    )
  }

  styleChange(posServ :number, posProf: number){
    if((this.listHorariosExib[posServ][posProf].curriculo != null || this.listHorariosExib[posServ][posProf].curriculo != undefined) && this.listHorariosExib[posServ][posProf].curriculo.trim() != '' ){
      return 'imagemOneCurriculo'
    }
  }

    profissionalSelecionado(profissionalSelecionado){
      this.profissionalEscolhidoCliente = profissionalSelecionado
      this.agendaService.getServicosProfissionalCliente(profissionalSelecionado.profissionalId).subscribe(
        result=>{
          this.gServicosDisponiveis = result
          this.lastSegment = 'selecionaProfissional'
          this.segment='servicos'
        },
        fail=>{}
      )
    }

  async openCurriculo(i:number, j:number){
    if((this.listHorariosExib.length!=0 && this.listHorariosExib !=undefined && (this.listHorariosExib[i][j]?.curriculo != null || this.listHorariosExib[i][j]?.curriculo != undefined) && this.listHorariosExib[i][j]?.curriculo.trim() != '')){
      var profList = this.listHorariosExib[i][j]}
    else if((this.allProfissionais.length !=0 && this.allProfissionais != undefined) &&(this.allProfissionais[i].curriculo != null || this.allProfissionais[i].curriculo != undefined) && this.allProfissionais[i].curriculo.trim() != ''){
      var profList = this.allProfissionais[i]
    }
    const modal = await this.ModalController.create({
      component: CurriculoComponent,
       componentProps: {
         profissional:profList
       },
      backdropDismiss: false,
      cssClass: 'curriculo'
    })
    modal.onDidDismiss().then(retorno => {
    })
    return await modal.present()
}

  async servicoJaMarcado(id:number) {
    await this.agendaService.getNomeServicoAgendamento(id).then(
      result=>{
        this.openModalServicoJaMarcado(id, result.nomeServico)
      },
      fail=>{

      })
  }

   async openModalServicoJaMarcado(id:number, nome:any){
      const modal = await this.ModalController.create({
        component: ServicoAssinaturaMarcadoComponent,
         componentProps: {
          servNome: nome,
          agendaService:this.agendaService,
           agendamentoId: id
        //   listNovosAgendamentos : this.listNovosAgendamentos
         },
        backdropDismiss: false,
        cssClass: 'servicoJaMarcado'
      })
      modal.onDidDismiss().then(retorno => {
        if(retorno.data == 1){// se retornar 1, o modal de alerta foi finalizado pelo botão de cancelar, ou seja o cliente deseja manter o agendamento ja marcado, ou seja, impeço ele de agendar 
          if(this.listNovosAgendamentos.length == 1){
            this.ModalController.dismiss(undefined,undefined,'novoAgendamentoId')
          }
          else{
            var mappedService = this.listNovosAgendamentos.map(x=> x.servico == nome)
            for(let i=0 ; i<this.listNovosAgendamentos.length;i++){
              if(mappedService[i]==true){
                this.removerAgendamento(i)
              }
            }
          }
        }
      })
      return await modal.present()
    }

  inicializaSearchList(value: string, servicoPos: number) {
    this.listHorariosExib[servicoPos] = this.search(value.toLowerCase(), servicoPos);
  }
  search(value: string, servicoPos: number) {
    return this.horariosVet[servicoPos].filter((x) => x.nome.toLowerCase().includes(value));
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

  ngAfterViewInit() {
    this.cd.detectChanges();
    this.didInit = true;
  }

  onStartDateChange(event: Date) {
    this.minFim = new Date(event.getFullYear(), event.getMonth(), event.getDate(), event.getHours(), event.getMinutes() + 5);
  }

  closeModal() {
    this.ModalController.dismiss()
  }
  selectTab(index: number) {
    if (this.indexAtualSegment != index) {
      document.getElementsByTagName('ion-segment-button')[this.indexAtualSegment].style.borderBottom = "0px"
      document.getElementsByTagName('ion-segment-button')[this.indexAtualSegment].style.color = "#00000099"
      document.getElementsByTagName('ion-segment-button')[index].style.color = "var(--ion-color-primary)"
      document.getElementsByTagName('ion-segment-button')[index].style.borderBottom = "2px solid var(--ion-color-primary)"
      //document.getElementsByTagName('ion-segment-button')[index].style.borderBottom = "0.5px solid var(--ion-color-primary) !important;"
      this.indexAtualSegment = index;
    }

    // this.SwipedTabsIndicator.style.webkitTransform = 'translate3d('+(100*index)+'%,0,0)';
    //document.getElementsByTagName('ion-segment-button')[index].style.borderBottom = "2px solid var(--ion-color-primary)"
    this.SwipedTabsSlider.slideTo(index, 500);
  }

  selectFirstTab() {
    setTimeout(() => {
      let firstTab = document.getElementsByClassName('gservs')[0] as HTMLElement;
      firstTab.style.color = "var(--ion-color-primary)"
      firstTab.style.borderBottom = "2px solid var(--ion-color-primary)"
      this.indexAtualSegment = 0;
    }, 700);
  }


  async updateIndicatorPosition() {
    let indexSlide = await this.SwipedTabsSlider.getActiveIndex()

    document.getElementById("segment-" + indexSlide).scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
    // this condition is to avoid passing to incorrect index
    this.selectTab(indexSlide)
    if (this.SwipedTabsSlider?.length() > this.SwipedTabsSlider.getActiveIndex()) {
      // this.SwipedTabsIndicator.style.webkitTransform = 'translate3d('+( this.SwipedTabsSlider.getActiveIndex() as any * 100)+'%,0,0)';
    }

  }

  desmarcaServico(){
    for(let i =0; i<this.servicosSelecionados.length;i++){
      for(let j=0 ; j<this.servicosSelecionados[i].length;j++){
        if(this.servicosSelecionados[i][j]==true){
          this.servicosSelecionados[i][j]=false
          this.maxServico = false
        }
      }
    }
  }


  marcarServico(i, j) {
    this.servicosMarcados = []
    this.marcados = true
    if (this.servicosMarcados.filter(x => x == this.gServicosDisponiveis[i].servicos[j].servicosId)?.length != 0) {
      this.servicosMarcados = this.servicosMarcados.filter(x => x != this.gServicosDisponiveis[i].servicos[j].servicosId)
    }
    this.matrizCheck = this.servicosSelecionados
    for (let k = 0; k < this.matrizCheck?.length; k++) {
      for (let l = 0; l < this.matrizCheck[k]?.length; l++) {
        if (this.matrizCheck[k][l] == true) {
          if(this.lastSegment=='selecionaProfissional'){ // ESSE IF EXISTE PURO E SIMPLESMENTE PQ SE O CLIENTE VIER PELO CAMINHO DED PROFISSIONAL 1, A VARIAVEL CHAMA SERVICOID E NÃO SERVICOSID
            this.servicosMarcados.push({ servicoid: this.gServicosDisponiveis[k].servicos[l].servicoId, infoServico: this.gServicosDisponiveis[k].servicos[l] })
            this.marcados = false
            if (this.servicosMarcados?.length == 5 || this.lastSegment == 'selecionaProfissional')
              this.maxServico = true;
          }
          else{     
            this.servicosMarcados.push({ servicoid: this.gServicosDisponiveis[k].servicos[l].servicosId, infoServico: this.gServicosDisponiveis[k].servicos[l] })
            this.marcados = false
            if (this.servicosMarcados?.length == 5)
              this.maxServico = true;
          }
        }
      }
    }


  }

  checkBoxSelectionFromText(i: number, j: number) {

    if (this.servicosSelecionados[i][j] == true) {
      this.servicosSelecionados[i][j] = false
      this.maxServico = false
      this.marcarServico(i, j)
    }
    else {
      if (this.servicosMarcados?.length < 5 && this.lastSegment != 'selecionaProfissional') {
        this.servicosSelecionados[i][j] = true
        this.marcarServico(i, j)
      }
      else if(this.servicosMarcados?.length<1 && this.lastSegment == 'selecionaProfissional'){
        this.servicosSelecionados[i][j] = true
        this.marcarServico(i, j)
      }
      else {
        this.maxServico = true
        if(this.lastSegment != 'selecionaProfissional'){
        this.toast.presentToast(this.translate.instant('AGENDA.5SERVICOS'), 'danger');
        }
        else{
          this.toast.presentToast(this.translate.instant('AGENDA.1SERVICO'), 'danger');
        }
      }
    }

  }
  ordenaSimultaneo() { // Simultaneidade só funciona se agendar serviços simultaneos em seguida, esse código coloca na ordem de simultaneidade correta
    let servicosSimultaneos: Array<any> = [];
    for (let i = 0; i < this.servicosMarcados?.length; i++) {
      if (this.horariosVet[i][0].permiteSimultaneidadeDeOutroServico == true) {
        servicosSimultaneos.push(this.horariosVet[i])
      }
    }
    if (servicosSimultaneos?.length > 1) {//só termina o código se tiver algum serviço com simultaneida
      this.spliceHorario()
      this.forceReorder(servicosSimultaneos)
    }
  }

  spliceHorario() { //remove os serviços com simultaneidade do vetor
    for (let i = this.servicosMarcados?.length - 1; i >= 0; i--) {
      if (this.horariosVet[i][0].permiteSimultaneidadeDeOutroServico == true) {
        this.horariosVet.splice(i, 1)
      }
    }
  }

  async forceReorder(servicosSimultaneos: any) { //Atribui a ordem de simultaneos ao vetor principal
    for (let i = 0; i < this.horariosVet?.length; i++) {

      servicosSimultaneos.push(this.horariosVet[i])
    }
    this.horariosVet = []
    this.horariosVet = servicosSimultaneos
  }

  async onSubmit() {
    if (this.segment == 'servicos') {
      if(this.lastSegment=='selecionaProfissional'){
        let dataInicial = new Date()
        let fullDate = new Date(dataInicial.getFullYear(), dataInicial.getMonth(), dataInicial.getDate(), 0, 0, 0, 0)
        this.atualizaMinDateFinal(fullDate.toISOString())
      }
      else{
        this.segment = 'teste'
        let dataInicial = new Date()
        let fullDate = new Date(dataInicial.getFullYear(), dataInicial.getMonth(), dataInicial.getDate(), 0, 0, 0, 0)
        this.atualizaMinDateFinal(fullDate.toISOString())
      }
    }
    else if (this.segment == 'teste') {
      let servicosId : number[] = this.servicosMarcados.map(({ servicoid }) => servicoid);
      await this.agendaService.getClienteAsssinaturaJaMarcado(servicosId).then(
       async result => {
          if(result == 0){
          }
          else {
              await this.servicoJaMarcado(result);
          }
          // this.servicoJaMarcado(result);    
        },
        fail => {
            if (fail.error == "API.OPROFISSIONAIS.HORARIOSTODOSPROFISSIONAISDIA.SERVICOASSINATURAJAMARCADO") {
          }
        }
      )
      this.segment = 'check'
    }
    else if(this.segment == 'teste2'){
      this.lastSegment= 'teste2'
      let servicosId : number[] = this.servicosMarcados.map(({ servicoid }) => servicoid);
      await this.agendaService.getClienteAsssinaturaJaMarcado(servicosId).then(
        result => {
          if(result == 0){
          }
          else {
            this.servicoJaMarcado(result);
          }
          // this.servicoJaMarcado(result);    
        },
        fail => {
            if (fail.error == "API.OPROFISSIONAIS.HORARIOSTODOSPROFISSIONAISDIA.SERVICOASSINATURAJAMARCADO") {
          }
        }
      )
      this.segment = 'check'
    }
    else if (this.segment == 'profissional') {

      if (this.servicosMarcados?.length > this.listNovosAgendamentos?.length) {
        this.segment = "teste"
      }
      else {
        this.segment = 'calendario'
      }

    }
    else if (this.segment == 'calendario') {

      this.encerrarAg()
    }
    else if (this.segment == 'check') {


      if (this.userData.authenticatedUser.email == 'visitante@onebeleza.com.br') {
        const alert = await this.alertController.create({

          mode: "ios",
          header: this.translate.instant('AGENDA.MODALS.NOVOAGENDAMENTO.VISITANTE'),
          message: this.translate.instant('AGENDA.MODALS.NOVOAGENDAMENTO.TEXTOVISITANTE'),
          buttons: [
            {
              text: "OK",
              role: 'cancel',
              handler: (blah) => {
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
                var url = window.location.origin;
                //eh necessario testar se esta em producao, pois a url precisa do nome do applicativo
                document.location.href = environment.production ? `${url}/${this.basehref}/login` : document.location.href = `${url}/login`
              }
            }
          ]
        });

        await alert.present();
      }
      else {
        await this.criarAgendamentos()

      }

    }
  }


  returnPage() {
    if (this.segment == 'teste') {
      this.segment = 'servicos'
      this.horariosProfissionalId = []
      this.listHorariosExib = []
      this.horariosVet = []
      this.listBotoesDesabilitados = []
      this.listNovosAgendamentos = []
      this.horariosSelecionados = []
      this.reinicializaCheck()
    }
    else if (this.segment == 'profissional') {
      this.segment = 'teste'
    }
    else if (this.segment == 'servicos') {
      if(this.lastSegment=='selecionaProfissional'){
        this.desmarcaServico()
        this.horariosProfissionalId = []
        this.listHorariosExib = []
        this.horariosVet = []
        this.listBotoesDesabilitados = []
        this.listNovosAgendamentos = []
        this.horariosSelecionados = []
        this.segment='selecionaProfissional'
      }
      else{
        this.ModalController.dismiss()
      }
    }
    if(this.segment=='teste2'){
      this.lastSegment= 'selecionaProfissional'
      this.segment = 'servicos'
    }
    else if (this.segment == 'check') {
      if(this.lastSegment == 'teste2'){
        this.segment = 'teste2'
        
      //marcar os botões que estavam selecionados aqui, é necessário pois quando voltar os botões serão gerados novamente, portanto deve-se estiliza-los denovo
      this.selectedButtonStyle()

      // marca o horário e profissional que haviam sido selecionados. É necessário pois ao voltar na tela, as labels estão vazias
      this.setProfissionalEHorario();
      }
      else if(this.segment == 'selecionaProfissional'){
        this.ModalController.dismiss()
        this.servicosSelecionados[0][0] = false
      }
      else{
      this.segment = 'teste'


      //marcar os botões que estavam selecionados aqui, é necessário pois quando voltar os botões serão gerados novamente, portanto deve-se estiliza-los denovo
      this.selectedButtonStyle()

      // marca o horário e profissional que haviam sido selecionados. É necessário pois ao voltar na tela, as labels estão vazias
      this.setProfissionalEHorario();
      }
    }
  }

  async removerAgendamento(servicoPos: number) {
    this.resetHorarios(this.servicosMarcados[servicoPos].servicoid)
    this.listHorariosExib.splice(servicoPos, 1)
    this.listNovosAgendamentos.splice(servicoPos, 1)
    this.horariosSelecionados.splice(servicoPos, 1)
    this.listaProfissionaisDisponiveis.splice(servicoPos, 1)
    // Desmarca os checked ao excluir um serviço da lista de selecionados
    for (let i = 0; i < this.gServicosDisponiveis?.length; i++) {
      for (let j = 0; j < this.gServicosDisponiveis[i].servicos?.length; j++) {
        if (this.gServicosDisponiveis[i].servicos[j].descricao == this.servicosMarcados[0].infoServico.descricao) {
          this.servicosSelecionados[i][j] = false
        }
      }
    }
    this.servicosMarcados.splice(servicoPos, 1)
    if (this.servicosMarcados?.length == 0 || this.listHorariosExib?.length == 0) {
      this.closeModal()
    }
    //this.filtrarHorariosProfissional(servicoPos)

  }

  resetHorarios(servico: any) {



    let x = this.listBotoesDesabilitados.filter(x => x.servicoControlador == servico || x.servicoId == servico)

    for (let i = 0; i < x?.length; i++) {
      if (x)
        x[i].horario.disabled = false
    }

    this.listBotoesDesabilitados = this.arrayRemove(this.listBotoesDesabilitados, x)
  }

  arrayRemove(arr: any, value: any) {
    return arr.filter(x => !value.includes(x));
  }


  selectedButtonStyle() {
    setTimeout(() => {
      for (let i = 0; i < this.buttonIndexesCol?.length; i++) { //itero sobre a lista de posições dos botões que haviam sido selecionados na pagina
        let botao = document.getElementsByClassName('column-' + this.buttonIndexesCol[i].coluna + this.buttonIndexesCol[i].indexColuna)[this.buttonIndexesCol[i].indexBotao] as HTMLElement //seleciono o botão da tela filtrando pela classe para obter a coluna da tela e pela posição para obter a linha
        let texto = botao.shadowRoot.children[0].children[0] as HTMLElement // elemento o qual se estilizará o texto para a cor branca
        texto.style.color = "var(--cor-texto-botaoAgendar)"

        botao.shadowRoot.children[0].setAttribute('style', '--background: var(--cor-fundo-botaoAgendar) !important');
        this.controlButtons = this.controlButtons.filter(x => x.servicoId != this.buttonIndexesCol[i].servicoId) //removo o botão da lista de controle de botões para que seja adicionado o novo botão, pois ao voltar para essa tela os botões foram reconstruidos então a informação presente nessa lista esta defasada
        this.controlButtons.push({ servicoId: this.buttonIndexesCol[i].servicoId, button: botao }) //adiciono a referencia do novo botão para ser o controlador dos filtros de horários
        //botao.style.background =
      }
    }, 500);

  }

  // Insere os nomes dos profissionais e os horários selecionados em cada coluna após ir e voltar do resumo
  setProfissionalEHorario() {

    setTimeout(() => {
      const listHorariosLabels = document.getElementsByClassName(this.classHorario);
      const listProfissionaisLabels = document.getElementsByClassName(this.classProfissional);

      for (let i = 0; i < listHorariosLabels?.length; i++) {
        listHorariosLabels[i].textContent = this.horariosList[i];
        listProfissionaisLabels[i].textContent = this.profissionaisList[i];
      }
    }, 500);
  }


  atualizaMinDateFinal(event: any) {
    var i = 0;
    let eventString: string;
    if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
      let dataAgDateTime = new Date(event);
      dataAgDateTime.setHours(dataAgDateTime.getHours() + this.fuso);
      eventString = DateUtils.DateToString(dataAgDateTime);
      this.dataSelecionada = eventString;
    }
    else {
      this.dataSelecionada = event;
    }
    this.listaProfissionaisDisponiveis = []
    this.temHorario = false;
    //this.profissionaisDisponiveis(event, i)
    this.dataExibicao = new Date(this.dataSelecionada).toLocaleDateString().split("T")
    this.horariosVet = []
    this.listHorariosExib = []
    this.listNovosAgendamentos = []
    //this.callPesquisaHorarios(i)
    if(this.lastSegment== 'selecionaProfissional'){
      this.getHorariosProfissional(event)
      this.inicializaCheck()
    }
    else{
    this.horariosProfissionais(event);
    this.inicializaCheck()
    }
  }
  getHorariosProfissional(data){
    let aux: Array<any>=[]
    aux.push(this.profissionalEscolhidoCliente)
    this.listaProfissionaisDisponiveis.push(this.profissionalEscolhidoCliente)
    this.listaProfissionaisDisponiveis[0]['servicoNome'] = this.servicosMarcados[0].infoServico.nomeServico
    let servicosId = this.servicosMarcados.map(({ servicoid }) => servicoid)
    let arrayProfissional: Array<any>=[];
    arrayProfissional.push(this.profissionalEscolhidoCliente.profissionalId) 
    this.agendaService.getHorariosProfissionaisDisponiveis(arrayProfissional,servicosId,data).subscribe(
      result=>{
        this.horariosVet.push(result);
            this.horariosVet[0][0].servicoId = this.servicosMarcados[0].servicoid
            this.horariosVet[0][0].horariosDisponiveis.map(x => x['disabled'] = false) //add o atributo de controle de disponibilidade do botão para cada horário
            this.horariosVet[0][0] = Object.assign(this.listaProfissionaisDisponiveis[0], this.horariosVet[0][0])
            this.horariosVet[0][0].semHorario = this.horariosVet[0][0].horariosDisponiveis?.length == 0
        this.listHorariosExib = this.horariosVet.map(val => val)
        console.log(this.listHorariosExib[0][0])
        this.temHorario = this.listHorariosExib?.length != 0
        this.listaCarregada = this.listHorariosExib?.length != 0
        this.segment='teste2'
      },
      fail=>{
      }
    )
  }
  atualizaHorariosDisponiveis(event: any) {
    var i = 0;
    this.dataSelecionada = event
    this.temHorario = false;
    this.profissionaisDisponiveis(event, i)
    this.dataExibicao = new Date(this.dataSelecionada).toLocaleDateString().split("T")
    this.horariosVet = []
    this.listHorariosExib = []
    this.pesquisaHorarios(i)
    this.inicializaCheck()
  }

  inicializaCheck() {
    for (let i = 0; i < this.servicosMarcados?.length; i++) {//código para exibir um horario de cada vez na tela de agendamentos
      this.colaboradorCheck.push({ exib: false })
    }
    this.colaboradorCheck[0].exib = true
  }

  reinicializaCheck() {
    for (let i = 0; i < this.servicosMarcados?.length; i++) {//código para reiniciar um horario de cada vez na tela de agendamentos
      this.colaboradorCheck[i].exib = false
    }
    this.colaboradorCheck[0].exib = true
  }

  profissionaisDisponiveis(dia: string, posicao: number) {
    if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
      let dataAgDateTime = new Date(dia);
      dataAgDateTime.setHours(dataAgDateTime.getHours() + this.fuso);
      dia = DateUtils.DateToString(dataAgDateTime);
    }
    if (posicao < this.servicosMarcados?.length) {
      this.agendaService.getProfissionaisDisponiveis(this.servicosMarcados[posicao].servicoid, dia).subscribe(
        result => {
          if (result?.length !== 0) {
            this.temHorario = true;
          }
          this.listaProfissionaisDisponiveis.push(result)
          this.listDefaultItem = new Array(this.listaProfissionaisDisponiveis?.length + 1).fill(0)
          posicao = posicao + 1
          this.profissionaisDisponiveis(dia, posicao)

        },
        fail => {
          return
          // this.profissionaisDisponiveis(dia, posicao++)
        }
      )
    }
    else {
      for (let i = 0; i < this.listaProfissionaisDisponiveis?.length; i++) {
        for (let j = 0; j < this.listaProfissionaisDisponiveis[i]?.length; j++) {
          this.listaProfissionaisDisponiveis[i][j]['servicoNome'] = this.servicosMarcados[i].infoServico.descricao
        }
        //this.listaProfissionaisDisponiveis[i].unshift({text: 'Tem preferência de profissional?'})
      }
      this.listDefaultItem = new Array(this.listaProfissionaisDisponiveis?.length + 1).fill(0)
      this.defaultItem = { text: 'Tem preferência de profissional?' }
      for (let i = 0; i < this.listDefaultItem?.length; i++) {
        this.listDefaultItem[i] = this.defaultItem
      }
      this.listaHorariosDisponiveis = new Array(this.listaProfissionaisDisponiveis?.length).fill(0)
      this.listaHorariosDisponiveisControl = new Array(this.listaProfissionaisDisponiveis?.length).fill(0)
      this.profissionaisSelecionados = new Array(this.listaProfissionaisDisponiveis?.length).fill(0)
    }

    return

  }

  filtrarProfissionaisDisponiveis(i: number) {
    if (this.profissionaisSelecionados[i] != undefined && this.profissionaisSelecionados[i] != 0)
      return this.listaProfissionaisDisponiveis[i].filter(x => x.profissionalId != this.profissionaisSelecionados[i].profissionalId);
    else
      return this.listaProfissionaisDisponiveis[i];
  }


  //Faz com que os scrolls se movimentem em conjunto
  updateScrollTwo() {
    this.scrollOne = document.getElementById('scrollOne')
    this.scrollTwo = document.getElementById('scrollTwo')

    this.scrollTwo.scrollLeft = this.scrollOne.scrollLeft;
  }

  updateScrollOne() {
    this.scrollOne = document.getElementById('scrollOne')
    this.scrollTwo = document.getElementById('scrollTwo')

    this.scrollOne.scrollLeft = this.scrollTwo.scrollLeft;
  }

  async pesquisaHorarios(servicosPos: number) {
    //this.horariosProfissionalId = this.filtrarProfissionaisDisponiveis(servicosPos)
    this.horariosProfissionalId = this.listaProfissionaisDisponiveis[servicosPos]
    await this.retornaHorarios(this.listaProfissionaisDisponiveis, servicosPos)
  }

  callPesquisaHorarios(servicoPos: number) {
    this.loadingService.present(20)
    if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
      setTimeout(() => {
        this.pesquisaHorarios(servicoPos)
      }, 3000)
    }
    else {
      setTimeout(() => {
        this.pesquisaHorarios(servicoPos)
      }, 1500)
    }

  }



  async retornaHorarios(profissional: any, servicoPos: number) {
    //this.listDefaultItem[servicoPos+1] = JSON.parse(JSON.stringify(this.listaProfissionaisDisponiveis[servicoPos].filter(x => x.profissionalId == event)[0]))
    if (servicoPos < this.servicosMarcados?.length) {
      let y = profissional[servicoPos].map(x => x.profissionalId)
      this.listaHorariosDisponiveis = [];
      await this.agendaService.getHorariosProfissionaisDisponiveis(y, this.servicosMarcados[servicoPos].servicoid, this.dataSelecionada).subscribe(
        result => {
          this.horariosVet.push(result)
          servicoPos = servicoPos + 1
          this.retornaHorarios(profissional, servicoPos)
        },
        fail => {
          this.loadingService.dismiss()
        }
      )
    }
    else {
      for (let i = 0; i < this.horariosVet?.length; i++) {
        for (let j = 0; j < this.horariosVet[i]?.length; j++) {
          this.horariosVet[i][j].servicoId = this.servicosMarcados[i].servicoid
          this.horariosVet[i][j].horariosDisponiveis.map(x => x['disabled'] = false) //add o atributo de controle de disponibilidade do botão para cada horário

          this.horariosVet[i][j] = Object.assign(profissional[i][j], this.horariosVet[i][j])
          if (this.horariosVet[i][j].horariosDisponiveis?.length == 0)
            this.horariosVet[i][j].semHorario = true
          else
            this.horariosVet[i][j].semHorario = false
        }
      }

      this.ordenaSimultaneo()

      this.listHorariosExib = this.horariosVet.map(val => val)

      if (servicoPos == this.servicosMarcados?.length) {
        this.listaCarregada = true
        this.loadingService.dismiss()
      }
    }
  }
  async filtrarHorariosProfissional(servicoPos: number) {  //filtra os horários quando um profissional é trocado, para que o novo profissional selecionado ja possua os botões de horários corretos
    //this.horariosSelecionados
    this.listHorariosExib = this.listHorariosExib.map(x => {
      if (x.servicoId != this.servicosMarcados[servicoPos].servicoid) {
        for (let i = 0; i < this.listBotoesDesabilitados?.length; i++) {
          if (this.servicosMarcados[servicoPos].servicoid == this.listBotoesDesabilitados[i].servicoControlador) {
            x.horariosDisponiveis = x.horariosDisponiveis.map(y => {
              if ((y.horarioInicio == this.listBotoesDesabilitados[i].horario.horarioInicio && y.horarioFinal == this.listBotoesDesabilitados[i].horario.horarioFinal) || this.listBotoesDesabilitados[i].horario.horarioFinal == y.horarioInicio || this.listBotoesDesabilitados[i].horario.horarioinicio == y.horarioFinal) {
                if (y.disabled == true) {
                  y.disabled = false
                }
              }
              return y
            })
          }
        }
      }
      return x
    })

    this.horariosSelecionados = this.horariosSelecionados.filter(x => x.servico.servicoId != this.servicosMarcados[servicoPos].servicoid)
    this.listBotoesDesabilitados = this.listBotoesDesabilitados.filter(x => x.servicoControlador != this.servicosMarcados[servicoPos].servicoid)
    for (let c = 0; c < this.horariosSelecionados?.length; c++) {
      this.selecionaHorario(this.horariosSelecionados[c].elementoBotao, this.horariosSelecionados[c].servico, this.horariosSelecionados[c].horario)
    }
    this.loadingService.dismiss()
  }


  async horarioButtonClick(event: any, servico: any, horarioSelecionado: any, rowIndex: number, buttonIndex: number, columnNumber: number) {
    this.buttonIndexesCol = this.buttonIndexesCol.filter(x => x.coluna != columnNumber); // caso ja haja um botão selecionado naquela coluna eu retiro ele da lista para adicionar o novo.
    this.buttonIndexesCol.push({ coluna: columnNumber, indexColuna: rowIndex, indexBotao: buttonIndex, servicoId: servico.servicoId }); // adiciono o novo botão da coluna a lista
    this.selecionaHorario(event, servico, horarioSelecionado, columnNumber); // chamo a função de seleção de horario e filtragem de botões.
    this.cardColaborador(columnNumber)
  }

  cardColaborador(columnNumber: number) {

    let indice = columnNumber + 1
    if (indice < this.servicosMarcados?.length) {
      this.colaboradorCheck[indice].exib = true
    }
  }

  //filtra os horários quando um horario é selecionado
  async selecionaHorario(event: any, servico: any, horarioSelecionado: any, indexColuna = 0) {

    let agendamento = new AgendamentoClienteDependenteModel();
    await this.loadingService.present()
    if (this.horariosSelecionados.length > 0) {
      this.horariosSelecionados = this.horariosSelecionados.filter(x => x.servico.servicoId != servico.servicoId)//só pode haver um de cada serviço, então primeiramente retiramos o anterior
      this.horariosSelecionados.push({ elementoBotao: event, servico: servico, horario: horarioSelecionado })//e aqui adicionamos o novo correspondente ao serviço, basicamente estamos apenas salvando os parametros da função, assim quando precisarmos filtrar um novo profissional com base no estado atual, podemos simplesmente chamar a função selecionaHorario, passando os parametros do objeto
    }
    await this.listHorariosExib.map(x => {
      this.servicoSelecionadoInfo = this.servicosMarcados.filter(x => x.servicoid == servico.servicoId)
      let control = 0
      for (let i = 0; i < this.listaProfissionaisDisponiveis?.length; i++) {//filtramos o profissional da coluna pelo seu id para pegar suas informações da lista de profissionais disponiveis, assim podemos checar se ele permite simultaneidade ou não
        if((this.listaProfissionaisDisponiveis[i]?.servicoNome == this.servicoSelecionadoInfo[0].infoServico.nomeServico && servico.profissionalId == this.listaProfissionaisDisponiveis[i]?.profissionalId)){
          this.profissionalSelecionadoInfo = servico
          control = 1
        }
        else{
        for (let j = 0; j < this.listaProfissionaisDisponiveis[i]?.length; j++) {
          if ((this.listaProfissionaisDisponiveis[i][j]?.servicoNome == this.servicoSelecionadoInfo[0].infoServico.descricao && servico.profissionalId == this.listaProfissionaisDisponiveis[i][j]?.profissionalId)) {
            this.profissionalSelecionadoInfo = servico
            control = 1
            break
          }
        }
      }
        if (control == 1) {
          break
        }
      }

      x.map(z => {

        if (z.servicoId != servico.servicoId) {
          if (z.horariosDisponiveis) { //ja que a lista de horarios é iniciada com todas as posições com "0" deve-se checar se estamos em uma posição que recebeu horarios
            z.horariosDisponiveis = z.horariosDisponiveis.filter(y => {

              if ((y.horarioInicio >= horarioSelecionado.horarioFinal) || (horarioSelecionado.horarioInicio >= y.horarioFinal)) {
                for (let i = 0; i < this.listBotoesDesabilitados?.length; i++) {
                  if (this.listBotoesDesabilitados[i].servicoId == z.servicoId && this.listBotoesDesabilitados[i].servicoControlador == servico.servicoId) { //confere se o serviçoId do botão desabilitado coincide com o serviçoId que estamos percorrendo, e tambem confere se o controlador(que seria o servico que bloqueou o botão) é igual ao servicoId do servico do botão que foi selecionado, pois apenas se desbloqueia os botões bloqueados por outro botão caso o botão selecionado seja da mesma coluna.
                    if ((this.listBotoesDesabilitados[i].horario.horarioInicio == y.horarioInicio && this.listBotoesDesabilitados[i].horario.horarioFinal == y.horarioFinal) || this.listBotoesDesabilitados[i].horario.horarioFinal == y.horarioInicio || this.listBotoesDesabilitados[i].horario.horarioinicio == y.horarioFinal) {
                      y.disabled = false
                    }
                  }
                }
                return y
              }
              else {
                this.servicoSelecionadoInfo = this.servicosMarcados.filter(z => z.servicoid == servico.servicoId) //pega o elemento do serviço selecionado, esse dado é utilziado para ver em qual local o serviço é realizado
                this.servicoCheckingInfo = this.servicosMarcados.filter(w => w.servicoid == z.servicoId)
                let profissionalCheckInfo = this.horariosVet.map(w => w.filter(y => y.profissionalId == z.profissionalId)).filter(z => z?.length != 0)[0]

                if (this.profissionalSelecionadoInfo != undefined && this.profissionalSelecionadoInfo.permiteSimultaneidadeDeOutroServico == false && y.horarioInicio != horarioSelecionado.horarioFinal && y.horarioFinal != horarioSelecionado.horarioInicio) { //O botão só deve ser bloqueado se o profissional não permitir simultaneidade, portanto checamos essa condição
                  y.disabled = true
                  this.listBotoesDesabilitados.push({ servicoId: z.servicoId, horario: y, servicoControlador: servico.servicoId }) //servicoId representa o servicoId da coluna em que o botão foi bloqueado e o servicoControlador representa o servico que foi responsável por bloqueá-lo
                }
                else if (this.profissionalSelecionadoInfo.permiteSimultaneidadeDeOutroServico == true && y.horarioInicio != horarioSelecionado.horarioFinal && y.horarioFinal != horarioSelecionado.horarioInicio) { //esta parte é responsável por bloquear botões de colunas que possuam o mesmo profissional selecionado, pois mesmo que a simultaneidade seja permitida, o profissional é unico então ele não pode realizar dois serviços ao mesmo tempo

                  if ((this.profissionalSelecionadoInfo.permiteSimultaneidadeDeOutroServico == true && z.permiteSimultaneidadeDeOutroServico == false) || (this.profissionalSelecionadoInfo.permiteSimultaneidadeDeOutroServico == false && z.permiteSimultaneidadeDeOutroServico == true)) {
                    y.disabled = true
                    this.listBotoesDesabilitados.push({ servicoId: z.servicoId, horario: y, servicoControlador: servico.servicoId })
                  }
                  if (((y.horarioInicio < horarioSelecionado.horarioFinal && horarioSelecionado.horarioInicio < horarioSelecionado.horarioFinal) || (y.horarioInicio == horarioSelecionado.horarioInicio && y.horarioFinal == horarioSelecionado.horarioFinal)) && z.profissionalId == servico.profissionalId) {
                    y.disabled = true
                    this.listBotoesDesabilitados.push({ servicoId: z.servicoId, horario: y, servicoControlador: servico.servicoId })
                  }
                  if (this.servicoCheckingInfo[0].infoServico.locaisServicosId != this.servicoSelecionadoInfo[0].infoServico.locaisServicosId) {

                    if (z.profissionalId == servico.profissionalId) { //checa se o profissional de outra coluna é o mesmo que o da coluna selecionada
                      y.disabled = true
                      this.listBotoesDesabilitados.push({ servicoId: z.servicoId, horario: y, servicoControlador: servico.servicoId }) //servicoId representa o servicoId da coluna em que o botão foi bloqueado e o servicoControlador representa o servico que foi responsável por bloqueá-lo
                    }
                    else if (profissionalCheckInfo[0] != undefined && profissionalCheckInfo[0].permiteSimultaneidadeDeOutroServico == false) {
                      y.disabled = true
                      this.listBotoesDesabilitados.push({ servicoId: z.servicoId, horario: y, servicoControlador: servico.servicoId }) //servicoId representa o servicoId da coluna em que o botão foi bloqueado e o servicoControlador representa o servico que foi responsável por bloqueá-lo
                    }
                  }
                  else if ((this.servicoCheckingInfo[0].infoServico.locaisServicosId != null && this.servicoSelecionadoInfo[0].infoServico.locaisServicosId != null)
                    && this.servicoCheckingInfo[0].infoServico.locaisServicosId == this.servicoSelecionadoInfo[0].infoServico.locaisServicosId) {//confere se os locais de serviço são iguais, caso sejam os horários devem ser bloqueados
                    y.disabled = true
                    this.listBotoesDesabilitados.push({ servicoId: z.servicoId, horario: y, servicoControlador: servico.servicoId }) //servicoId representa o servicoId da coluna em que o botão foi bloqueado e o servicoControlador representa o servico que foi responsável por bloqueá-lo
                    // if(z.profissionalId == servico.profissionalId){ //checa se o profissional de outra coluna é o mesmo que o da coluna selecionada
                    // }
                  }
                }
                return y
              }
            })
            return z
          }
        }
      })
    })
    if (this.controlButtons.filter(z => z.servicoId == servico.servicoId)?.length != 0) {
      //Verificar se o childnodes é nulo para corrigir o erro com o childNodes[0]
      if (event.target.shadowRoot.childNodes[0] != null || event.target.shadowRoot.childNodes[0] != undefined) {
        event.target.shadowRoot.childNodes[0].style.backgroundColor = "unset"
      }
      else {
        event.target.shadowRoot.childNodes[1].style.backgroundColor = "unset"
      }
      if (this.controlButtons.filter(z => z.servicoId == servico.servicoId)[0].button.shadowRoot.childNodes[0].children[0] != null ||
        this.controlButtons.filter(z => z.servicoId == servico.servicoId)[0].button.shadowRoot.childNodes[0].children[0] != undefined) {
        this.controlButtons.filter(z => z.servicoId == servico.servicoId)[0].button.shadowRoot.childNodes[0].children[0].style.color = "var(--cor-texto-escuro)"
        this.controlButtons.filter(z => z.servicoId == servico.servicoId)[0].button.shadowRoot.childNodes[0].setAttribute('style', 'background-color: var(--background-color-geral-2) !important')
      }
      else {
        this.controlButtons.filter(z => z.servicoId == servico.servicoId)[0].button.shadowRoot.childNodes[1].children[0].style.color = "var(--cor-texto-escuro)"
        this.controlButtons.filter(z => z.servicoId == servico.servicoId)[0].button.shadowRoot.childNodes[1].setAttribute('style', 'background-color: var(--background-color-geral-2) !important')
      }

      this.controlButtons.filter(z => z.servicoId == servico.servicoId)[0].button = event.target;
      this.listNovosAgendamentos = this.listNovosAgendamentos.filter(z => z.agendamento.servicoId != servico.servicoId)
      //let agendamento = new AgendamentoModel();
      this.controlButtons = this.controlButtons.filter(z => z.servicoId != servico.servicoId)
      this.controlButtons.push({ servicoId: servico.servicoId, button: event.target })
      //agendamento.agendasId
      agendamento.agendasId = 0
      agendamento.dataAg = new Date(this.dataSelecionada)
      agendamento.horarioFim = horarioSelecionado.horarioFinal
      agendamento.servicoId = servico.servicoId
      agendamento.clienteDependenteId = this.usuarioSelecionado.cliforcolsId;
      agendamento.profissionalId = servico.profissionalId
      agendamento.horarioInicio = horarioSelecionado.horarioInicio
      this.listNovosAgendamentos.push({ agendamento: agendamento, profissionalInfo: this.profissionalSelecionadoInfo, servico: servico.servicoNome })

      //event.target.style.color = "red";

    }
    else {

      //let agendamento = new AgendamentoModel();
      //agendamento.agendasId

      agendamento.agendasId = 0
      agendamento.dataAg = new Date(this.dataSelecionada)
      agendamento.horarioFim = horarioSelecionado.horarioFinal
      agendamento.servicoId = servico.servicoId
      agendamento.clienteDependenteId = this.usuarioSelecionado.cliforcolsId;
      agendamento.profissionalId = servico.profissionalId
      agendamento.horarioInicio = horarioSelecionado.horarioInicio
      this.listNovosAgendamentos.push({ agendamento: agendamento, profissionalInfo: this.profissionalSelecionadoInfo, servico: servico.servicoNome });

      //Verificar se o child node é nulo ou undefined para corrigir o erro com o childNodes[0]

      if (event.target.shadowRoot.childNodes[0].children[0] != null || event.target.shadowRoot.childNodes[0].children[0] != undefined) {
        event.target.shadowRoot.childNodes[0].children[0].style.color = "var(--cor-texto-botaoAgendar)"
        event.target.shadowRoot.childNodes[0].setAttribute('style', '--background: var(--cor-fundo-botaoAgendar) !important')
      }
      else {
        event.target.shadowRoot.childNodes[1].children[0].style.color = "var(--cor-texto-botaoAgendar)"
        event.target.shadowRoot.childNodes[1].setAttribute('style', '--background: var(--cor-fundo-botaoAgendar) !important')
      }

      this.controlButtons.push({ servicoId: servico.servicoId, button: event.target })
    }
    //Verificar se o childnodes é nulo ou undefined para corrigir o erro com o childNodes[0]

    if (event.target.shadowRoot.childNodes[0].children[0] != null || event.target.shadowRoot.childNodes[0].children[0] != undefined) {
      event.target.shadowRoot.childNodes[0].children[0].style.color = "var(--cor-texto-botaoAgendar)"
      event.target.shadowRoot.childNodes[0].setAttribute('style', '--background: var(--cor-fundo-botaoAgendar) !important')
    }
    else {
      event.target.shadowRoot.childNodes[1].children[0].style.color = "var(--cor-texto-botaoAgendar)"
      event.target.shadowRoot.childNodes[1].setAttribute('style', '--background: var(--cor-fundo-botaoAgendar) !important')
    }
    this.loadingService.dismiss();



    // Insere o nome do profissional escolhido no topo das lista de cards de horários disponíveis
    const profissionaisListLabels = document.getElementsByClassName(this.classProfissional);
    profissionaisListLabels[indexColuna].textContent = this.profissionalSelecionadoInfo.nome;
    if (this.profissionaisList[indexColuna] === undefined || this.profissionaisList[indexColuna] === null || this.profissionaisList[indexColuna] === '') {
      this.profissionaisList.push(this.profissionalSelecionadoInfo.nome);
    } else {
      this.profissionaisList[indexColuna] = this.profissionalSelecionadoInfo.nome;
    }


    // Insere o horário escolhido no topo das lista de cards de horários disponíveis
    const horariosListLabels = document.getElementsByClassName(this.classHorario);

    horariosListLabels[indexColuna].textContent = agendamento.horarioInicio.toString().substring(0, 5);
    if (this.horariosList[indexColuna] === undefined || this.horariosList[indexColuna] === null || this.horariosList[indexColuna] === '') {
      this.horariosList.push(agendamento.horarioInicio.toString().substring(0, 5));
    } else {
      this.horariosList[indexColuna] = agendamento.horarioInicio.toString().substring(0, 5);
    }
  }

  encerrarAg() {
    this.ModalController.dismiss(1).then(() => {
      this.confirmacaoAgendamentoModal()
      //this.presentAlertCreateAppointment(agendamento, 0)
    })
  }

  async criarAgendamentos() {
    let inadimplente = false;
    this.scheduleButtonWaitingAPI = true
    //const novosAgendamentos = this.listNovosAgendamentos.map(({ agendamento }) => agendamento);
    this.loaderInfo.end = this.listNovosAgendamentos?.length;
    await this.loadingService.present();
    for (var i = 0; i < this.listNovosAgendamentos?.length; i++) {

      const agendamento = this.listNovosAgendamentos[i].agendamento
      const servNome = ''

      const posicao = i + 1

      if (this.fuso != undefined && this.fuso != null && this.linguaPais == 'ja-JP') {
        let agDate = new Date(agendamento.dataAg);
        agendamento.dataAg = new Date(agendamento.dataAg.setHours(agDate.getHours() + this.fuso));
      }


      if (this.usuarioSelecionado.cliforcolsId != this.userData.authenticatedUser.cliForColsId)
        await this.agendaService.criarAgendamentoDependente(agendamento).then(
          async result => {

            this.loaderInfo.start += 1;
            if (this.loaderInfo.start == this.loaderInfo.end) {
              this.loadingService.dismiss();
            }
            this.agendamentoSucess++;

            this.ListServiceSuccess.push(this.listNovosAgendamentos[i])

              

          },
          async fail => {

            this.agendamentoFailed++;

            this.loaderInfo.start += 1;
            this.scheduleButtonWaitingAPI = false
            if (fail.error == 'API.OAGENDAMENTO.MARCARAGENDAMENTOCLIENTEDEPENDENTE.EXISTEEVENTO') {
              this.messageAgendamentoFailed = this.translate.instant('AGENDA.MODALS.NOVOAGENDAMENTO.EXISTEAGENDAMENTO');
            }
            else if (fail.error == 'API.OAGENDAMENTO.MARCARAGENDAMENTOCLIENTEDEPENDENTE.CLIENTESEMPERMISSAOAGENDAMENTO') {
              this.messageAgendamentoFailed = this.translate.instant('AGENDA.MODALS.NOVOAGENDAMENTO.CLIENTESEMPERMISSAOAGENDAMENTO');
            }
            else if (fail.error == 'API.OAGENDAMENTO.MARCARAGENDAMENTOCLIENTEDEPENDENTE.NAOPERMITESIMULTANEIDADE') {
              this.messageAgendamentoFailed = this.translate.instant('AGENDA.MODALS.NOVOAGENDAMENTO.NAOPERMITESIMULTANEIDADE');
            }
            else if (fail.error == 'API.OAGENDAMENTO.MARCARAGENDAMENTOCLIENTE.CLIENTE.INADIMPLENTE') {
              this.messageAgendamentoFailed = this.translate.instant('AGENDA.MODALS.NOVOAGENDAMENTO.INADIMPLENTE');
              inadimplente = true;
              const alert = await this.alertController.create({
                header: 'Erro ao agendar',
                message: 'Favor verificar com o estabelecimento para realizar o agendamento.',
                buttons: ['OK'],
              });
              await alert.present();
            }
            else {
              this.messageAgendamentoFailed = fail.error + " - " + this.translate.instant('AGENDA.MODALS.NOVOAGENDAMENTO.DANGER')
            }

            this.ListServiceFailed.push({
              nomeServico: this.listNovosAgendamentos[i].servico,
              nomeProfissional: this.listNovosAgendamentos[i].profissionalInfo.nome,
              horario: this.listNovosAgendamentos[i].agendamento.horarioInicio.substring(0, 5) + "-" + this.listNovosAgendamentos[i].agendamento.horarioFim.substring(0, 5),
              data: this.listNovosAgendamentos[i].agendamento.dataAg.toLocaleDateString(),
              messagemErro: this.messageAgendamentoFailed,
            })

          }
        )
      else
        await this.agendaService.criarAgendamento(agendamento).then(
          result => {

            this.loaderInfo.start += 1;
            if (this.loaderInfo.start == this.loaderInfo.end) {
              this.loadingService.dismiss();
            }
            this.agendamentoSucess++;

            this.ListServiceSuccess.push(this.listNovosAgendamentos[i])

          },
          async fail => {

            this.agendamentoFailed++;
            this.loaderInfo.start += 1;
            this.scheduleButtonWaitingAPI = false
            if (fail.error == 'API.OAGENDAMENTO.MARCARAGENDAMENTOCLIENTE.EXISTEEVENTO') {
              this.messageAgendamentoFailed = this.translate.instant('AGENDA.MODALS.NOVOAGENDAMENTO.EXISTEAGENDAMENTO')
            }
            else if (fail.error == 'API.OAGENDAMENTO.MARCARAGENDAMENTOCLIENTE.CLIENTESEMPERMISSAOAGENDAMENTO') {
              this.messageAgendamentoFailed = this.translate.instant('AGENDA.MODALS.NOVOAGENDAMENTO.CLIENTESEMPERMISSAOAGENDAMENTO');
            }
            else if (fail.error == 'API.OAGENDAMENTO.MARCARAGENDAMENTOCLIENTE.CLIENTEINATIVO') {
              this.messageAgendamentoFailed = "Infelizmente seu cadastro foi desativado enquanto realizava o agendamento.";
            }
            else if (fail.error == 'API.OAGENDAMENTO.MARCARAGENDAMENTOCLIENTE.NAOPERMITESIMULTANEIDADE') {
              this.messageAgendamentoFailed = this.translate.instant('AGENDA.MODALS.NOVOAGENDAMENTO.NAOPERMITESIMULTANEIDADE');
            }
            else if (fail.error == 'API.OAGENDAMENTO.MARCARAGENDAMENTOCLIENTE.CLIENTE.INADIMPLENTE') {
              this.messageAgendamentoFailed = this.translate.instant('AGENDA.MODALS.NOVOAGENDAMENTO.INADIMPLENTE');
              inadimplente = true;
              const alert = await this.alertController.create({
                header: 'Erro ao agendar',
                message: 'Favor verificar com o estabelecimento para realizar o agendamento.',
                buttons: ['OK'],
              });
              await alert.present();
            }
            else {
              this.messageAgendamentoFailed = fail.error + " - " + this.translate.instant('AGENDA.MODALS.NOVOAGENDAMENTO.DANGER')
            }
            this.ListServiceFailed.push({
              nomeServico: this.listNovosAgendamentos[i].servico,
              nomeProfissional: this.listNovosAgendamentos[i].profissionalInfo.nome,
              horario: this.listNovosAgendamentos[i].agendamento.horarioInicio.substring(0, 5) + "-" + this.listNovosAgendamentos[i].agendamento.horarioFim.substring(0, 5),
              data: this.listNovosAgendamentos[i].agendamento.dataAg.toLocaleDateString(),
              messagemErro: this.messageAgendamentoFailed,
            })

          }
        )


    }
    if (this.agendamentoSucess == this.listNovosAgendamentos?.length) {
      this.toast.presentToast(this.translate.instant('AGENDA.MODALS.NOVOAGENDAMENTO.SUCESSO'));
    }
    if (this.ListServiceFailed!=undefined && this.agendamentoSucess > 0 && this.ListServiceFailed.length > 0) {
      this.toast.presentToastAction(this.ListServiceFailed, 'warning')
    }
    else if (this.agendamentoSucess == 0 && this.ListServiceFailed!=undefined &&  this.ListServiceFailed.length == 1) {
      this.ModalController.dismiss(1);
      this.abreModalInadimplencia(this.messageAgendamentoFailed)
    }
    if (this.ListServiceSuccess!=undefined && this.ListServiceSuccess.length == 1 ) {
      this.abrePagAgendarGoogle(this.ListServiceSuccess[0])
      this.encerrarAg()
    }    
    else if(this.ListServiceSuccess!=undefined && this.ListServiceSuccess.length > 1) {
      this.segment = 'calendario'
    }

  }

  async abreModalInadimplencia(mensagem:any){
    const modal = await this.ModalController.create({
      component: InadimplenciaComponent,
      cssClass: 'inadimplencia',
      componentProps: {
        mensagem:mensagem,
      },
      backdropDismiss: false,
    })
    modal.onDidDismiss().then(retorno=>{})
    return await modal.present()
  }

  async abrePagAgendarGoogle(servico: any) {
    this.loadingService.present()
    var input = servico.agendamento.horarioInicio.toString();
    var fields = input.split(':');
    var hora = fields[0];
    let horaFinal: number = +hora
    var minuto = fields[1];
    let minutoFinal: number = +minuto
    let horario = new Date(servico.agendamento.dataAg)
    horario.setHours(horaFinal, minutoFinal, 0)
    let horario2 = new Date(servico.agendamento.dataAg)
    input = servico.agendamento.horarioFim.toString();
    fields = input.split(':');
    hora = fields[0];
    horaFinal = +hora
    minuto = fields[1];
    minutoFinal = +minuto
    horario2.setHours(horaFinal, minutoFinal, 0)
    this.Calendar.createEventInteractively(`${servico.profissionalInfo.servicoNome} - ${servico.profissionalInfo.nome}`, this.userData.authenticatedBranch.nomeEmpresaFilial, null, horario, horario2).then((res) => {
    });
    this.loadingService.dismiss()

    //     await alert.present();
  }

  async confirmacaoAgendamentoModal() {
    const modal = await this.ModalController.create({
      component: ConfirmacaoAgendamentoComponent,
      // componentProps: {
      //   Calendar: this.Calendar,
      //   listNovosAgendamentos : this.listNovosAgendamentos
      // },
      backdropDismiss: false,
      cssClass: 'confirmarnovoAgendamento'
    })
    modal.onDidDismiss().then(retorno => {

      let oneRate = JSON.parse(localStorage.getItem('one.rate'))
      if (oneRate == null) {
        let rateDate = [{ email: this.userData.authenticatedUser.email, rated: false }]
        localStorage.setItem('one.rate', JSON.stringify(rateDate));
        this.avaliarAppModal()
        //this.userData
      }

      else {
        let userRateDataExist: boolean = false;
        for (let i = 0; i < oneRate?.length; i++) {
          if (oneRate[i].email == this.userData.authenticatedUser.email) {
            userRateDataExist = true
            if (oneRate[i].rated == true) {

              //não deve abrir o modal
            }
            else if (oneRate[i].rated == false) {
              this.avaliarAppModal()
              //deve abrir o modal
            }
          }
        }
        if (userRateDataExist == false) {
          oneRate.push({ email: this.userData.authenticatedUser.email, rated: false })
          localStorage.setItem('one.rate', JSON.stringify(oneRate))
          this.avaliarAppModal()
        }
      }
      //localStorage.setItem('one.rate', '{email: usuario@logado.com.br, rated: false}');

    })

    return await modal.present()
  }

  //primeiro verifica ha quanto tempo o modal apareceu pela ultima vez
  avaliarAppModal() {
    //por fazer: verificar primeiro se o app ja foi avaliado

    let stamp = localStorage.getItem("one.timestamp");
    let stamp_rate = localStorage.getItem("one.ratestamp");

    if (!stamp && !stamp_rate) {
      this.avaliarAppModal0();
    } else if (!stamp_rate) {
      let last_chk = new Date(stamp);

      //last_chk.setDate(last_chk.getDate() - 7); //testing override
      //last_chk.setDate(last_chk.getDate() - 8); //testing override


      let today = new Date();

      let diff = Math.floor((today.getTime() - last_chk.getTime()) / (1000 * 3600 * 24));

      if (diff > 7) this.avaliarAppModal0();
    } else {
      let last_chk = new Date(stamp_rate);



      let today = new Date();
      let diff = Math.floor((today.getTime() - last_chk.getTime()) / (1000 * 3600 * 24));

      if (diff > 90) this.avaliarAppModal0();
    }
  }

  //chama o modal que convida para avaliar o app
  async avaliarAppModal0() {

    const modal = await this.ModalController.create({
      component: AvaliarAppModalComponent,
      backdropDismiss: false,
      cssClass: 'confirmarnovoAgendamento'
    })
    modal.onDidDismiss().then(retorno => {

      //let oneRate = JSON.parse(localStorage.getItem('one.rate'))
      //localStorage.setItem('one.rate', '{email: usuario@logado.com.br, rated: false}');

    })

    return await modal.present()
  }


  itemDisabled(itemArgs: { dataItem: any, index: number }) {
    if (itemArgs.dataItem.text) {
      return true
    }
    else {
      return false
    }
  }

  onResize(event: any) {
    this.getScreenSize()
  }

  async exibeDetalhesAlert(servicoPos: number) {
    var mensagem = this.servicosMarcados[servicoPos].infoServico.informativo;
    if (mensagem == null || mensagem == undefined || mensagem == "" || mensagem.length == 0) {
      this.informativo = false;
      mensagem = this.listHorariosExib[servicoPos][0].servicoNome;
    }
    else {
      this.informativo = true;
    }
    const alert = await this.alertController.create({
      header: this.translate.instant('AGENDA.APPOINTMENT.EXIBIRDETALHESALERT.DETALHES'),
      message: mensagem,
      buttons: [
        {
          text: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.FECHARMODAL.BUTTON'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        }
      ],
      backdropDismiss: false,
    });

    await alert.present();
  }

  detectiOS() {
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i))
      return true;
    else
      return false;
  }

  animateIndicator(event: any) {
  }

  // Desabilita os botões que marcam o evento na agenda
  disableButton($event: MouseEvent) {
    ($event.target as HTMLButtonElement).disabled = true;
  }

  async verHorariosAlert() {
    const alert = await this.alertController.create({
      header: "Horários",
      message: "Arraste pro lado para visualizar mais horários",
      buttons: [
        {
          text: "OK",
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        }
      ],
      backdropDismiss: false,
    });

    await alert.present();
  }

}

import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NavController, IonSlides } from '@ionic/angular';
import { ToastService } from 'app/core/services/toast.service';
import { AgendaService } from '../../services/agenda.service'
import { GetServicoProfissionalModel } from '../../models/getServicoProfissionalModel'
import { ProdutoModel } from '../../models/produtoModel'
import { LoadingService } from '../../../core/services/loading.service';
import { RegistrarServicoModel } from '../../models/registrarServicoModel'
import { RegistrarProdutoModel } from '../../models/registrarProdutoModel'
import { EditarRegistroServicoModel } from '../../models/editarRegistroServicoModel'
import { EditarRegistroProdutoModel } from '../../models/editarRegistroProdutoModel'
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServicoPesquisadoModalComponent } from '../servico-pesquisado-modal/servico-pesquisado-modal.component'
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { FloatingLabelComponent } from '@progress/kendo-angular-label';

import { NovaQuimicaComponent } from '../nova-quimica/nova-quimica.component'
import { EdicaoQuimicaComponent } from '../edicao-quimica/edicao-quimica.component'
import { PopoverAtendimentoComponent } from './popover-atendimento/popover-atendimento.component'

import { TranslateService } from '@ngx-translate/core';
import { getLocaleCurrencyCode } from '@angular/common';



@Component({
  selector: 'app-resumo-agendamento-profissional',
  templateUrl: './resumo-agendamento-profissional.component.html',
  styleUrls: ['./resumo-agendamento-profissional.component.scss'],
})
export class ResumoAgendamentoProfissionalComponent implements OnInit {

  //@ViewChild('buttonSlide', { static: true }) protected buttonSlide: ElementRef<IonSlides>;

  @ViewChild('buttonSlide') buttonSlide: IonSlides;
  @ViewChild('SwipedTabsSlider') SwipedTabsSlider: IonSlides;
  @ViewChild(IonSlides, { static: false }) slides: IonSlides;
  @ViewChild("comboboxAuxiliar") box_Auxiliar: ComboBoxComponent;
  @ViewChild("floating_cliente") floating_cliente: FloatingLabelComponent;


  // @HostListener('window:scroll', ['$event']) // for window scroll events
  public innerWidth: any;
  public innerHeight: any;
  public slideContentHeight: any;
  public listClientes: any[];
  public addAuxiliar: boolean = false;
  //@HostListener('window:resize', ['$event'])

  getScreenSize(event?) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.innerHeight < 720 ? this.slideContentHeight = this.innerHeight - 300 : this.slideContentHeight = 290
    this.slideContentHeight = this.slideContentHeight.toString() + 'px'
  }


  public semLogo: string = 'https://oneproducao.blob.core.windows.net/one2/Imagens/Sem_FotoPerfil.png';
  public segment: string = 'info';
  public dadosAgendamento: any;
  public loaderDismissCount: number = 0;
  public tipoUsuario: any;

  public indexAtualSegment: number = 0;
  public gServicosDisponiveis: any;
  public listProdutosDisponiveis: any;
  public segmentSelecionado: any;
  public listServicosProfissional: Array<GetServicoProfissionalModel>;
  public listProdutos: Array<ProdutoModel>;
  public listProdServs: Array<any> = new Array(2);
  public servicosSelecionados = []
  public produtosSelecionados = []
  public listProdutosRegistrados = []
  public listServicosRegistrados = []
  public listProdutosServicosRegistrados = []
  public parametrosLight: any;
  public tipoLogin: any;


  public pesquisaColaboradorLoader: boolean = false;
  public listColaboradoresAgendaveis: any = [];
  public totalPriceRegisteredProducts: number;
  public totalQuantityRegisteredProducts: number;

  public totalPriceRegisteredServices: number;
  public totalQuantityRegisteredServices: number;

  public totalQuantityGeneral: number = 0;
  public totalPriceGeneral: number = 0;


  public listServicosPesquisa: any = [] //lista populada com todos os serviços para ser usada para filtragem
  public listServicosPesquisados: any = [] //lista que armazenará os items que correspondem ao termo pesquisado

  public listProdutosPesquisa: any = [] //lista populada com todos os produtos para ser usada para filtragem
  public listProdutosPesquisados: any = [] //lista que armazenará os items que correspondem ao termo pesquisado


  public controlServicos: Array<any>; //responsável por conter o boolean controlador da checkbox e o serviço, não sei se é necessário ter o serviço, acho que é melhor criar um outro array pra colocar os serviços marcados, porque acho que vai ficar mais rápido
  public controlProdutos: Array<any>;


  public checkProductsEdition: any; //serve para checar se o produto registrado que entrou no modo de edição foi alterado ou não, para que evite chamar a API atoa
  public checkServicesEdition: any; //serve para checar se o serviço registrado que entrou no modo de edição foi alterado ou não, para que evite chamar a API atoa


  public registerProductPermission: any;//O valor vem do modal de opções do agendamento, serve para chegar se o profissional tem autorização para lançar produtos
  public registerServicePermission: any;//O valor vem do modal de opções do agendamento, serve para checar se o profisisonal tem autorização para lançar serviços

  public lancarServicoProdutoSegment: string = 'servico'

  public servicoPesquisadoInfo: any;
  public produtoPesquisadoInfo: any;

  public indiceI: any;//referenciado para o modal serviço pesquisado
  public indiceJ: any;//

  public overlayDivControl: boolean = false;
  public userData: any;

  public pesquisaClienteLoader: boolean = false;

  public possuiFicha: boolean; // vai vir como parametro na abertura do modal
  public clienteSelecionado: any;
  public listClientesPresentes: any;
  public clientesPresentesRetornou: boolean = false;
  public cliPresentesSegment: boolean = false;
  public naotemcliente: boolean; //vai vir como parametro na abertura do modal

  public launchButtonWaitingAPI: boolean = false; //faz o controle do bloqueio do botão para que não seja possível acionar o mesmo no intervalo de espera do retorno da API de lançar serviços/produtos  
  public finishButtonWaitingAPI: boolean = false; //faz o controle do bloqueio do botão para que não seja possível acionar o mesmo no intervalo de espera do retorno da API de finalizar ficha  

  public valorServico: FormGroup;

  //A variável à seguir define se as informações de email e telefone estarão censuradas ou não
  private mascaraEmailTel: boolean = true;

  public ScroolClientesPresentes = false;

  public PacotesAplicados = []

  public loaderInfo = {
    start: 0,
    end: 0
  };

  slideOpts = {
    initialSlide: 2,
  };

  constructor(private modalController: ModalController,
    private loadingService: LoadingService,
    private toast: ToastService,
    private agendaService: AgendaService,
    private formBuild: FormBuilder,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public alertController: AlertController,
    private popoverController: PopoverController,) {

  }

  ngOnInit() {

    this.tipoLogin = localStorage.getItem('one.tipologin')
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

    this.atualizaServicosProdutos()
    this.getScreenSize()
  }

  public formatOptions: any = {
    style: 'currency',
    currency: this.getCurrencyCode(),
    currencyDisplay: 'symbol'
  }
  public getCurrencyCode() {
    let user = JSON.parse(localStorage.getItem('one.user'));
    let filial = user.authenticatedBranch;
    let linguaPais = filial.linguaPais;
    let code: string = getLocaleCurrencyCode(linguaPais);
    return code;
  }

  ngAfterViewInit() {
    setTimeout(
      () => {
      }, 0
    );
    setTimeout(
      () => {
        if (this.slides) {
          this.slides.update();
        }
      }, 500
    );
  }

  atualizaServicosProdutos() {
    this.loadingService.present
    //this.getScreenSize()
    this.lancarServicoProdutoSegment = (this.parametrosLight.registrarServicos == true ? 'servico' : 'produto');
    this.getProfissionalServicos()
    this.getPrecosProdutos()
    this.updateIndicatorPosition()
    this.tipoUsuario = localStorage.getItem('one.tipologin')
    this.loadingService.dismiss

  }


  clientesPresentes() {
    this.loadingService.present
    this.agendaService.getClientesPresentes().subscribe(
      result => {
        this.listClientesPresentes = result
        this.clientesPresentesRetornou = true
        if (this.listClientesPresentes.length > 4) {
          this.ScroolClientesPresentes = true;
        }

      },
      fail => {

      }
    )
    this.cliPresentesSegment = !this.cliPresentesSegment
    this.loadingService.dismiss
  }


  async getParametrosLight() {
    this.agendaService.getParametrosLight().subscribe(
      result => {
        this.parametrosLight = result
      },
      fail => {
      }
    )
  }


  lancarServicoProdutoModal() {
    this.segment = 'lancarProdutoServico'
    this.servicosSelecionados = []
    this.produtosSelecionados = []
    this.getProfissionalServicos()
    this.getPrecosProdutos()
    this.selectFirstTabGServ()
  }


  selectFirstTabGServ() {
    setTimeout(() => {
      let firstTab = document.getElementsByClassName('gservs')[0] as HTMLElement
      firstTab.style.color = "var(--ion-color-primary)"
      firstTab.style.borderBottom = "2px solid var(--ion-color-primary)"
      this.indexAtualSegment = 0
    }, 500);
  }

  selectFirstTabLinhaProduto() {
    setTimeout(() => {
      let firstTab = document.getElementsByClassName('linhaProdutos')[0] as HTMLElement
      firstTab.style.color = "var(--ion-color-primary)"
      firstTab.style.borderBottom = "2px solid var(--ion-color-primary)"
      this.indexAtualSegment = 0
    }, 500);
  }



  selectTab(index: number) {

    var skip = (this.registerProductPermission?.length != 0 && this.parametrosLight.lancarProdutos) || this.tipoLogin === 'gestor'
    && (this.registerServicePermission?.length != 0 && this.parametrosLight.registrarServicos) || this.tipoLogin === 'gestor'

    ? 2 : 1
    if (this.indexAtualSegment != index) {

      document.getElementsByTagName('ion-segment-button')[this.indexAtualSegment + skip].style.borderBottom = "0px"
      document.getElementsByTagName('ion-segment-button')[this.indexAtualSegment + skip].style.color = "var(--cor-texto-escuro)"
      document.getElementsByTagName('ion-segment-button')[index + skip].style.color = "var(--ion-color-primary)"
      document.getElementsByTagName('ion-segment-button')[index + skip].style.borderBottom = "2px solid var(--ion-color-primary)"
      this.indexAtualSegment = index;
    }

    this.SwipedTabsSlider.slideTo(index, 500);
  }

  selectTabClientePresente(index: number) {
    if (this.listClientesPresentes) {
      this.floating_cliente.focused = true;
      this.changeClientePresente(this.listClientesPresentes[index])
    }
  }

  async updateIndicatorPosition() {
    if (this.SwipedTabsSlider != undefined) {
      let indexSlide = await this.SwipedTabsSlider.getActiveIndex()

      document.getElementById("segment-" + indexSlide)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
      this.selectTab(indexSlide)

      if (this.SwipedTabsSlider?.length() > this.SwipedTabsSlider.getActiveIndex()) {
      }
    }

  }


  async getProfissionalServicos() {
    this.agendaService.getServicosProfissional().subscribe(
      result => {
        let listServicosSemAgrupamento = [] //lista que armazenará os serviços sem o agrupamento por grupos de serviço
        this.loaderDismissCount += 1
        this.gServicosDisponiveis = result
        if (this.parametrosLight == undefined || this.parametrosLight == null) {
          this.getParametrosLight()
        }
        this.controlServicos = new Array(this.gServicosDisponiveis?.length).fill(0) //inicializa o array com o número de posições igual ao número de gservs
        for (let i = 0; i < this.gServicosDisponiveis?.length; i++) {
          this.controlServicos[i] = new Array(this.gServicosDisponiveis[i].servicos?.length) //cada posição do array deve conter um novo array com o tamanho equivalente a quantidade de servicos de um gservs
          for (let j = 0; j < this.gServicosDisponiveis[i].servicos?.length; j++) {
            listServicosSemAgrupamento.push(this.gServicosDisponiveis[i].servicos[j])//list populada para ser utilizada na filtragem de servicos
            this.controlServicos[i][j] = { service: this.gServicosDisponiveis[i].servicos[j], observacao: '', expandirQuimicaControl: 0, quantidade: 1, precoConfigurado: this.gServicosDisponiveis[i].servicos[j].precoServico, checked: false, precoMax: (this.parametrosLight.sobrePrecoMaxServico != null && this.parametrosLight.sobrePrecoMaxServico != 0 ? (this.gServicosDisponiveis[i].servicos[j].precoServico * (1 + this.parametrosLight.sobrePrecoMaxServico / 100)) : this.gServicosDisponiveis[i].servicos[j].precoServico), descontoMax: (this.parametrosLight.descontoMaxServico != null && this.parametrosLight.descontoMaxServico != 0 ? this.gServicosDisponiveis[i].servicos[j].precoServico - (this.gServicosDisponiveis[i].servicos[j].precoServico / 100 * this.parametrosLight.descontoMaxServico) : this.gServicosDisponiveis[i].servicos[j].precoServico) }
          }
        }

        //this.listServicosPesquisados = this.listServicosPesquisa //essa lista será usada como 'data' para o campo de pesquisa
        this.listServicosPesquisa = listServicosSemAgrupamento
        this.controlServicos = JSON.parse(JSON.stringify(this.controlServicos));//copia profunda para se alterar cada objeto

        this.getRegistrosServicos()
      },
      fail => {
        this.loaderDismissCount += 1
      }
    )
  }

  async getPrecosProdutos() {
    await this.getParametrosLight()
    this.agendaService.getPrecosProdutos().subscribe(
      result => {
        this.loaderDismissCount += 1
        if (this.parametrosLight == undefined || this.parametrosLight == null) {
          this.getParametrosLight()
        }
        let listProdutosSemAgrupamento = []
        this.listProdutosDisponiveis = result
        this.controlProdutos = new Array(this.listProdutosDisponiveis?.length).fill(0) //inicializa o array com o número de posições igual ao número de gservs
        for (let i = 0; i < this.listProdutosDisponiveis?.length; i++) {
          this.controlProdutos[i] = new Array(this.listProdutosDisponiveis[i].produtos?.length) //cada posição do array deve conter um novo array com o tamanho equivalente a quantidade de servicos de um gservs
          for (let j = 0; j < this.listProdutosDisponiveis[i].produtos?.length; j++) {
            // this.listProdutosSemAgrupamento.()
            listProdutosSemAgrupamento.push(this.listProdutosDisponiveis[i].produtos[j])
            this.controlProdutos[i][j] = { product: this.listProdutosDisponiveis[i].produtos[j], observacao: '', quantidade: this.listProdutosDisponiveis[i].produtos[j].quantidade, precoConfigurado: this.listProdutosDisponiveis[i].produtos[j].precoVenda, checked: false, precoMax: (this.parametrosLight.sobrePrecoMaxProduto != null && this.parametrosLight.sobrePrecoMaxProduto != 0 ? (this.listProdutosDisponiveis[i].produtos[j].precoVenda / 100 * this.parametrosLight.sobrePrecoMaxProduto) : this.listProdutosDisponiveis[i].produtos[j].precoVenda), descontoMax: (this.parametrosLight.descontoMaxProduto != null && this.parametrosLight.descontoMaxProduto != 0 ? (this.listProdutosDisponiveis[i].produtos[j].precoVenda - (this.listProdutosDisponiveis[i].produtos[j].precoVenda / 100 * this.parametrosLight.descontoMaxProduto)) : this.listProdutosDisponiveis[i].produtos[j].precoVenda) }
          }
        }

        // this.listProdutosPesquisados = this.listProdutosPesquisa
        this.listProdutosPesquisa = listProdutosSemAgrupamento
        this.controlProdutos = JSON.parse(JSON.stringify(this.controlProdutos));//copia profunda para se alterar cada objeto

        this.getRegistrosProdutos()

      },
      fail => {
        this.loaderDismissCount += 1
      }
    )
  }

  async clickServicoSegment(event: any) {
    if (this.segmentSelecionado == undefined) {

    }
    let index = await this.slides.getActiveIndex()
    if (index == 1) {
      this.slides.slidePrev()

    }
  }

  async clickProdutoSegment(event: any) {
    let index = await this.slides.getActiveIndex()
    if (index == 0) {
      this.slides.slideNext()


    }

  }

  animateIndicator(event: any) {
  }

  marcarServico(i, j) {
    if (this.controlServicos[i][j].checked == true) {
      this.agendaService.getComiservs(this.controlServicos[i][j].service.servicoId, this.dadosAgendamento.clienteId == null ? this.clienteSelecionado.clienteId : this.dadosAgendamento.clienteId).subscribe(result => {
        if (result?.length > 0 && result[0].valorServico != this.controlServicos[i][j].precoConfigurado) {
          this.controlServicos[i][j].precoConfigurado = result[0].valorServico;
          this.controlServicos[i][j].descontoMax = this.controlServicos[i][j].descontoMax != result[0].valorServico ? result[0].valorServico : this.controlServicos[i][j].descontoMax;
          this.controlServicos[i][j].precoMax = this.controlServicos[i][j].precoMax != result[0].valorServico ? result[0].valorServico : this.controlServicos[i][j].precoMax;
          this.toast.presentToast(this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.TOAST.PACOTESERVICOENCONTRADO'));
          this.PacotesAplicados.push({
            serviceId: this.controlServicos[i][j].service.servicoId,
            valor: result[0].valorServico
          })
        }
      });
      this.controlServicos[i][j].service = this.gServicosDisponiveis[i].servicos[j]
      this.servicosSelecionados.push(this.controlServicos[i][j])
      this.controlServicos[i][j].quantidade = 1;

    }
    else if (this.controlServicos[i][j].checked == false) {
      this.servicosSelecionados = this.servicosSelecionados.filter(x => x.service.servicoId != this.controlServicos[i][j].service.servicoId)
    }


  }

  setKeyboardNumeric(event) {

    var elem = event
    event.target.setAttribute("type", "tel")

  }

  checkBoxSelectionFromServiceText(i: number, j: number) {
    if (this.controlServicos[i][j].checked == true) {
      this.controlServicos[i][j].checked = false
      this.marcarServico(i, j)
    }
    else {
      this.controlServicos[i][j].checked = true
      this.marcarServico(i, j)
    }
  }



  marcarProduto(i, j) {

    if (this.controlProdutos[i][j].checked == true) {
      this.controlProdutos[i][j].product = this.listProdutosDisponiveis[i].produtos[j]
      this.produtosSelecionados.push(this.controlProdutos[i][j])
      this.controlProdutos[i][j].quantidade = 1;
    }
    else if (this.controlProdutos[i][j].checked == false) {
      this.produtosSelecionados = this.produtosSelecionados.filter(x => x.product.produtoId != this.controlProdutos[i][j].product.produtoId)
    }
  }

  checkBoxSelectionFromProductText(i: number, j: number) {
    if (this.controlProdutos[i][j].checked == true) {
      this.controlProdutos[i][j].checked = false
      this.marcarProduto(i, j)
    }
    else {
      this.controlProdutos[i][j].checked = true
      this.marcarProduto(i, j)
    }
  }


  segmentChanged(ev: any) {
    this.lancarServicoProdutoSegment = ev.target.value
    this.indexAtualSegment = 0
    this.changeStyleSegment()
  }



  changeStyleSegment() {
    if (this.lancarServicoProdutoSegment == 'servico') {
      document.getElementById('servico').style.color = 'var(--cor-texto-escuro)';
      document.getElementById('produto').style.color = 'var(--cor-texto-claro)';
      this.selectFirstTabGServ()
    }
    if (this.lancarServicoProdutoSegment == 'produto') {
      document.getElementById('servico').style.color = 'var(--cor-texto-claro)';
      document.getElementById('produto').style.color = 'var(--cor-texto-escuro)';
      this.selectFirstTabLinhaProduto()
    }
  }


  async lancarServicosProdutos() {
    let listLancarServicos = []
    let listLancarProdutos = []

    if (this.servicosSelecionados?.length != 0) {
      for (let i = 0; i < this.servicosSelecionados?.length; i++) {
        let servico = new RegistrarServicoModel()
        servico.clienteId = this.possuiFicha == true ? this.dadosAgendamento.clienteId : this.clienteSelecionado.clienteId
        servico.observacao = this.servicosSelecionados[i].observacao
        servico.quantidade = this.servicosSelecionados[i].quantidade
        //aqui
        servico.preco = this.servicosSelecionados[i].precoConfigurado
        servico.servicoId = this.servicosSelecionados[i].service.servicoId
        servico.colaboradorAuxiliarID = this.servicosSelecionados[i].service.colaboradorAuxiliarID
        servico.quimicas = this.servicosSelecionados[i].service.quimicas
        listLancarServicos.push(JSON.parse(JSON.stringify(servico)))
      }

      this.lancarServicoAPI(listLancarServicos)
      this.toast.presentToast(this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.SUCCESS'));
    }
    if (this.produtosSelecionados?.length != 0) {
      for (let i = 0; i < this.produtosSelecionados?.length; i++) {
        let produto = new RegistrarProdutoModel()
        produto.clienteId = this.possuiFicha == true ? this.dadosAgendamento.clienteId : this.clienteSelecionado.clienteId
        produto.observacao = this.produtosSelecionados[i].observacao
        produto.quantidade = this.produtosSelecionados[i].quantidade
        produto.preco = this.produtosSelecionados[i].precoConfigurado
        produto.produtoId = this.produtosSelecionados[i].product.produtoId

        listLancarProdutos.push(JSON.parse(JSON.stringify(produto)))
      }
      this.lancarProdutoAPI(listLancarProdutos)
      this.toast.presentToast(this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.SUCCESSPRODUTO'));
    }
  }


  lancarServicoProdutoRapido() {
    let listLancarServicos = [];
    let paraForExterno = false;
    debugger
    for (let i = 0; i < this.controlServicos?.length; i++) {
      for (let j = 0; j < this.controlServicos[i]?.length; j++) {
        if (this.controlServicos[i][j].service.servicoId === this.dadosAgendamento.servicoId) {
          this.servicoPesquisadoInfo = this.controlServicos[i][j]
          this.indiceI = i;
          this.indiceJ = j;
          paraForExterno = true;
          break;
        }
      }
      if (paraForExterno) break; 
    }
    this.agendaService.getComiservs(this.dadosAgendamento.servicoId, this.dadosAgendamento.clienteId == null ? this.clienteSelecionado.clienteId : this.dadosAgendamento.clienteId).subscribe(result => {
      let servico = new RegistrarServicoModel();
      if (result?.length > 0 && result[0].valorServico != this.servicoPesquisadoInfo.precoConfigurado) {
        servico.preco = result[0].valorServico;
        this.toast.presentToast(this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.TOAST.PACOTESERVICOENCONTRADO'));
        this.PacotesAplicados.push({
          serviceId: this.dadosAgendamento.servicoId,
          valor: result[0].valorServico
        })
      }
      else {
        if(this.servicoPesquisadoInfo == null){
          servico.preco = 0;
          servico.quantidade = 1;
          servico.colaboradorAuxiliarID = null;
          servico.colaboradorAuxiliarNome = null;
          servico.servicoAuxiliarID = null;
          servico.nomeServico = this.dadosAgendamento.descricaoServico
        }
        else{
          servico.preco = this.servicoPesquisadoInfo.precoConfigurado;
          servico.quantidade = this.servicoPesquisadoInfo.quantidade;
          servico.colaboradorAuxiliarID = this.controlServicos[this.indiceI][this.indiceJ].service.colaboradorAuxiliarID;
          servico.colaboradorAuxiliarNome = this.controlServicos[this.indiceI][this.indiceJ].service.colaboradorAuxiliarNome;
          servico.servicoAuxiliarID = this.controlServicos[this.indiceI][this.indiceJ].service.servicoAuxiliarID
          servico.nomeServico = this.controlServicos[this.indiceI][this.indiceJ].service.nomeServico
        }
      }
      servico.clienteId = this.possuiFicha === true ? this.dadosAgendamento.clienteId : this.clienteSelecionado.clienteId;
      servico.servicoId = this.dadosAgendamento.servicoId

      servico.observacao = this.dadosAgendamento.observacao

      servico.naoPergAuxiliar = false;
      listLancarServicos.push(JSON.parse(JSON.stringify(servico)))
      this.lancarServicoAPI(listLancarServicos);
    });
  }

  lancarTodosServicoRapido(servicosAgendados) {
    servicosAgendados.forEach(serv => {
      let listLancarServicos = [];
      let paraForExterno = false;
      this.agendaService.getComiservs(serv, this.dadosAgendamento.clienteId == null ? this.clienteSelecionado.clienteId : this.dadosAgendamento.clienteId).subscribe(result => {
        for (let i = 0; i < this.controlServicos?.length; i++) {
          for (let j = 0; j < this.controlServicos[i]?.length; j++) {
            if (this.controlServicos[i][j].service.servicoId === serv) {
              this.servicoPesquisadoInfo = this.controlServicos[i][j]
              this.indiceI = i;
              this.indiceJ = j;
              paraForExterno = true;
              break;
            }
          }
          if (paraForExterno) break;
        }
        let servico = new RegistrarServicoModel();
        if (result?.length > 0 && result[0].valorServico != this.servicoPesquisadoInfo.precoConfigurado) {
          servico.preco = result[0].valorServico;
          this.toast.presentToast(this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.TOAST.PACOTESERVICOENCONTRADO'));
          this.PacotesAplicados.push({
            serviceId: serv,
            valor: result[0].valorServico
          })
        }
        else {
          servico.preco = this.servicoPesquisadoInfo.precoConfigurado;
        }
        servico.clienteId = this.possuiFicha === true ? this.dadosAgendamento.clienteId : this.clienteSelecionado.clienteId;
        servico.servicoId = serv
        servico.quantidade = this.servicoPesquisadoInfo.quantidade
        servico.observacao = this.dadosAgendamento.observacao
        servico.colaboradorAuxiliarID = this.controlServicos[this.indiceI][this.indiceJ].service.colaboradorAuxiliarID;
        servico.colaboradorAuxiliarNome = this.controlServicos[this.indiceI][this.indiceJ].service.colaboradorAuxiliarNome;
        servico.servicoAuxiliarID = this.controlServicos[this.indiceI][this.indiceJ].service.servicoAuxiliarID;
        servico.nomeServico = this.controlServicos[this.indiceI][this.indiceJ].service.nomeServico
        servico.naoPergAuxiliar = true;
        listLancarServicos.push(JSON.parse(JSON.stringify(servico)))
        this.lancarServicoAPI(listLancarServicos);
      });
    });
  }


  async alertLancarTodosAgendamentos() {
    let listaServicosAgendados;
    if (this.dadosAgendamento.clienteId != undefined && this.dadosAgendamento.clienteId != null) {
      await this.agendaService.getGetServicosAgendados(this.dadosAgendamento.clienteId).then(
        (result) => {
          listaServicosAgendados = result;
        },
        async (fail) => {
          listaServicosAgendados = [];
        });
      if (listaServicosAgendados.length > 1) {
        const alert = await this.alertController.create({
          header: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARTODOSSERVICOS.TITLE'),
          message: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARTODOSSERVICOS.MENSAGE'),
          cssClass: 'buttonCss',
          buttons: [
            {
              text: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARTODOSSERVICOS.NAO'),
              role: 'cancel',
              cssClass: 'cancelButton',
              handler: (blah) => {
                this.lancarServicoProdutoRapido();
              }
            }, {
              text: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARTODOSSERVICOS.SIM'),
              handler: () => {
                this.lancarTodosServicoRapido(listaServicosAgendados);
              }
            }
          ],
          backdropDismiss: false,
        });
        await alert.present();
      }
      else {
        this.lancarServicoProdutoRapido();
      }
    }
    else {
      this.lancarServicoProdutoRapido();
    }
  }

  async lancarServicoAPI(listLancarServicos) {
    this.launchButtonWaitingAPI = true
    this.loaderInfo.end = listLancarServicos?.length;
    await this.loadingService.present();
    let jaExisteServico: boolean = false; // variável verdadeira se o mesmo servico foi lançado novamente ou se foi lançado duas vezes
    for (var j = 0; j < listLancarServicos?.length; j++) {
      if (this.listServicosRegistrados?.length > 0) { // se um serviço ja foi lançado anteriormente
        for (var k = 0; k < this.listServicosRegistrados?.length; k++) {
          if (this.listServicosRegistrados[k].servicoId == listLancarServicos[j].servicoId) { //verifica se é o mesmo serviço
            jaExisteServico = true;
          }
        }
      }

      if (listLancarServicos[j].quantidade > 1) { //caso não tenha um serviço anteriormente lançado, verifica se dois ou mais serviços do mesmo serviço estao sendo lançados ao mesmo tempo
        jaExisteServico = true;
      }
    }

    if (jaExisteServico == true) { // se tem serviço repetido
      const alert = await this.alertController.create({
        //header: this.translate.instant('AGENDA.MODALNOVOBLOQUEIO.TITLE'),
        message: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.ALERTJAEXISTENTE.MENSAGEM'),
        cssClass: 'buttonCss',
        buttons: [
          {
            text: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.ALERTJAEXISTENTE.CANCELAR'),
            role: 'cancel',
            cssClass: 'cancelButton',
            handler: (blah) => {
            }
          }, {
            text: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.ALERTJAEXISTENTE.CONFIRMAR'),
            handler: () => {
              this.confirmaLancarServicoAPI(listLancarServicos)
            }
          }
        ],
        backdropDismiss: false,
      });
      await alert.present();
    }

    else { //se não tem nenhum serviço repetido
      this.confirmaLancarServicoAPI(listLancarServicos)
    }

  }

  async confirmaLancarServicoAPI(listLancarServicos) {
    for (let servico of listLancarServicos) {
      if (servico.servicoAuxiliarID != null && !servico.naoPergAuxiliar) {
        const alert = await this.alertController.create({
          header: servico.nomeServico != undefined ? servico.nomeServico : undefined,
          message: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.DESEJAADICIONARAUXILIAR'),
          cssClass: 'buttonCss',
          buttons: [
            {
              text: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.NAO'),
              role: 'cancel',
              cssClass: 'cancelButton',
              handler: () => {
                this.addAuxiliar = false;
              }
            }, {
              text: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.SIM'),
              handler: () => {
                this.addAuxiliar = true;
              }
            }
          ],
          backdropDismiss: false,
        });
        await alert.present();
      }
      this.agendaService.registrarServico(servico).subscribe(
        result => {
          this.loaderInfo.start += 1;
          //this.toast.presentToast(this.translate.instant('AGENDA.MODALS.NOVOAGENDAMENTO.SUCESSO') + ": " + posicao + "/" + this.listNovosAgendamentos?.length + " ");
          if (this.loaderInfo.start == this.loaderInfo.end) {
            this.lancarServicoProdutoSegment = 'servico'
            this.loadingService.dismiss();
            this.getProfissionalServicos()
            this.getPrecosProdutos()
            this.launchButtonWaitingAPI = false
            //this.ModalController.dismiss(1).then(() => this.confirmacaoAgendamentoModal())   
          }
        },
        fail => {
          if (fail.error == 'API.OREGISTROSERVICOS.REGISTRARSERVICO.COMANDAFECHADA.ERROR') {
            this.toast.presentToast(this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.TOAST.COMANDAFECHADA'), 'danger')
          }
          this.loaderInfo.start += 1;
          this.launchButtonWaitingAPI = false
        }
      )

    }
    this.segment = 'info'
    this.loaderInfo.start = 0
  }



  async lancarProdutoAPI(listLancarProdutos) {
    this.launchButtonWaitingAPI = true
    this.loaderInfo.end = listLancarProdutos?.length;
    await this.loadingService.present();

    for (var i = 0; i < listLancarProdutos?.length; i++) {

      const produto = listLancarProdutos[i]

      this.agendaService.registrarProduto(produto).subscribe(
        result => {
          this.loaderInfo.start += 1;

          if (this.loaderInfo.start == this.loaderInfo.end) {
            this.lancarServicoProdutoSegment = 'servico'
            this.segment = 'info'
            this.loadingService.dismiss();
            this.getProfissionalServicos()
            this.getPrecosProdutos()
            this.launchButtonWaitingAPI = false
            //this.ModalController.dismiss(1).then(() => this.confirmacaoAgendamentoModal())           
          }
        },
        fail => {
          this.loaderInfo.start += 1;
          this.launchButtonWaitingAPI = false
        }
      )

    }
    this.segment = 'info'
    this.loaderInfo.start = 0
  }




  getRegistrosProdutos() {
    if (this.totalQuantityGeneral != 0) {
      this.totalQuantityGeneral = this.totalQuantityGeneral - this.totalQuantityRegisteredProducts
    }
    if (this.totalPriceGeneral != 0) {
      this.totalPriceGeneral = this.totalPriceGeneral - this.totalPriceRegisteredProducts
    }

    this.totalQuantityRegisteredProducts = 0
    this.totalPriceRegisteredProducts = 0
    if (!!this.clienteSelecionado || !!this.dadosAgendamento.clienteId) {
      this.agendaService.getRegistrosProdutos(this.possuiFicha == true ? this.dadosAgendamento.clienteId : this.clienteSelecionado?.clienteId).subscribe(
        result => {
          this.loaderDismissCount += 1
          this.listProdutosRegistrados = result
          this.checkProductsEdition = JSON.parse(JSON.stringify(result))
          let breakControl = 0
          for (let i = 0; i < this.listProdutosRegistrados?.length; i++) {
            for (let j = 0; j < this.controlProdutos?.length; j++) {
              for (let k = 0; k < this.controlProdutos[j]?.length; k++) {
                if (this.controlProdutos[j][k].product.produtoId == this.listProdutosRegistrados[i].produtoId) {
                  this.listProdutosRegistrados[i]['precoPadrao'] = this.controlProdutos[j][k].product.precoVenda
                  this.listProdutosRegistrados[i]['maxDiscount'] = this.controlProdutos[j][k].descontoMax
                  this.listProdutosRegistrados[i]['maxPrice'] = this.controlProdutos[j][k].precoMax
                  this.listProdutosRegistrados[i]['editionDeactivated'] = true
                  breakControl = 1
                  break;
                }

              }
              if (breakControl == 1) {
                breakControl = 0
                break
              }
            }

          }
          this.listProdutosRegistrados = JSON.parse(JSON.stringify(this.listProdutosRegistrados))//copia profunda


          this.totalQuantityRegisteredProducts = this.listProdutosRegistrados.reduce((a, b) => a + b.quantidade, 0)
          this.totalPriceRegisteredProducts = this.listProdutosRegistrados.reduce((a, b) => a + (b.preco * b.quantidade), 0)
          this.totalQuantityGeneral = this.totalQuantityGeneral + this.totalQuantityRegisteredProducts
          this.totalPriceGeneral = this.totalPriceGeneral + this.totalPriceRegisteredProducts

          if (this.listProdutosServicosRegistrados?.length == 0) {
            this.listProdutosServicosRegistrados = this.listProdutosRegistrados
          }
          else {
            this.listProdutosServicosRegistrados = this.listProdutosServicosRegistrados?.concat(this.listProdutosRegistrados)
          }


          if (this.loaderDismissCount % 4 == 0) {
            this.loadingService.dismiss()
          }


        },
        fail => {
          this.loaderDismissCount += 1
          if (this.loaderDismissCount % 4 == 0) {
            this.loadingService.dismiss()
          }
        }
      )
    }
  }

  getRegistrosServicos() {
    if (this.totalPriceGeneral != 0) {
      this.totalPriceGeneral = this.totalPriceGeneral - this.totalPriceRegisteredServices
    }
    if (this.totalQuantityGeneral != 0) {
      this.totalQuantityGeneral = this.totalQuantityGeneral - this.totalQuantityRegisteredServices
    }
    this.totalQuantityRegisteredServices = 0
    this.totalPriceRegisteredServices = 0
    if (!!this.clienteSelecionado || !!this.dadosAgendamento.clienteId) {
      this.agendaService.getRegistroServicos(this.possuiFicha == true ? this.dadosAgendamento.clienteId : this.clienteSelecionado?.clienteId).subscribe(
        result => {
          this.loaderDismissCount += 1
          this.listServicosRegistrados = result
          this.checkServicesEdition = JSON.parse(JSON.stringify(result))

          let breakControl = 0
          for (let i = 0; i < this.listServicosRegistrados?.length; i++) {
            for (let j = 0; j < this.controlServicos?.length; j++) {
              for (let k = 0; k < this.controlServicos[j]?.length; k++) {
                if (this.controlServicos[j][k].service.servicoId == this.listServicosRegistrados[i].servicoId) {
                  this.listServicosRegistrados[i]['precoPadrao'] = this.controlServicos[j][k].service.precoServico
                  this.listServicosRegistrados[i]['editionDeactivated'] = true
                  this.listServicosRegistrados[i]['expandirQuimicaControl'] = false
                  this.PacotesAplicados.forEach(x => {
                    if (x.serviceId === this.listServicosRegistrados[i].servicoId) {
                      this.listServicosRegistrados[i]['maxDiscount'] = x.valor
                      this.listServicosRegistrados[i]['maxPrice'] = x.valor
                    }
                    else {
                      this.listServicosRegistrados[i]['maxDiscount'] = this.controlServicos[j][k].descontoMax
                      this.listServicosRegistrados[i]['maxPrice'] = this.controlServicos[j][k].precoMax
                    }
                  })
                  //this.gServicosDisponiveis[j].servicos[k].precoServico = Number(this.gServicosDisponiveis[j].servicos[k].precoServico * this.controlServicos[i][j].quantidade)
                  //this.controlServicos[i][j].precoConfigurado = parseInt(this.controlServicos[i][j].precoConfigurado) * parseInt(this.controlServicos[i][j].quantidade)
                  breakControl = 1
                  break;
                }
                //let index = this.gServicosDisponiveis.indexOf(this.listProdutosServicosRegistrados[i].servicoId)
              }
              if (breakControl == 1) {
                breakControl = 0
                break
              }
            }

          }

          // for(let i = 0; i < this.gServicosDisponiveis; i++){

          // }
          this.totalQuantityRegisteredServices = this.listServicosRegistrados.reduce((a, b) => a + b.quantidade, 0)
          this.totalPriceRegisteredServices = this.listServicosRegistrados.reduce((a, b) => a + b.preco * b.quantidade, 0)

          this.totalQuantityGeneral = this.totalQuantityGeneral + this.totalQuantityRegisteredServices
          this.totalPriceGeneral = this.totalPriceGeneral + this.totalPriceRegisteredServices

          if (this.listProdutosServicosRegistrados?.length == 0) {

            this.listProdutosServicosRegistrados = this.listServicosRegistrados

          }
          else {
            this.listProdutosServicosRegistrados = this.listProdutosServicosRegistrados?.concat(this.listServicosRegistrados)
          }

          if (this.loaderDismissCount % 4 == 0) {
            this.loadingService.dismiss()
          }
          setTimeout(() => {
            if (this.addAuxiliar) {
              this.agendaService.getColaboradoresAgendaveisPesquisados("'")
                .subscribe(
                  result => {
                    this.listColaboradoresAgendaveis = result;
                    this.enableEditionService(this.listServicosRegistrados?.length - 1);
                    setTimeout(() => { this.box_Auxiliar.handleNavigationOpen(); }, 500);
                  },
                  fail => {
                    this.enableEditionService(this.listServicosRegistrados?.length - 1);
                  }
                );
              this.addAuxiliar = false;
            }
          }, 2000)

        },
        fail => {
          this.loaderDismissCount += 1
          if (this.loaderDismissCount % 4 == 0) {
            this.loadingService.dismiss()
          }
        }
      )
    }
  }


  async enableEditionProduct(index: number) {

    let quantityElement = document.getElementsByClassName('quantityFieldProduct')[index] as HTMLElement
    let priceElement = document.getElementsByClassName('priceFieldProduct')[index] as HTMLElement
    if (this.listProdutosRegistrados[index].editionDeactivated == true) {
      quantityElement.style.border = '1px solid'
      priceElement.style.border = '1px solid'
      this.listProdutosRegistrados[index].editionDeactivated = false
    }
    else {

      quantityElement.style.border = '1px solid transparent'
      priceElement.style.border = '1px solid transparent'
      //if(this.listProdutosRegistrados[index].servicoId){
      const lookingForChangesProduct = this.checkProductsEdition[index]

      let produto: EditarRegistroProdutoModel = new EditarRegistroProdutoModel()
      produto.observacao = this.listProdutosRegistrados[index].observacao
      produto.quantidade = this.listProdutosRegistrados[index].quantidade
      produto.preco = this.listProdutosRegistrados[index].preco
      produto.registroProdutoId = this.listProdutosRegistrados[index].registroProdutoId

      if (lookingForChangesProduct.preco != produto.preco || lookingForChangesProduct.quantidade != produto.quantidade) {
        await this.loadingService.present()
        this.agendaService.updateRegistroProduto(produto).subscribe(
          result => {
            this.recalcTotalValues()
            this.checkProductsEdition[index].quantidade = produto.quantidade //atualiza determinado produto da lista de edição para a quantidade escolhida
            this.loadingService.dismiss()
          },
          fail => {
            this.loadingService.dismiss()
          }
        )
      }
      else {
      }

      this.listProdutosRegistrados[index].editionDeactivated = true
    }
  }



  async enableEditionService(index: number) {

    let quantityElement = document.getElementsByClassName('quantityFieldService')[index] as HTMLElement
    let priceElement = document.getElementsByClassName('priceFieldService')[index] as HTMLElement
    let divElement = document.getElementsByClassName('servicoRegistrado')[index] as HTMLElement

    if (this.listServicosRegistrados[index].editionDeactivated == true) {
      quantityElement.style.border = '1px solid'
      priceElement.style.border = '1px solid'


      this.listServicosRegistrados[index].editionDeactivated = false
    }
    else {
      quantityElement.style.border = '1px solid transparent'
      priceElement.style.border = '1px solid transparent'

      const lookingForChangesService = this.checkServicesEdition[index]

      let servico: EditarRegistroServicoModel = new EditarRegistroServicoModel()
      servico.observacao = this.listServicosRegistrados[index].observacao
      servico.quantidade = this.listServicosRegistrados[index].quantidade
      servico.preco = this.listServicosRegistrados[index].preco
      servico.registroServicoId = this.listServicosRegistrados[index].registroServicoId
      servico.colaboradorAuxiliarID = this.listServicosRegistrados[index].colaboradorAuxiliarID

      if (lookingForChangesService.preco != servico.preco || lookingForChangesService.quantidade != servico.quantidade || lookingForChangesService.colaboradorAuxiliarID != servico.colaboradorAuxiliarID) {
        this.updateRegistroServico(servico)
        this.checkServicesEdition[index].quantidade = servico.quantidade //atualiza a quantidade de um determinado serviço da lista de edição para a quantidade alterada
      }
      else {
      }
      this.listServicosRegistrados[index].editionDeactivated = true
    }
  }





  onChange(event: any, i, j) {

  }


  async buttonSlided() {
    // Alerta para caso nenhum serviço tenha sido adicionado
    if (this.listServicosRegistrados?.length == 0 && this.listProdutosRegistrados?.length == 0) {
      const alert = await this.alertController.create({
        header: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.ALERTNENHUMLANCAMENTO.TITLE'),
        message: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.ALERTNENHUMLANCAMENTO.MESSAGE'),
        cssClass: 'buttonCss',
        buttons: [
          {
            text: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.NAO'),
            role: 'cancel',
            cssClass: 'cancelButton',
            handler: () => {}
          }, {
            text: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.SIM'),
            handler: () => {
              this.setStatusExecByProf()
            }
          }
        ],
        backdropDismiss: false,
      });
      await alert.present();
    } else {
      this.setStatusExecByProf()
    }
    

  }

  async setStatusExecByProf() {
    await this.loadingService.present()
    if (this.finishButtonWaitingAPI == false) {
      this.finishButtonWaitingAPI = true
      this.agendaService.setExecByProf(this.dadosAgendamento.agendaId).subscribe(
        result => {
          this.modalController.dismiss('E') //significa que o status do agendamento precisa ser atualizado
          this.loadingService.dismiss()
        },
        fail => {
          this.finishButtonWaitingAPI = false
          this.loadingService.dismiss()
        }
      )
    }

  }

  recalcTotalValues() {

    this.totalQuantityGeneral = 0
    this.totalPriceGeneral = 0

    this.totalQuantityRegisteredProducts = this.listProdutosRegistrados.reduce((a, b) => a + b.quantidade, 0)
    this.totalPriceRegisteredProducts = this.listProdutosRegistrados.reduce((a, b) => a + (b.preco * b.quantidade), 0)

    this.totalQuantityRegisteredServices = this.listServicosRegistrados.reduce((a, b) => a + b.quantidade, 0)
    this.totalPriceRegisteredServices = this.listServicosRegistrados.reduce((a, b) => a + (b.preco * b.quantidade), 0)


    this.totalQuantityGeneral = this.totalQuantityGeneral + this.totalQuantityRegisteredServices + this.totalQuantityRegisteredProducts
    this.totalPriceGeneral = this.totalPriceGeneral + this.totalPriceRegisteredServices + this.totalPriceRegisteredProducts
  }




  changeServicoSelecionado(event: any) {
    if (event != undefined) {
      if (event.text != "") {
        for (let i = 0; i < this.controlServicos?.length; i++) {
          for (let j = 0; j < this.controlServicos[i]?.length; j++) {
            if (this.controlServicos[i][j].service.servicoId == event.servicoId) {
              this.servicoPesquisadoInfo = this.controlServicos[i][j]
              this.indiceI = i;
              this.indiceJ = j;
              break;
            }
          }
        }
        this.agendaService.getComiservs(event.servicoId, this.dadosAgendamento.clienteId == null ? this.clienteSelecionado.clienteId : this.dadosAgendamento.clienteId).subscribe(result => {
          if (result?.length > 0 && result[0].valorServico != this.servicoPesquisadoInfo.precoConfigurado) {
            this.servicoPesquisadoInfo.precoConfigurado = result[0].valorServico;
            this.servicoPesquisadoInfo.service.precoServico = result[0].valorServico;
            this.servicoPesquisadoInfo.descontoMax = this.servicoPesquisadoInfo.descontoMax != result[0].valorServico ? result[0].valorServico : this.servicoPesquisadoInfo.descontoMax;
            this.servicoPesquisadoInfo.precoMax = this.servicoPesquisadoInfo.precoMax != result[0].valorServico ? result[0].valorServico : this.servicoPesquisadoInfo.precoMax;
            this.toast.presentToast(this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.TOAST.PACOTESERVICOENCONTRADO'));
            this.PacotesAplicados.push({
              serviceId: this.servicoPesquisadoInfo.service.servicoId,
              valor: result[0].valorServico
            })
          }
          this.openModalServicoSelecionado();
        });
      }
    }
  }

  async openModalServicoSelecionado() {
    this.overlayDivControl = true
    const modal = await this.modalController.create({
      component: ServicoPesquisadoModalComponent,
      componentProps: {
        clienteId: this.possuiFicha == true ? this.dadosAgendamento.clienteId : this.clienteSelecionado.clienteId,
        listServicosRegistrados: this.listServicosRegistrados,
        dadosAgendamento: this.dadosAgendamento,
        dadosServicoPesquisado: this.servicoPesquisadoInfo,
        listColaboradoresAgendaveis: this.listColaboradoresAgendaveis,
        pesquisaColaboradorLoader: this.pesquisaColaboradorLoader,
        servicosSelecionados: this.servicosSelecionados,
        indiceI: this.indiceI,
        indiceJ: this.indiceJ

      },
      backdropDismiss: false,
      cssClass: 'servicoPesquisadoModal'
    })
    modal.onDidDismiss().then(retorno => {
      this.atualizaServicosProdutos()
      this.overlayDivControl = false
    })

    return await modal.present()
  }


  async changeProdutoSelecionado(event: any) {
    if (event != undefined) {
      if (event.text != "") {
        for (let i = 0; i < this.controlProdutos?.length; i++) {
          for (let j = 0; j < this.controlProdutos[i]?.length; j++) {
            if (this.controlProdutos[i][j].product.produtoId == event.produtoId) {
              this.produtoPesquisadoInfo = this.controlProdutos[i][j]
              break;
            }
          }
          if (this.produtoPesquisadoInfo != undefined && this.produtoPesquisadoInfo != null && this.produtoPesquisadoInfo.produtoId == event.produtoId) {
            break;
          }
        }

        this.overlayDivControl = true
        const modal = await this.modalController.create({
          component: ServicoPesquisadoModalComponent,
          componentProps: {
            clienteId: this.possuiFicha == true ? this.dadosAgendamento.clienteId : this.clienteSelecionado.clienteId,
            dadosAgendamento: this.dadosAgendamento,
            dadosProdutoPesquisado: this.produtoPesquisadoInfo
            //dadosAgendamento: this.agendamentos[index],
            //dataSelecionada: this.dataSelecionada,
            //infoProfissionaleAgenda: this.infoProfissionaleAgenda
          },
          backdropDismiss: false,
          cssClass: 'servicoPesquisadoModal'
        })
        modal.onDidDismiss().then(retorno => {
          this.overlayDivControl = false
        })

        return await modal.present()

      }
    }


  }



  pesquisaServicosParaRegistro(searchTerm: string) {
    this.listServicosPesquisados = []
    var listFilteredServices = []
    for (let i = 0; i < this.listServicosPesquisa?.length; i++) {
      if (this.listServicosPesquisa[i].nomeServico.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1) {
        listFilteredServices.push(this.listServicosPesquisa[i])
      }
    }
    this.listServicosPesquisados = JSON.parse(JSON.stringify(listFilteredServices.slice(0, 5)));
  }



  pesquisaProdutosParaRegistro(searchTerm: string) {
    var listFilteredProducts = []
    for (let i = 0; i < this.listProdutosPesquisa?.length; i++) {
      if (this.listProdutosPesquisa[i].descricaoProduto.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1 || this.listProdutosPesquisa[i].codigoBarras.indexOf(searchTerm) != -1) {
        listFilteredProducts.push(this.listProdutosPesquisa[i])
      }

    }
    this.listProdutosPesquisados = JSON.parse(JSON.stringify(listFilteredProducts.slice(0, 5)));

  }


  public valueNormalizer = (text: Observable<string>) => text.pipe(map((text: string) => {
    return {
      value: null,
      text: ""
    };
  }));


  voltarSegment() {
    this.lancarServicoProdutoSegment = 'servico';
    this.segment = 'info'

  }



  slideWillChange() {
  }

  closeModal() {
    this.modalController.dismiss();
  }


  pesquisaColaboradores(searchTerm: string) {
    this.pesquisaColaboradorLoader = true;
    if (searchTerm?.length > 2) {
      this.agendaService.getColaboradoresAgendaveisPesquisados(searchTerm)
        .subscribe(
          result => {
            this.pesquisaColaboradorLoader = false;
            this.listColaboradoresAgendaveis = result;
          },
          fail => {
            this.pesquisaColaboradorLoader = false;
            //this.onError(fail); 
          }
        );
    }
  }



  changeColaborador(event: any, i: number, j: number) {

    this.controlServicos[i][j].service.colaboradorAuxiliarID = event.profissionalId
    this.controlServicos[i][j].service.colaboradorAuxiliarNome = event.nomeProfissional
  }


  editColaboradorAuxiliar(event: any, index: number) {

    this.listServicosRegistrados[index].colaboradorAuxiliarID = event.profissionalId
    this.listServicosRegistrados[index].colaboradorAuxiliarNome = event.nomeProfissional
  }



  async openModalQuimica(i: number, j: number) {

    const modal = await this.modalController.create({
      component: NovaQuimicaComponent,
      componentProps: {
        servicoSelecionadoId: this.controlServicos[i][j].service.servicoId
      },
    })
    modal.onDidDismiss().then(retorno => {
      if (retorno.data?.quimicas) {
        if (this.controlServicos[i][j].service.quimicas != undefined) {
          this.controlServicos[i][j].service.quimicas = retorno.data.quimicas?.concat(this.controlServicos[i][j].service.quimicas)
        }
        else {
          this.controlServicos[i][j].service.quimicas = retorno.data.quimicas
        }

      }


    })

    return await modal.present()
  }



  removerQuimica(i: number, j: number, quimicaIndex: number) {
    this.controlServicos[i][j].service.quimicas.splice(quimicaIndex, 1)

  }

  expandirQuimica(i: number, j: number) {
    if (this.controlServicos[i][j].expandirQuimicaControl == 0) {
      this.controlServicos[i][j].expandirQuimicaControl = 1
    }
    else if (this.controlServicos[i][j].expandirQuimicaControl == 1) {
      this.controlServicos[i][j].expandirQuimicaControl = 0
    }
  }


  expandirQuimicaResumo(index: number) {
    if (this.listServicosRegistrados[index].expandirQuimicaControl == false) {
      this.listServicosRegistrados[index].expandirQuimicaControl = true
    }
    else if (this.listServicosRegistrados[index].expandirQuimicaControl == true) {
      this.listServicosRegistrados[index].expandirQuimicaControl = false
    }


  }


  async openModalEdicaoQuimica(i: number, quimicaIndex: number, j?: number) {
    this.overlayDivControl = true
    if (j) {
      const modal = await this.modalController.create({
        component: EdicaoQuimicaComponent,
        componentProps: {
          quimicaSelecionadaEdicao: this.controlServicos[i][j].service.quimicas[quimicaIndex],
          preLancamento: 1,
        },
        backdropDismiss: false,
        cssClass: 'servicoPesquisadoModal'
      })
      modal.onDidDismiss().then(retorno => {
        this.overlayDivControl = false
      })
      return await modal.present()
    }
    else {
      const modal = await this.modalController.create({
        component: EdicaoQuimicaComponent,
        componentProps: {
          quimicaSelecionadaEdicao: this.listServicosRegistrados[i].quimicas[quimicaIndex],
          servicoEdicao: this.listServicosRegistrados[i],
          preLancamento: 0,
        },
        backdropDismiss: false,
        cssClass: 'servicoPesquisadoModal'
      })
      modal.onDidDismiss().then(retorno => {
        this.overlayDivControl = false

      })
      return await modal.present()
    }


  }


  removerQuimicaServicoRegistrado(indexList: number, indexQuimica: number) {

    this.listServicosRegistrados[indexList].quimicas.splice(indexQuimica, 1)
    let servico: EditarRegistroServicoModel = new EditarRegistroServicoModel()
    servico.observacao = this.listServicosRegistrados[indexList].observacao
    servico.preco = this.listServicosRegistrados[indexList].preco
    servico.quantidade = this.listServicosRegistrados[indexList].quantidade
    servico.registroServicoId = this.listServicosRegistrados[indexList].registroServicoId
    servico.colaboradorAuxiliarID = this.listServicosRegistrados[indexList].colaboradorAuxiliarID
    servico.quimicas = this.listServicosRegistrados[indexList].quimicas

    this.updateRegistroServico(servico)
  }


  updateRegistroServico(servico) {
    this.loadingService.present()
    this.agendaService.updateRegistroServico(servico).subscribe(
      result => {
        this.recalcTotalValues()
        this.loadingService.dismiss()
      },
      fail => {
        this.loadingService.dismiss()

      }
    )
  }



  async removingQuimicaAlert(indexList: number, indexQuimica: number) {
    const alert = await this.alertController.create({
      header: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.ALERTREMOCAOQUIMICA.HEADER'),
      message: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.ALERTREMOCAOQUIMICA.MESSAGE'),
      cssClass: 'buttonCss',
      buttons: [
        {
          text: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.ALERTREMOCAOQUIMICA.CANCELARREMOCAO'),
          role: 'cancel',
          cssClass: 'cancel-button',
          handler: (blah) => {
          }
        }, {
          text: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.ALERTREMOCAOQUIMICA.CONFIRMARREMOCAO'),
          handler: () => {
            this.removerQuimicaServicoRegistrado(indexList, indexQuimica);

          }
        }
      ],
      backdropDismiss: false,
    });

    await alert.present();
  }




  pesquisaClientes(searchTerm: string) {
    this.pesquisaClienteLoader = true;
    if (searchTerm?.length > 1) {
      this.agendaService.getClientesPesquisadosPresentes(searchTerm)
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
    let error: boolean = true;
    if (event != undefined) {
      if (this.listClientes != undefined && this.listClientes != null || this.listClientesPresentes != undefined && this.listClientesPresentes != null) {
        let client = this.listClientes.filter(x => x.clienteId == event.clienteId)[0];
        if (client != undefined && client != null) {
          this.clienteSelecionado = client;
          this.atualizaServicosProdutos()
          //this.clientePreenchido = true;
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
      const fail = {
        error: "SCHEDULER.ERRORS.CLIENTNOTFOUND"
      }
    }
    this.pesquisaClienteLoader = false;
  }


  changeClientePresente(event: any) {
    let error: boolean = true;
    if (event != undefined) {
      if (this.listClientesPresentes != undefined && this.listClientesPresentes != null) {
        let client = this.listClientesPresentes.filter(x => x.clienteId == event.clienteId)[0];
        if (client != undefined && client != null) {
          this.clienteSelecionado = client;
          this.atualizaServicosProdutos()
          //this.clientePreenchido = true;
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
      const fail = {
        error: "SCHEDULER.ERRORS.CLIENTNOTFOUND"
      }
    }
    this.pesquisaClienteLoader = false;
  }

  async exibeNome(nome: string, servico: boolean = true) {
    const alert = await this.alertController.create({
      header: servico ? this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.EXIBENOMEALERT.TITLE.SERVICO') : this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.EXIBENOMEALERT.TITLE.PRODUTO'),
      message: nome,
      cssClass: 'buttonCss',
      buttons: [
        {
          text: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.EXIBENOMEALERT.BUTTON.FECHAR'),
          role: 'cancel',
          handler: (blah) => {
          }
        }
      ],
      backdropDismiss: false,
    });
    await alert.present();
  }

  async onClickEdit(ev: any, index: number, elementoFicha: any) {

    const popover = await this.popoverController.create({
      component: PopoverAtendimentoComponent,
      event: ev,
      componentProps: {
        listaProdutosRegistrados: this.listProdutosRegistrados,
        listaServicosRegistrados: this.listServicosRegistrados,
        index: index,
        elementoFicha: elementoFicha,
      },
      translucent: true,
    });
    popover.onDidDismiss().then(retorno => {

      if (retorno.data != undefined) {
        if (retorno.role === "edit-product") {
          this.enableEditionProduct(retorno.data);
          return;
        }
        else if (retorno.role === "edit-service") {
          this.enableEditionService(retorno.data);
          return;
        }
        else if (retorno.role === "produto") {
          this.listProdutosRegistrados = retorno.data;
          this.recalcTotalValues();
          return;
        }
        else {
          this.listServicosRegistrados = retorno.data;
          this.recalcTotalValues();
          return;
        }
      }
    })
    return await popover.present();
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
    return "Não cadastrado";
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



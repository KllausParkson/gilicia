import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../../../core/services/loading.service';
import { ModalController } from '@ionic/angular';
import { AgendaService } from '../../services/agenda.service'
import { IonSlides } from '@ionic/angular';
import { RegistroQuimicaModel } from '../../models/registroQuimicaModel'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProdutoPesquisadoQuimicaComponent } from '../produto-pesquisado-quimica/produto-pesquisado-quimica.component'
import { ParametrosLightModel } from '../../models/parametrosLightModel';

@Component({
  selector: 'app-nova-quimica',
  templateUrl: './nova-quimica.component.html',
  styleUrls: ['./nova-quimica.component.scss'],
})
export class NovaQuimicaComponent implements OnInit {

  @ViewChild('SwipedTabsSlider') SwipedTabsSlider: IonSlides;
  public listProdutosDisponiveis: any;
  public controlProdutos: Array<any>;
  public listProdutosRegistrados = []
  public parametrosLight: ParametrosLightModel;
  public produtosSelecionados = []
  public indexAtualSegment: number = 0;
  public segment: any;

  public servicoSelecionadoId: number;

  public listQuimicas: any = []

  public innerWidth: any;
  public innerHeight: any;

  public listProdutosPesquisa: any = [] //lista populada com todos os produtos para ser usada para filtragem
  public listProdutosPesquisados: any = [] //lista que armazenará os items que correspondem ao termo pesquisado

  public produtoPesquisadoInfo: any;
  public overlayDivControl: boolean = false;
  public slideContentHeight: any;
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.slideContentHeight = innerHeight - 300
    this.slideContentHeight = this.slideContentHeight.toString() + 'px'
  }


  constructor(public translate: TranslateService,
    private ModalController: ModalController,
    private loadingService: LoadingService,
    private agendaService: AgendaService,) { }

  ngOnInit() {
    this.getScreenSize()
    this.getParametrosLight()
    this.getPrecosProdutos()
    this.updateIndicatorPosition()
    this.selectFirstTabLinhaProduto()
    this.segment = 'Productsegment-0'
  }

  closeModal() {
    this.ModalController.dismiss()
  }


  async getPrecosProdutos() {
    await this.loadingService.present()
    this.agendaService.getPrecosProdutos().subscribe(
      result => {
        let listProdutosSemAgrupamento = []
        this.listProdutosDisponiveis = result
        this.controlProdutos = new Array(this.listProdutosDisponiveis?.length).fill(0) //inicializa o array com o número de posições igual ao número de gservs
        for (let i = 0; i < this.listProdutosDisponiveis?.length; i++) {
          this.controlProdutos[i] = new Array(this.listProdutosDisponiveis[i].produtos?.length) //cada posição do array deve conter um novo array com o tamanho equivalente a quantidade de servicos de um gservs
          for (let j = 0; j < this.listProdutosDisponiveis[i].produtos?.length; j++) {
            listProdutosSemAgrupamento.push(this.listProdutosDisponiveis[i].produtos[j])
            this.controlProdutos[i][j] = { product: this.listProdutosDisponiveis[i].produtos[j], observacao: '', partes: '', produtoDescricao: '', checked: false } //precoMax: (this.listProdutosDisponiveis[i].produtos[j].precoVenda/100 *this.infoDescontos.sobrePrecoMaxProduto), descontoMax: this.listProdutosDisponiveis[i].produtos[j].precoVenda - (this.listProdutosDisponiveis[i].produtos[j].precoVenda/100 * this.infoDescontos.descontoMaxProduto)
          }
        }


        this.listProdutosPesquisa = listProdutosSemAgrupamento
        this.controlProdutos = JSON.parse(JSON.stringify(this.controlProdutos));//copia profunda para se alterar cada objeto
        if (this.listProdutosRegistrados == null || this.listProdutosRegistrados == undefined || this.listProdutosRegistrados?.length == 0) {
        }


      },
      fail => {
      }
    )
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

  marcarProduto(i, j) {

    if (this.controlProdutos[i][j].checked == true) {
      this.controlProdutos[i][j].product = this.listProdutosDisponiveis[i].produtos[j]
      this.produtosSelecionados.push(this.controlProdutos[i][j])

    }
    else if (this.controlProdutos[i][j].checked == false) {
      this.produtosSelecionados = this.produtosSelecionados.filter(x => x.product.produtoId != this.controlProdutos[i][j].product.produtoId)
    }

  }

  async updateIndicatorPosition() {
    let indexSlide = await this.SwipedTabsSlider?.getActiveIndex()

    document.getElementById("Productsegment-" + indexSlide)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
    this.selectTab(indexSlide)
    if (this.SwipedTabsSlider?.length() > this.SwipedTabsSlider.getActiveIndex()) {
    }

  }


  selectTab(index: number) {
    let segmentLinhaProduto = document.getElementsByClassName('produtoQuimicaSegment') as HTMLCollectionOf<HTMLElement>;
    /*  */
    if (this.indexAtualSegment != index && index != undefined) {

      segmentLinhaProduto[this.indexAtualSegment].style.borderBottom = "0px"
      segmentLinhaProduto[this.indexAtualSegment].style.color = "var(--cor-texto-escuro)"
      segmentLinhaProduto[index].style.color = "var(--ion-color-primary)"
      segmentLinhaProduto[index].style.borderBottom = "2px solid var(--ion-color-primary)"
      this.indexAtualSegment = index;
    }
    if (index == undefined) {
      index = 0
      this.indexAtualSegment = 1
    }


    this.SwipedTabsSlider.slideTo(index, 500);
  }


  selectFirstTabLinhaProduto() {
    setTimeout(() => {
      let firstTab = document.getElementsByClassName('linhaProdutosQuimica')[0] as HTMLElement
      firstTab.style.color = "var(--ion-color-primary)"
      firstTab.style.borderBottom = "2px solid var(--ion-color-primary)"
      this.indexAtualSegment = 0
    }, 700);
  }




  cadastrarQuimicas() {
    for (let i = 0; i < this.produtosSelecionados?.length; i++) {
      let quimica: RegistroQuimicaModel = new RegistroQuimicaModel();
      quimica.partes = this.produtosSelecionados[i].partes
      quimica.observacao = this.produtosSelecionados[i].observacao
      quimica.produtoDescricao = this.produtosSelecionados[i].product.descricaoProduto
      quimica.produtoId = this.produtosSelecionados[i].product.produtoId
      quimica.registroQuimicaId = 0
      quimica.registroServicoId = this.servicoSelecionadoId
      this.listQuimicas.push(quimica)
    }


    this.ModalController.dismiss({ quimicas: this.listQuimicas })

  }

  animateIndicator(event: any) {
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

  onChange(event: any, i, j) {

  }

  pesquisaProdutosParaQuimica(searchTerm: string) {
    var listFilteredProducts = []
    for (let i = 0; i < this.listProdutosPesquisa?.length; i++) {
      if (this.listProdutosPesquisa[i].descricaoProduto.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1 || this.listProdutosPesquisa[i].codigoBarras.indexOf(searchTerm) != -1) {
        listFilteredProducts.push(this.listProdutosPesquisa[i])
      }

    }
    this.listProdutosPesquisados = JSON.parse(JSON.stringify(listFilteredProducts.slice(0, 5)));

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
          if (this.produtoPesquisadoInfo != undefined && this.produtoPesquisadoInfo != null) {
            break;
          }
        }


        this.overlayDivControl = true

        const modal = await this.ModalController.create({
          component: ProdutoPesquisadoQuimicaComponent,
          componentProps: {
            dadosProdutoPesquisado: this.produtoPesquisadoInfo,
            servicoSelecionadoId: this.servicoSelecionadoId
            //dadosAgendamento: this.agendamentos[index],
            //dataSelecionada: this.dataSelecionada,
            //infoProfissionaleAgenda: this.infoProfissionaleAgenda
          },
          backdropDismiss: false,
          cssClass: 'servicoPesquisadoModal'
        })
        modal.onDidDismiss().then(retorno => {
          this.overlayDivControl = false
          if (retorno?.data?.quimica) {
            this.listQuimicas.push(retorno.data.quimica)
          }
          setTimeout(() => {
            this.ModalController.dismiss({ quimicas: this.listQuimicas })
          }, 500);

        })

        return await modal.present()

      }
    }
  }

  public valueNormalizer = (text: Observable<string>) => text.pipe(map((text: string) => {
    return {
      value: null,
      text: ""
    };
  }));
}

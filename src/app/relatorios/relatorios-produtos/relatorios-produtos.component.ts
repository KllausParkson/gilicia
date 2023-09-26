import { Component, HostListener, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DateUtils } from 'app/core/common/data-type-utils/date-utils';
import { CurrencyGlobalPipe } from 'app/core/pipes/currencyGlobal.pipe';
import { LoadingService } from 'app/core/services/loading.service';
import { TopProdutosModel } from '../models/top-produtos-model';
import { RelatorioService } from '../services/relatorio.service';

class ChartArray {
  produtoId: number;
  nomeProduto: string;
  porcentagem: number;
  cor: string;
}

@Component({
  selector: 'app-relatorios-produtos',
  templateUrl: './relatorios-produtos.component.html',
  styleUrls: ['./relatorios-produtos.component.scss'],
})
export class RelatoriosProdutosComponent implements OnInit {

  public startDate: Date = new Date();
  public endDate: Date = new Date();

  public topProdutos: TopProdutosModel;
  public countProdutos: number = 0;

  public cores: string[] = [
    "#86cb96",
    "#ffad0d",
    "#ec7176",
    "#5c63a2",
    "#45c7ff",
    "#e9e9e9",
    "#7c4dff",
    "#bcbcbc",
    "#1be1af",
    "#0518a3",
    "#ed156f"
  ];

  public chart: ChartArray[];
  public innerWidth: any;
  public innerHeight: any;
  public divContentHeight: any;
  public cardHeight: any;
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.divContentHeight = innerHeight - 550
    this.divContentHeight = this.divContentHeight.toString() + 'px'
  }
  constructor(private RelatorioSerivce: RelatorioService,
    private LoadingService: LoadingService,
    private Currency: CurrencyGlobalPipe,
    private Translate: TranslateService) { }

  ngOnInit() {
    this.getScreenSize()
    this.getTopProdutos();
  }

  receiveDate(event: any) {
    if (event.startDate != this.startDate || event.endDate != this.endDate) {
      this.startDate = event.startDate;
      this.endDate = event.endDate;

      this.getTopProdutos()
    }
  }

  async getTopProdutos() {
    await this.LoadingService.present()
    this.RelatorioSerivce.getTopProdutos(DateUtils.DateToString(this.startDate), DateUtils.DateToString(this.endDate))
      .subscribe(
        res => {
          this.topProdutos = res;

          this.createChartArray()

          this.LoadingService.dismiss()
        },
        fail => {
          this.LoadingService.dismiss()
        }
      )
  }

  private createChartArray() {
    this.chart = new Array<ChartArray>()
    this.topProdutos.produtos?.forEach((produto, index) => {
      //adiciona o nome Outros na lista caso ele exista e formata o nome com os valores
      if (produto.produtoId === 0) {
        produto.nomeProduto = this.Translate.instant("RELATORIOS.PRODUTOS.OUTROS")
      }
      //cria um array para colocar no grafico
      this.chart.push({
        produtoId: produto.produtoId,
        nomeProduto: produto.nomeProduto,
        porcentagem: parseFloat(produto.porcentagem.toFixed(2)),
        cor: this.cores[index]
      })
    })

  }

  //retorna uma string com o valor formatado do item
  getValorFormatado(prod: ChartArray): string {
    let res = this.topProdutos.produtos.filter(p => p.produtoId == prod.produtoId)

    return `${this.Currency.transform(res[0].valor)}`
  }

  //metodo usado pelo grafico para gerar os labels na imagem
  public labelContent(e: any): string {
    let formated = `${(e.value).toFixed(2)}%`;

    return formated;
  }

}

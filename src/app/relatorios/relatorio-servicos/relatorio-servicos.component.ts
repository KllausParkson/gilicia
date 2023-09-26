import { Component, HostListener, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DateUtils } from 'app/core/common/data-type-utils/date-utils';
import { CurrencyGlobalPipe } from 'app/core/pipes/currencyGlobal.pipe';
import { LoadingService } from 'app/core/services/loading.service';
import { TopServicosModel } from '../models/top-servicos-model';
import { RelatorioService } from '../services/relatorio.service';

class ChartArray {
  servicoId: number;
  nomeServico: string;
  porcentagem: number;
  cor: string;
}

@Component({
  selector: 'app-relatorio-servicos',
  templateUrl: './relatorio-servicos.component.html',
  styleUrls: ['./relatorio-servicos.component.scss'],
})
export class RelatorioServicosComponent implements OnInit {

  public startDate: Date = new Date();
  public endDate: Date = new Date();

  public topServicos: TopServicosModel;

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
    this.getTopServicos()
  }

  public receiveDate(event: any) {
    if (event.startDate != this.startDate || event.endDate != this.endDate) {
      this.startDate = event.startDate;
      this.endDate = event.endDate;

      this.getTopServicos()
    }
  }

  private async getTopServicos() {
    await this.LoadingService.present()
    this.RelatorioSerivce.getTopServicos(DateUtils.DateToString(this.startDate), DateUtils.DateToString(this.endDate))
      .subscribe(
        res => {
          this.topServicos = res;

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
    this.topServicos.servicos?.forEach((produto, index) => {
      //adiciona o nome Outros na lista caso ele exista e formata o nome com os valores
      if (produto.servicoId === 0) {
        produto.nomeServico = this.Translate.instant("RELATORIOS.SERVICOS.OUTROS")
      }
      //cria um array para colocar no grafico
      this.chart.push({
        servicoId: produto.servicoId,
        nomeServico: produto.nomeServico,
        porcentagem: parseFloat(produto.porcentagem.toFixed(2)),
        cor: this.cores[index]
      })
      //this.countProdutos += produto.valor
    })

  }

  //retorna uma string com o valor formatado do item
  public getValorFormatado(prod: ChartArray): string {
    let res = this.topServicos.servicos.filter(p => p.servicoId == prod.servicoId)

    return `${this.Currency.transform(res[0].valor)}`
  }

  //metodo usado pelo grafico para gerar os labels na imagem
  public labelContent(e: any): string {
    let formated = `${(e.value).toFixed(2)}%`;

    return formated;
  }
  public labelItemContent(e: any): string {
    let formated = `${(e.value).toFixed(2)}%`;
    return formated;
  }
}



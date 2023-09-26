import { Component, HostListener, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DateUtils } from 'app/core/common/data-type-utils/date-utils';
import { CurrencyGlobalPipe } from 'app/core/pipes/currencyGlobal.pipe';
import { LoadingService } from 'app/core/services/loading.service';
import { TopFaturamentoModel } from '../models/top-faturamento-model';
import { RelatorioService } from '../services/relatorio.service';

class ChartArray {
  profissinalId: number;
  nomeProfissional: string;
  porcentagem: number;
  cor: string;
}

@Component({
  selector: 'app-relatorio-faturamento',
  templateUrl: './relatorio-faturamento.component.html',
  styleUrls: ['./relatorio-faturamento.component.scss'],
})
export class RelatorioFaturamentoComponent implements OnInit {

  public startDate = new Date();
  public endDate = new Date();

  public topFaturamento: TopFaturamentoModel;

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
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.divContentHeight = innerHeight - 500
    this.divContentHeight = this.divContentHeight.toString() + 'px'
  }
  constructor(private RelatorioService: RelatorioService,
              private LoadingService: LoadingService,
              private Translate: TranslateService,
              private Currency: CurrencyGlobalPipe) { }

  ngOnInit() {
    this.getScreenSize()
    this.getTopFaturamento()
  }

  receiveDate(event: any) {
    if(event.startDate != this.startDate || event.endDate != this.endDate){
      this.startDate = event.startDate;
      this.endDate = event.endDate; 

      this.getTopFaturamento()
    }
  }

  async getTopFaturamento() {
    await this.LoadingService.present()

    this.RelatorioService.getTopFaturamento(DateUtils.DateToString(this.startDate), DateUtils.DateToString(this.endDate))
      .subscribe(
        res => {
          this.LoadingService.dismiss()

          this.topFaturamento = res;
          this.createChartArray()
        },
        fail => {
          this.LoadingService.dismiss()
        }
      )
  }

  private createChartArray() {
    this.chart = new Array<ChartArray>()
    this.topFaturamento.profissionais?.forEach((p, index) => {
      //adiciona o nome Outros na lista caso ele exista e formata o nome com os valores
      if(p.profissionalId === 0) {
        p.nomeProfissional = this.Translate.instant("RELATORIOS.PRODUTOS.OUTROS")
      }
      //cria um array para colocar no grafico
      this.chart.push({
        profissinalId: p.profissionalId,
        nomeProfissional: p.nomeProfissional,
        porcentagem: parseFloat(p.porcentagem.toFixed(2)),
        cor: this.cores[index]
      })
      
    })

  }

  //retorna uma string com o valor formatado do item
  getValorFormatado(prod: ChartArray):string {
    let res = this.topFaturamento.profissionais.filter(p => p.profissionalId == prod.profissinalId)
    
    return `${this.Currency.transform(res[0].valor)}`
  }

  //metodo usado pelo grafico para gerar os labels na imagem
  public labelContent(e: any): string {
    let formated = `${(e.value).toFixed(2)}%`;
    
    return formated;
  }

}

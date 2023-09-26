import { Component, OnInit, Input, HostListener } from '@angular/core';
import { DatePipe } from "@angular/common";
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { RelatorioService } from '../../services/relatorio.service';
import { WhatsappCobrancaModel } from '../../models/whatsappCobrancaModel';
import { LoadingService } from 'app/core/services/loading.service';



@Component({
  selector: 'app-extrato-chatbot',
  templateUrl: './extrato-chatbot.component.html',
  styleUrls: ['./extrato-chatbot.component.scss'],
})

export class ExtratoChatbotComponent implements OnInit {

  @Input() Saldo: number;

  public dataInicial: Date = new Date();
  public dataFinal: Date = new Date();
  public whatsappCobranca: WhatsappCobrancaModel;
  public totalMensagens: number = 0;
  public totalGasto: number = 0;
  public taxaDeAdesao: Array<number>;
  public openCard: Array<boolean>;

  public exibeInformacoes = false;
  public innerHeight: any;
  public divContentHeight: any;

  constructor(
    public translate: TranslateService,
    private LoadingService: LoadingService,
    private modalController: ModalController,
    private relatorioService: RelatorioService,
    private datePipe: DatePipe
  ) { }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.innerHeight = window.innerHeight;
    this.divContentHeight = innerHeight - 200;
    this.divContentHeight = this.divContentHeight.toString() + 'px';
  }
  ngOnInit() {
    this.exibirExtrato()
  }

  closeModal() {
    this.modalController.dismiss();
  }
  receiveDate(event: any) {
    if (event.startDate != this.dataInicial || event.endDate != this.dataFinal) {
      this.dataInicial = event.startDate;
      this.dataFinal = event.endDate;

      this.exibirExtrato()
    }
  }

  recuperaTotalMensagens(whatsappCobranca: WhatsappCobrancaModel) {
    this.totalMensagens = 0
    for (let item of whatsappCobranca.informacoesWhatsapp) {
      this.totalMensagens = this.totalMensagens + item.mensagensTrocadas;
    }
  }
  recuperaTotalGasto(whatsappCobranca: WhatsappCobrancaModel) {
    this.totalGasto = 0
    for (let item of whatsappCobranca.informacoesWhatsapp) {
      this.totalGasto = this.totalGasto + item.custoCliente;
    }
  }


  async getMovimentacoesPorData(dataInicio, dataFim) {
    await this.LoadingService.present()
    this.relatorioService
      .getMovimentacoesPorData(dataInicio, dataFim)
      .subscribe(res => {
        this.whatsappCobranca = res.data;

        this.openCard = new Array<boolean>(this.whatsappCobranca.informacoesWhatsapp?.length).fill(false);
        this.taxaDeAdesao = new Array<number>();
        if (this.whatsappCobranca.informacoesWhatsapp?.length > 0) {
          this.recuperaTotalMensagens(this.whatsappCobranca);
          this.recuperaTotalGasto(this.whatsappCobranca);
          for (let item of this.whatsappCobranca.informacoesWhatsapp) { 
            let taxa;
            if(item.confirmacoesEnviadas == null || item.confirmacoesEnviadas == 0){
              taxa = 0
            }
            else{
              taxa = item.quantidadeConfirmacoes/item.confirmacoesEnviadas
            }
            this.taxaDeAdesao.push(taxa);
            item.dataMovimentacao = this.datePipe.transform(item.dataMovimentacao, 'shortDate');
          }
        }
        this.LoadingService.dismiss()
      })
  }

  abreTodosCards() {
    if (this.openCard.every((el) => el == true)) {
      this.openCard.fill(false);
    }
    else {
      this.openCard.fill(true);
    }
  }

  abreCardSelecionado(index: number) {
    this.openCard[index] = !this.openCard[index];
  }

  exibirExtrato() {
    this.getMovimentacoesPorData(this.dataInicial.toISOString().split('T')[0], this.dataFinal.toISOString().split('T')[0])
  }

}

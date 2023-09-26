import { Component, HostListener, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { addDays } from '@progress/kendo-date-math';
import { TranslateService } from '@ngx-translate/core';
import { RelatorioService } from '../services/relatorio.service';
import { WhatsappCobrancaModel } from '../models/whatsappCobrancaModel';
import { ExtratoChatbotComponent } from './extrato-chatbot/extrato-chatbot.component'
import { LoadingService } from 'app/core/services/loading.service';

@Component({
  selector: 'app-relatorio-chatbot',
  templateUrl: './relatorio-chatbot.component.html',
  styleUrls: ['./relatorio-chatbot.component.scss'],
})
export class RelatorioChatbotComponent implements OnInit {

  public dataDiaAnterior: Date;
  public dataString: string;

  public whatsappCobranca: WhatsappCobrancaModel;

  public innerWidth: any;
  public innerHeight: any;
  public divContentHeight: any;
  public cardHeight: any;
  public totalGasto: number = 0;
  public totalMensagens: number = 0;
  public totalInteracoesBot: number = 0;
  public totalInteracoesUser: number = 0;
  public totalAgendamentos: number = 0;
  public totalConfirmacoes: number = 0;

  @HostListener('window:resize', ['$event'])

  getScreenSize(event?) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.divContentHeight = innerHeight - 200
    this.divContentHeight = this.divContentHeight.toString() + 'px'
  }
  constructor(
    public translate: TranslateService,
    private LoadingService: LoadingService,
    private modalController: ModalController,
    private RelatorioService: RelatorioService
  ) { }

  ngOnInit() {
    this.dataDiaAnterior = addDays(new Date(), -1);
    this.dataString = this.dataDiaAnterior.toISOString().split('T')[0]

    this.getScreenSize()
    this.getMovimentacoesPorData(this.dataString, this.dataString)
  }

  async getMovimentacoesPorData(dataInicio: string, dataFim: string) {
    await this.LoadingService.present()
    this.RelatorioService.getMovimentacoesPorData(dataInicio, dataFim)
      .subscribe(res => {
        this.whatsappCobranca = res.data;
        if (this.whatsappCobranca.informacoesWhatsapp?.length > 0) {
          this.totalGasto = this.whatsappCobranca.informacoesWhatsapp[0].custoCliente
          this.totalMensagens = this.whatsappCobranca.informacoesWhatsapp[0].mensagensTrocadas
          this.totalInteracoesBot = this.whatsappCobranca.informacoesWhatsapp[0].quantidadeInteracaoUsuario
          this.totalInteracoesUser = this.whatsappCobranca.informacoesWhatsapp[0].quantidadeInteracaoBot
          this.totalAgendamentos = this.whatsappCobranca.informacoesWhatsapp[0].quantidadeAgendamentos
          this.totalConfirmacoes = this.whatsappCobranca.informacoesWhatsapp[0].quantidadeConfirmacoes
        }
        if (this.whatsappCobranca.saldo == undefined || this.whatsappCobranca.saldo == null) {
          this.whatsappCobranca.saldo = 0
        }
        this.LoadingService.dismiss()
      });
  }

  async modalExtrato() {
    const modal = await this.modalController.create({
      component: ExtratoChatbotComponent,
      componentProps: {
        Saldo: this.whatsappCobranca.saldo
      },
    })
    modal.onDidDismiss().then(retorno => { })

    return await modal.present()
  }

}

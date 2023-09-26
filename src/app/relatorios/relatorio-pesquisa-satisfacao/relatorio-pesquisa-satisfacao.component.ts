import { Component, HostListener, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DateUtils } from 'app/core/common/data-type-utils/date-utils';
import { LoadingService } from 'app/core/services/loading.service';
import { DetalhesAvaliacoesModalComponent } from '../modals/detalhes-avaliacoes-modal/detalhes-avaliacoes-modal.component';
import { AvaliacoesModel } from '../models/avaliacoes-model';
import { RelatorioService } from '../services/relatorio.service';

@Component({
  selector: 'app-relatorio-pesquisa-satisfacao',
  templateUrl: './relatorio-pesquisa-satisfacao.component.html',
  styleUrls: ['./relatorio-pesquisa-satisfacao.component.scss'],
})
export class RelatorioPesquisaSatisfacaoComponent implements OnInit {
  public startDate: Date = new Date();
  public endDate: Date = new Date();

  public segment:string;

  public avaliacoes: AvaliacoesModel;
  
  public innerHeight: any;
  public divContentHeight: any;
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.innerHeight = window.innerHeight;
    this.divContentHeight = innerHeight - 240
    this.divContentHeight = this.divContentHeight.toString() + 'px'
  }
  constructor(private RelatorioService: RelatorioService,
              private LoadingService: LoadingService,
              private ModalController: ModalController) { }

  ngOnInit() {
    this.getScreenSize()
    this.getAvaliacoes()
  }
  
  receiveDate(event: any) {
    if(event.startDate != this.startDate || event.endDate != this.endDate){
      this.startDate = event.startDate;
      this.endDate = event.endDate;

      this.getAvaliacoes()
    }
  }

  async getAvaliacoes() {
    await this.LoadingService.present()
    this.RelatorioService.getAvaliacoes(DateUtils.DateToString(this.startDate), DateUtils.DateToString(this.endDate))
      .subscribe(
        res => {
          this.LoadingService.dismiss()
          this.avaliacoes = res;
          if(this.avaliacoes.atendimentoRecepcao.nomeProfissional != null) {
            this.segment = 'empresa'
          }
        },
        fail => {
          this.segment = ''
          this.LoadingService.dismiss()
        }
      )
  }

  async onClickAvaliacao(ev: any) {
    const modal = await this.ModalController.create({
      component: DetalhesAvaliacoesModalComponent,
      componentProps : {
        detalhes: ev
      }
    })

    return await modal.present()
  }
}

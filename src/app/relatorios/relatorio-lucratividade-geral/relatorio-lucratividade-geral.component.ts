import { Component, HostListener, OnInit } from '@angular/core';
import { LucratividadeGeralModel } from '../models/lucratividade-geral-model';
import { LoadingService } from 'app/core/services/loading.service';
import { RelatorioService } from '../services/relatorio.service';
import { DateUtils } from 'app/core/common/data-type-utils/date-utils';

@Component({
  selector: 'app-relatorio-lucratividade-geral',
  templateUrl: './relatorio-lucratividade-geral.component.html',
  styleUrls: ['./relatorio-lucratividade-geral.component.scss'],
})
export class RelatorioLucratividadeGeralComponent implements OnInit {
  public startDate: Date = new Date();
  public endDate: Date = new Date();

  public lucratividadeGeral: LucratividadeGeralModel[];

  public innerWidth: any;
  public innerHeight: any;
  public divContentHeight: any;
  public cardHeight: any;
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.divContentHeight = innerHeight - 200
    this.divContentHeight = this.divContentHeight.toString() + 'px'
  }
  constructor(private LoadingService: LoadingService,
              private RelatorioService: RelatorioService) { }

  ngOnInit() {
    this.getScreenSize()
    this.getLucratividadeGeral()
  }

  receiveDate(event: any) {
    if(event.startDate != this.startDate || event.endDate != this.endDate){
      this.startDate = event.startDate;
      this.endDate = event.endDate;

      this.getLucratividadeGeral()
    }
  }

  async getLucratividadeGeral() {
    await this.LoadingService.present()

    this.RelatorioService.getLucratividadeGeral(DateUtils.DateToString(this.startDate), DateUtils.DateToString(this.endDate))
      .subscribe(
        res => {
          this.LoadingService.dismiss()

          this.lucratividadeGeral = res;
        },
        fail => {
          this.LoadingService.dismiss()
        }
      )
  }

}

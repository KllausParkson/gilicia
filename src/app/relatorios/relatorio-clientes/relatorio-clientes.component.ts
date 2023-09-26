import { Component, OnInit, HostListener } from '@angular/core';
import { LoadingService } from 'app/core/services/loading.service';
import { RelatorioService } from '../services/relatorio.service';
import { DateUtils } from 'app/core/common/data-type-utils/date-utils';
import { TopClientesModel } from '../models/topClientesModel';

@Component({
  selector: 'app-relatorio-clientes',
  templateUrl: './relatorio-clientes.component.html',
  styleUrls: ['./relatorio-clientes.component.scss'],
})
export class RelatorioClientesComponent implements OnInit {

  public startDate: Date = new Date();
  public endDate: Date = new Date();
  public clientesList: TopClientesModel;
  public relatorioClienteSegment: string = 'servico';

  // @HostListener('window:scroll', ['$event']) // for window scroll events
  public innerWidth: any;
  public innerHeight: any;
  public divContentHeight: any;
  public cardHeight: any;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.divContentHeight = innerHeight - 355;
    this.divContentHeight = this.divContentHeight.toString() + 'px';
    this.cardHeight = this.innerHeight - 100;
    this.cardHeight = this.cardHeight.toString() + 'px';
  }

  constructor(private loadingService: LoadingService,
    private relatorioService: RelatorioService) {
  }

  ngOnInit() {
    this.getScreenSize();
    this.onBuscar();
  }

  receiveDate(event: any) {
    if (event.startDate !== this.startDate || event.endDate !== this.endDate) {
      this.startDate = event.startDate;
      this.endDate = event.endDate;

      this.onBuscar();
    }
  }

  async onBuscar() {

    await this.loadingService.present();

    this.relatorioService.getTopClientes(DateUtils.DateToString(this.startDate), DateUtils.DateToString(this.endDate))
      .subscribe(
        res => {

          this.loadingService.dismiss();
          this.clientesList = res;
        },
        fail => {
          this.loadingService.dismiss();
        }
      );
  }

  segmentChanged(ev: any) {
    this.relatorioClienteSegment = ev.target.value;
    // this.indexAtualSegment = 0
    this.changeStyleSegment();
  }

  changeStyleSegment() {
    if (this.relatorioClienteSegment === 'servico') {
      document.getElementById('servico').style.color = 'var(--cor-texto-escuro)';
      document.getElementById('produto').style.color = 'var(--cor-texto-claro)';
      document.getElementById('servicoProduto').style.color = 'var(--cor-texto-claro)';
      // this.selectFirstTabGServ()
    } else if (this.relatorioClienteSegment === 'produto') {
      document.getElementById('servico').style.color = 'var(--cor-texto-claro)';
      document.getElementById('produto').style.color = 'var(--cor-texto-escuro)';
      document.getElementById('servicoProduto').style.color = 'var(--cor-texto-claro)';
      // this.selectFirstTabLinhaProduto()
    } else if (this.relatorioClienteSegment === 'servicoProduto') {
      document.getElementById('servico').style.color = 'var(--cor-texto-claro)';
      document.getElementById('produto').style.color = 'var(--cor-texto-claro)';
      document.getElementById('servicoProduto').style.color = 'var(--cor-texto-escuro)';
      // this.selectFirstTabLinhaProduto()
    }
  }
}

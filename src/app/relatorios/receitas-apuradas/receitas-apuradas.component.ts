import { Component, OnInit } from '@angular/core';
import { DateUtils } from 'app/core/common/data-type-utils/date-utils';
import { LoadingService } from 'app/core/services/loading.service';
import { ReceitasApuradasModel } from '../models/receitas-apuradas-model';
import { RelatorioService } from '../services/relatorio.service';

@Component({
  selector: 'app-receitas-apuradas',
  templateUrl: './receitas-apuradas.component.html',
  styleUrls: ['./receitas-apuradas.component.scss'],
})
export class ReceitasApuradasComponent implements OnInit {

  public startDate: Date = new Date();
  public endDate: Date = new Date();

  public receitas: ReceitasApuradasModel;
  constructor(private RelatorioService: RelatorioService,
    private LoadingService: LoadingService) { }

  ngOnInit() {
    this.onBuscar()
  }

  receiveDate(event: any) {
    if (event.startDate != this.startDate || event.endDate != this.endDate) {
      this.startDate = event.startDate;
      this.endDate = event.endDate;

      this.onBuscar()
    }
  }

  async onBuscar() {
    await this.LoadingService.present()

    this.RelatorioService.getReceitasApuradas(DateUtils.DateToString(this.startDate), DateUtils.DateToString(this.endDate))
      .subscribe(
        res => {
          this.LoadingService.dismiss()
          this.receitas = res;
        },
        fail => {
          this.LoadingService.dismiss()
        }
      )
  }

}

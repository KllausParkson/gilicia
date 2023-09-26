import { Component, OnInit } from '@angular/core';
import { DateUtils } from 'app/core/common/data-type-utils/date-utils';
import { RelatorioService } from '../services/relatorio.service';

@Component({
  selector: 'app-receitas-estimadas',
  templateUrl: './receitas-estimadas.component.html',
  styleUrls: ['./receitas-estimadas.component.scss'],
})
export class ReceitasEstimadasComponent implements OnInit {

  public startDate: Date = new Date();
  public endDate: Date = new Date();

  public totalReceitasEstimadas: any;

  constructor(private RelatorioService: RelatorioService) { }

  ngOnInit() {
    this.onClick()
  }

  receiveDate(event: any) {
    if(event.startDate != this.startDate || event.endDate != this.endDate){
      this.startDate = event.startDate;
      this.endDate = event.endDate;

      this.onClick()
    }
  }

  onClick() {
    this.RelatorioService.getReceitasEstimadas(DateUtils.DateToString(this.startDate), DateUtils.DateToString(this.endDate))
      .subscribe(
        res => {
          this.totalReceitasEstimadas = res;
        }
      )
  }

}

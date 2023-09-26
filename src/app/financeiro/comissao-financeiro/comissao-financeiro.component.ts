import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../core/services/loading.service';
import { ToastService } from 'app/core/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { FinanceiroService } from '../services/financeiro.service';
import { CurrencyGlobalPipe } from '../../core/pipes/currencyGlobal.pipe';
import { ComissaoProfissionalModel } from '../models/comissaoProfissionalModel';

@Component({
  selector: 'app-comissao-financeiro',
  templateUrl: './comissao-financeiro.component.html',
  styleUrls: ['./comissao-financeiro.component.scss'],
})
export class ComissaoFinanceiroComponent implements OnInit {

  public startDate: Date = new Date();
  public endDate: Date = new Date();

  public comissao: ComissaoProfissionalModel = new ComissaoProfissionalModel();

  public pendentesDetalhes = false;
  public liberadosDetalhes = false;
  public splitDetalhes = false;
  public preDatadosDetalhes = false;
  public debitoComoClienteDetalhes = false;
  public adiantamentosDetalhes = false;
  public outrosDetalhes = false;

  constructor(private financeiroService: FinanceiroService,
    private loadingService: LoadingService,
    private toast: ToastService,
    public translate: TranslateService,
    public currencyGlobal: CurrencyGlobalPipe) { }

  ngOnInit() {
    this.getValues();
  }

  getValues() {
    this.loadingService.present();

    this.financeiroService.getComissao(this.startDate.toISOString().split('T')[0], this.endDate.toISOString().split('T')[0])
      .subscribe(
        result => {
          this.loadingService.dismiss();
          this.comissao = result;
        },
        fail => {
          this.loadingService.dismiss();
          this.onError(fail);
        }
      );
  }

  receiveDate(event: any) {
    if (event.startDate != this.startDate || event.endDate != this.endDate) {
      this.startDate = event.startDate;
      this.endDate = event.endDate;
      this.getValues();
    }
  }

  getNomeSobrenome(nomeCompleto: string): string {
    let nome = nomeCompleto.split(' ');
    if (nome?.length > 2) {
      if (nome[1]?.length <= 3) {
        return nome[0] + ' ' + nome[1] + ' ' + nome[2];
      }
      return nome[0] + ' ' + nome[1];
    }
    return nomeCompleto;
  }

  // Tratar erros
  onError(fail: any) {
    if (fail.status === 403) {
      this.toast.presentToast(this.translate.instant('FINANCEIRO.PERMISSION'), 'danger');
    }
    else {
      this.toast.presentToast(this.translate.instant('FINANCEIRO.ERROR'), 'danger');
    }
  }
}

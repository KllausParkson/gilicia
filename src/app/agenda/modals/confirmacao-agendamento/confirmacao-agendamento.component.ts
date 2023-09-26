import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirmacao-agendamento',
  templateUrl: './confirmacao-agendamento.component.html',
  styleUrls: ['./confirmacao-agendamento.component.scss'],
})
export class ConfirmacaoAgendamentoComponent implements OnInit {

  constructor(private modalcontroller: ModalController,
              public translate: TranslateService) { }

  ngOnInit() {}

  close(){
    this.modalcontroller.dismiss();
  }

  returnLolcaleSymbol() {
    // return getLocaleCurrencySymbol(this.translate.getDefaultLang())
  }
}

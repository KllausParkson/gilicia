import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import { AgendaService } from '../../services/agenda.service';
import { ToastService } from 'app/core/services/toast.service';
@Component({
  selector: 'app-confirmacao-agendamento',
  templateUrl: './mensagem-inadimplencia.component.html',
  styleUrls: ['./mensagem-inadimplencia.component.scss'],
})
export class InadimplenciaComponent implements OnInit {

  constructor(private modalcontroller: ModalController,
              private agendaService: AgendaService,
              public translate: TranslateService,
              private toastService: ToastService,) { 
                
              }
  public lengthTextArea: number
  public mensagem :any             

  ngOnInit() {
  }

  close(){
    this.modalcontroller.dismiss();
  }

 
}

import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import { detalhesClienteModel } from '../../models/detalhesClienteModel';
import { AgendaService } from '../../services/agenda.service';
import { ToastService } from 'app/core/services/toast.service';
import { FormGroup, FormBuilder, FormControl, Validators, ValidatorFn } from '@angular/forms';
@Component({
  selector: 'app-confirmacao-agendamento',
  templateUrl: './dias-retorno-detalhes-cliente.component.html',
  styleUrls: ['./dias-retorno-detalhes-cliente.component.scss'],
})
export class DiasRetornoDetalhesClienteComponent implements OnInit {

private detalhesCli: any;
public createClienteDetailForm: FormGroup;
public dadosAgendamento: any;

  constructor(private modalcontroller: ModalController,
              private agendaService: AgendaService,
              private formBuilder: FormBuilder,
              public translate: TranslateService,
              private toastService: ToastService,) { 
                
              }
  public lengthTextArea: number             

  ngOnInit() {
    this.createClienteDetailForm = this.formBuilder.group({
      cliente: new FormControl (this.detalhesCli == null ? '' : this.detalhesCli.detalhesCli),
      retorno: new FormControl (this.detalhesCli == null ? null : this.detalhesCli.diasRetorno)
    })
    if(this.detalhesCli == null){
      this.lengthTextArea = 0;
    }
    else{
      let valueTextArea = this.detalhesCli.detalhesCli //this.editarCliente.clientesCliForColsLightModel.detalhesCliente;
      if(valueTextArea == null){
        this.lengthTextArea = 0
      }
      else{
        this.lengthTextArea = valueTextArea.length;
      }
    }

  }

  close(){
    this.modalcontroller.dismiss();
  }

  async setAtualLength(event: any){
    let valueTextArea = event;
    this.lengthTextArea = valueTextArea.length;
  }

  salvar(){
    let novoDetalhe: detalhesClienteModel = new detalhesClienteModel();
    let retornoNumb :number = +this.createClienteDetailForm.controls['retorno'].value
    novoDetalhe.clientesId = this.dadosAgendamento.clienteId
    novoDetalhe.diasRetorno = this.detalhesCli.diasRetorno == 0 ? retornoNumb : this.detalhesCli.diasRetorno == retornoNumb ? this.detalhesCli.diasRetorno : retornoNumb;
    novoDetalhe.detalhesCli = this.detalhesCli.detalhesCli == null ? this.createClienteDetailForm.controls['cliente'].value : this.detalhesCli.detalhesCli == this.createClienteDetailForm.controls['cliente'].value ? this.detalhesCli.detalhesCli : this.createClienteDetailForm.controls['cliente'].value;
    this.agendaService.updateInfoCliente(novoDetalhe).subscribe(
      result =>{
        this.toastService.presentToast("Sucesso!");
        this.close();

      },
      fail=>{

      }
    )

    
  }

  setKeyboardNumeric(event) {
    var elem = event
    event.target.setAttribute("type", "tel")
  }

}

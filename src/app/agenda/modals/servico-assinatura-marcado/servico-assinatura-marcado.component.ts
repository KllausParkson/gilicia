import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-outros-agendamentos-do-cliente',
  templateUrl: './servico-assinatura-marcado.component.html',
  styleUrls: ['./servico-assinatura-marcado.component.scss'],
})
export class ServicoAssinaturaMarcadoComponent implements OnInit {


  constructor(private modalcontroller: ModalController,
              public translate: TranslateService) { }
    public servNome:any
    public agendaService: any
    public agendamentoId: any
    public proximoAg:any
    
    ngOnInit(){
      this.proximoAg
        let lang = localStorage.getItem('one.lang') != "" && localStorage.getItem('one.lang') != undefined
        && localStorage.getItem('one.lang') != null && localStorage.getItem('one.lang') != "null"
        ? localStorage.getItem('one.lang')
        : JSON.parse(localStorage.getItem('one.user')).authenticatedBranch.linguaPais;
        this.agendaService.getProximosAgendamentos().subscribe(
            result => {
                let a = result.filter(e=> e.agendasId == this.agendamentoId)
                this.proximoAg = new Date(a[0].dataAg).toLocaleDateString(lang).split("T")[0]
            },
            fail => {
            }
          );
    }

    cancelar(){
        this.modalcontroller.dismiss(1);//apenas apra diferenciar qual botão o usuario clicou
      }
    

    remarcar(){
      this.agendaService.deleteAppointment(this.agendamentoId).subscribe(
        result=>{
          this.modalcontroller.dismiss();
        },
        fail =>{

        }
      )
    }

    
}
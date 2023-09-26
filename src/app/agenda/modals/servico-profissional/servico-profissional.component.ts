import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NovoAgendamentoComponent } from '../novo-agendamento/novo-agendamento.component';
import { AgendaService } from '../../services/agenda.service';
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: 'app-servico-profissional',
  templateUrl: './servico-profissional.component.html',
  styleUrls: ['./servico-profissional.component.scss'],
})
export class ServicoProfissionalComponent implements OnInit {


  constructor(private modalcontroller: ModalController,
    public translate: TranslateService,
    private agendaService: AgendaService) { }
    public profissional:any
    public listModais: any = []
    public i = 0
    public parametrosLight:any
    public contoller:number // variavel para eu saber qual botão foi clicado
    public semFoto = 'https://oneproducao.blob.core.windows.net/one2/Imagens/Sem_FotoPerfil.png';
    
    ngOnInit(){
    }

    modalClose(){
      this.modalcontroller.dismiss()
    }
    close(retorno:any){
        for(let j = 0; j<this.agendaService.listModais.length ;j++){
            this.agendaService.listModais[j].dismiss(retorno)
        }
      }

    async selectServ(){
    this.contoller=1;
    const modal = await this.modalcontroller.create({
       component: NovoAgendamentoComponent,
       id:'novoAgendamentoId',
       componentProps: {
         parametrosLight: this.parametrosLight, 
         controllerServProd:this.contoller
       },
     })
     modal.onDidDismiss().then(async retorno => {
        this.close(retorno)
     })
     this.agendaService.storyModal(modal)
     return await modal.present()
    }

    
    async selectProf(){
        this.contoller=0;
        const modal = await this.modalcontroller.create({
           component: NovoAgendamentoComponent,
           id:'novoAgendamentoId',
           componentProps: {
             parametrosLight: this.parametrosLight, 
             controllerServProd:this.contoller
           },
         })
         modal.onDidDismiss().then(async retorno => {
            this.close(retorno)
         })
         return await modal.present()

    }


    
}

import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-outros-agendamentos-do-cliente',
  templateUrl: './curriculo-modal.component.html',
  styleUrls: ['./curriculo-modal.component.scss'],
})
export class CurriculoComponent implements OnInit {


  constructor(private modalcontroller: ModalController) { }
    public profissional:any
    public semFoto = 'https://oneproducao.blob.core.windows.net/one2/Imagens/Sem_FotoPerfil.png';
    
    ngOnInit(){
        console.log(this.profissional)
    }

    close(){
        this.modalcontroller.dismiss();
      }

    
}
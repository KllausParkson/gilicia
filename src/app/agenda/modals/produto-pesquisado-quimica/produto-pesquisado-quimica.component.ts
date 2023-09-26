import { Component, OnInit } from '@angular/core';
import { RegistroQuimicaModel } from '../../models/registroQuimicaModel'
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-produto-pesquisado-quimica',
  templateUrl: './produto-pesquisado-quimica.component.html',
  styleUrls: ['./produto-pesquisado-quimica.component.scss'],
})
export class ProdutoPesquisadoQuimicaComponent implements OnInit {

  public dadosProdutoPesquisado: any;
  public servicoSelecionadoId: number;
  public setupQuimica: RegistroQuimicaModel = new RegistroQuimicaModel();

  constructor(private modalController: ModalController,) { }

  ngOnInit() {

    this.setupQuimica.partes = ''
    this.setupQuimica.observacao = ''
    this.setupQuimica.produtoDescricao = this.dadosProdutoPesquisado.product.descricaoProduto
    this.setupQuimica.produtoId = this.dadosProdutoPesquisado.product.produtoId
    this.setupQuimica.registroQuimicaId = 0
    this.setupQuimica.registroServicoId = this.servicoSelecionadoId
  }

  adicionarQuimica() {
    this.modalController.dismiss({ quimica: this.setupQuimica })
  }

  closeModal() {
    this.modalController.dismiss()
  }

}

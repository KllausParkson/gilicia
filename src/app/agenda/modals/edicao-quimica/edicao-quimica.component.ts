import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EditarRegistroServicoModel } from '../../models/editarRegistroServicoModel'
import { LoadingService } from '../../../core/services/loading.service';
import { AgendaService } from '../../services/agenda.service'

@Component({
  selector: 'app-edicao-quimica',
  templateUrl: './edicao-quimica.component.html',
  styleUrls: ['./edicao-quimica.component.scss'],
})
export class EdicaoQuimicaComponent implements OnInit {

  public quimicaSelecionadaEdicao: any;

  public parteEdicao: any;
  public observacaoEdicao: any;
  public preLancamento: number;
  public servicoEdicao: any;

  constructor(private ModalController: ModalController,
    private loadingService: LoadingService,
    private agendaService: AgendaService,) { }

  ngOnInit() {
    this.parteEdicao = JSON.parse(JSON.stringify(this.quimicaSelecionadaEdicao.partes))
    this.observacaoEdicao = JSON.parse(JSON.stringify(this.quimicaSelecionadaEdicao.observacao))
  }


  editarQuimica() {//como quimicaSelecionadaEdicao é uma referencia ao objeto contido no vetor controlServicos do component resumo-agendamento-profissional ao mudarmos a quimicaSelecionada edição nesse modal, ela também terá seu valor alterado no componente principal
    if (this.parteEdicao != this.quimicaSelecionadaEdicao.partes || this.observacaoEdicao != this.quimicaSelecionadaEdicao.observacao) {
      this.quimicaSelecionadaEdicao.partes = this.parteEdicao
      this.quimicaSelecionadaEdicao.observacao = this.observacaoEdicao
      if (this.preLancamento == 1) {
        this.ModalController.dismiss()
      }
      else {
        this.editarRegistroServicoAPI()
        this.ModalController.dismiss()
      }
    }
  }

  closeModal() {
    this.ModalController.dismiss()
  }


  editarRegistroServicoAPI() {
    this.servicoEdicao.quimicas = this.servicoEdicao.quimicas.filter(x => x.registroQuimicaId != this.quimicaSelecionadaEdicao.registroQuimicaId)
    this.servicoEdicao.quimicas.push(this.quimicaSelecionadaEdicao)
    let servico: EditarRegistroServicoModel = new EditarRegistroServicoModel()
    servico.observacao = this.servicoEdicao.observacao
    servico.preco = this.servicoEdicao.preco
    servico.quantidade = this.servicoEdicao.quantidade
    servico.registroServicoId = this.servicoEdicao.registroServicoId
    servico.colaboradorAuxiliarID = this.servicoEdicao.colaboradorAuxiliarID
    servico.quimicas = this.servicoEdicao.quimicas

    this.updateRegistroServico(servico)
  }

  async updateRegistroServico(servico) {
    await this.loadingService.present()
    this.agendaService.updateRegistroServico(servico).subscribe(
      result => {
        this.loadingService.dismiss()
      },
      fail => {
        this.loadingService.dismiss()

      }
    )
  }





}

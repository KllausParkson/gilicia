import { Component, OnInit } from '@angular/core';
import { RegistrarServicoModel } from '../../models/registrarServicoModel'
import { AlertController, ModalController } from '@ionic/angular';
import { AgendaService } from '../../services/agenda.service'
import { LoadingService } from '../../../core/services/loading.service';
import { RegistrarProdutoModel } from '../../models/registrarProdutoModel'
import { ToastService } from 'app/core/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-servico-pesquisado-modal',
  templateUrl: './servico-pesquisado-modal.component.html',
  styleUrls: ['./servico-pesquisado-modal.component.scss'],
})
export class ServicoPesquisadoModalComponent implements OnInit {

  public dadosServicoPesquisado: any;
  public dadosProdutoPesquisado: any;
  public dadosAgendamento: any;
  public setupService = new RegistrarServicoModel();
  public setupProduct = new RegistrarProdutoModel();
  public clienteId: any;
  public quantidadeServico: number;
  public quantidadeProduto: number;
  public listServicosRegistrados: any;

  public indiceI: any;//referenciado pelo resumo-agendamento
  public indiceJ: any;


  public controlServicos: Array<any>;//
  public pesquisaColaboradorLoader: boolean;//Referenciados em resumo-agendamento para as duas ultimas funções desse modal aqui
  public listColaboradoresAgendaveis: any;//
  public servicosSelecionados = []



  public launchButtonWaitingAPI: boolean = false; //faz o controle do bloqueio do botão para que não seja possível acionar o mesmo no intervalo de espera do retorno da API de lançar serviço/produto 

  constructor(private modalController: ModalController,
    private agendaService: AgendaService,
    private toast: ToastService,
    public translate: TranslateService,
    public alertController: AlertController,
    private loadingService: LoadingService,) { }

  ngOnInit() {
    if (this.dadosServicoPesquisado != undefined) { //checa se há o campo servicoId, caso haja isso indica que foi selecionado um serviço
      this.setupService.clienteId = this.clienteId
      this.setupService.observacao = ''
      this.setupService.colaboradorAuxiliarID = this.dadosServicoPesquisado.service.colaboradorAuxiliarID
      this.setupService.preco = this.dadosServicoPesquisado.service.precoServico
      this.setupService.quantidade = 1
      this.setupService.servicoId = this.dadosServicoPesquisado.service.servicoId
    }
    else if (this.dadosProdutoPesquisado != undefined) {
      this.setupProduct.clienteId = this.clienteId
      this.setupProduct.observacao = ''
      this.setupProduct.preco = this.dadosProdutoPesquisado.product.precoVenda
      this.setupProduct.produtoId = this.dadosProdutoPesquisado.product.produtoId
      this.setupProduct.quantidade = 1
    }



  }

  onChange(event: any) {

  }

  closeModal() {
    this.modalController.dismiss()
  }

  async lancarServicoAPI() {
    this.launchButtonWaitingAPI = true
    await this.loadingService.present();

    if (this.dadosServicoPesquisado != undefined) {
      //this.setupService.preco = this.setupService.quantidade * this.dadosServicoPesquisado.service.precoServico
      this.setupService.preco = this.dadosServicoPesquisado.service.precoServico
      this.agendaService.registrarServico(this.setupService).subscribe(
        result => {
          this.toast.presentToast(this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.TOAST.SUCESSO'));
          this.modalController.dismiss()
          this.loadingService.dismiss();

        },
        fail => {
          if (fail.error == 'API.OREGISTROSERVICOS.REGISTRARSERVICO.COMANDAFECHADA.ERROR') {
            this.toast.presentToast(this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.TOAST.COMANDAFECHADA'), 'danger')
          }
          this.launchButtonWaitingAPI = false
        }
      )
    }
    else if (this.dadosProdutoPesquisado != undefined) {
      //this.setupProduct.preco = this.setupProduct.quantidade * this.dadosProdutoPesquisado.product.precoVenda
      this.setupProduct.preco = this.dadosProdutoPesquisado.product.precoVenda
      this.agendaService.registrarProduto(this.setupProduct).subscribe(
        result => {
          this.toast.presentToast(this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.TOAST.SUCESSO'));
          this.modalController.dismiss()
          this.loadingService.dismiss();
        },
        fail => {
        }
      )
    }

  }



  public valueNormalizer = (text: Observable<string>) => text.pipe(map((text: string) => {
    return {
      value: null,
      text: ""
    };
  }));
  async verificaServicoDuplicado() {
    let jaExisteServico: boolean = false;
    if (this.listServicosRegistrados?.length > 0) { // se um serviço ja foi lançado anteriormente
      for (var k = 0; k < this.listServicosRegistrados?.length; k++) {
        if (this.listServicosRegistrados[k].servicoId == this.dadosServicoPesquisado.service.servicoId) { //verifica se é o mesmo serviço
          jaExisteServico = true;
        }
      }
      if (this.dadosServicoPesquisado.quantidade > 1) { //caso não tenha um serviço anteriormente lançado, verifica se dois ou mais serviços do mesmo serviço estao sendo lançados ao mesmo tempo
        jaExisteServico = true;
      }
    }

    if (jaExisteServico == true) { // se tem serviço repetido
      const alert = await this.alertController.create({
        //header: this.translate.instant('AGENDA.MODALNOVOBLOQUEIO.TITLE'),
        message: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.ALERTJAEXISTENTE.MENSAGEM'),
        cssClass: 'buttonCss',
        buttons: [
          {
            text: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.ALERTJAEXISTENTE.CANCELAR'),
            role: 'cancel',
            cssClass: 'cancelButton',
            handler: (blah) => {
            }
          }, {
            text: this.translate.instant('AGENDA.MODALS.RESUMOAGENDAMENTO.LANCARSERVICOPRODUTO.ALERTJAEXISTENTE.CONFIRMAR'),
            handler: () => {
              this.lancarServicoAPI()
            }
          }
        ],
        backdropDismiss: false,
      });
      await alert.present();
    }

    else { //se não tem nenhum serviço repetido
      this.lancarServicoAPI()
    }

  }

  pesquisaColaboradores(searchTerm: string) {
    this.pesquisaColaboradorLoader = true;
    if (searchTerm?.length > 2) {
      this.agendaService.getColaboradoresAgendaveisPesquisados(searchTerm)
        .subscribe(
          result => {
            this.pesquisaColaboradorLoader = false;
            this.listColaboradoresAgendaveis = result;
          },
          fail => {
            this.pesquisaColaboradorLoader = false;
            //this.onError(fail); 
          }
        );
    }
  }

  changeColaborador(event: any) {

    this.dadosServicoPesquisado.service.colaboradorAuxiliarID = event.profissionalId
    this.dadosServicoPesquisado.service.colaboradorAuxiliarNome = event.nomeProfissional
    this.setupService.colaboradorAuxiliarID = event.profissionalId
  }

  setKeyboardNumeric(event) {
    var elem = event
    event.target.setAttribute("type", "tel")
  }


}

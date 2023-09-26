
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-historico-observacao-cliente',
  templateUrl: './historico-observacao-cliente.component.html',
  styleUrls: ['./historico-observacao-cliente.component.scss'],
})
export class HistoricoObservacaoClienteComponent implements OnInit {

  @Input() data: string
  @Input() horario: string
  @Input() nomeProf: string
  @Input() nomeServ: string
  @Input() observacao: string
  esconderScroll: boolean = false;

  /* //variáveis utilizadas para fazer o controle quando existir o botão com a setinha para clicar para baixo para expandir detalhes
  public mostrarDetalhesProdutos: boolean = true;
  public mostrarDetalhesServicos: boolean = true;
  */
    constructor(
        private datePipe: DatePipe
    ) { }

  ngOnInit() { }

  //diretiva (função) para ser chamada e esconder o scroll da página do histórico-cliente
  @HostListener('window:scroll', ['$event']) getScrollHeight(event) {
    if(window.pageYOffset> 0 )
     this.esconderScroll = true;
    else
      this.esconderScroll = false;
  }

  
  getSubTotal(itens: any[]) {
    //Caso base, se o array estiver vazio retorna o valor zero
    if(itens?.length == 0) return 0

    //Caso nao caia no caso base, retorna a soma dos valores do servico ou produto
    return itens.reduce((acc, curr) => {
      
      return acc + (curr.hasOwnProperty('valorServico') ? curr.valorServico : curr.valorProduto)
    }, 0)
  }

  //retorna primeiro e segundo nome
  splitNome(nome: string): string {
    let split =  nome.split(' ')

    return `${split[0]} ${split[1]}`
  }

  //funções para utilizar quando existir o botão com a setinha para clicar para baixo para expandir detalhes
/*
  onClickDetalhesProdutos() {
    this.mostrarDetalhesProdutos = !this.mostrarDetalhesProdutos
  }

  onClickDetalhesServicos() {
    this.mostrarDetalhesServicos = !this.mostrarDetalhesServicos
  }

*/
}

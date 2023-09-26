
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-card-historico-cliente',
  templateUrl: './card-historico-cliente.component.html',
  styleUrls: ['./card-historico-cliente.component.scss'],
})
export class CardHistoricoClienteComponent implements OnInit {

  @Input() data: any
  @Input() produtos: any[]
  @Input() servicos: any[]
  @Input() valorTotal: number
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

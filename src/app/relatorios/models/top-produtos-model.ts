export class TopProdutosModel {
    valorTotal: number;
    produtos: Array<Produtos>;
}

class Produtos {
    nomeProduto: string;
    porcentagem: number;
    produtoId: number;
    valor: number;
}

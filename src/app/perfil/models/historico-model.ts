export class HistoricoModel {
    data: string
    fichaclisId: number
    valorTotal: number
    servicos: Servico[]
    produtos: Produto[]
}

class Servico {
    nomeServico: string
    servicoId: number
    valorServico: number
    nomeColaborador: string
    colaboradorId: number
    quantidadeServico: number
}

class Produto {
    nomeProduto: string
    produtoId: number
    valorProduto: number
    nomeColaborador: string
    colaboradorId: number
    quantidadeProduto: number
}

export class FaturamentoProfissionalModel {
    totalFaturamentoGeral: number;
    totalFaturamentoProdutos: number;
    totalFaturamentoServicos: number;
    ticketMedio: number;
    servicos: ServicoFaturamentoModel[];
    produtos: ProdutoFaturamentoModel[];
    totalAtendimentos: number;
    clientes: ClientesAtendidosModel[];
}

export class ServicoFaturamentoModel {
    servicoId: number;
    nomeServico: string;
    quantidadeVendida: number;
    precoFaturadoTotal: number;
}

export class ProdutoFaturamentoModel {
    produtoId: number;
    nomeProduto: string;
    quantidadeVendida: number;
    precoFaturadoTotal: number;
}

export class ClientesAtendidosModel {
    clienteId: number;
    nomeCliente: string;
    quantidadeAtendimentos: number;
}
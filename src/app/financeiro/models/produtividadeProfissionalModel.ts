export class ProdutividadeProfissionalModel {
    datas: DataProdutividadeModel[];
    totalFaturadoServico: number;
    totalFaturadoProduto: number;
    totalFaturadoGeral: number;
}

export class DataProdutividadeModel {
    fichas: FichasProdutividadeModel[];
    data: string;
}

export class FichasProdutividadeModel {
    dataFicha: string;
    fichaclisId: number;
    numeroFicha: number;
    valorTotal : number;
    nomeCliente: string;
    clienteId: number;
    servicos: ServicoProdutividadeModel[];
    produtos: ProdutoProdutividadeModel[];
}

export class ServicoProdutividadeModel {
    servicoId: number;
    nomeServico: string;
    valorServico: number;
}

export class ProdutoProdutividadeModel {
    produtoId: number;
    nomeProduto: string;
    valorProduto: number;
}
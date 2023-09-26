export class ComissaoProfissionalModel {
    pendentes: ListaMovsPendLibPreDatModel[];
    liberados: ListaMovsPendLibPreDatModel[];
    preDatados: ListaMovsPendLibPreDatModel[];
    outros: ListaOutrosEAdiantamentosModel[];
    adiantamentos: ListaOutrosEAdiantamentosModel[];
    debitoComoCliente: DebitoClienteModel[];
    apuracaoFinal: ApuracaoFinalModel;
    splitDigital: ListSplitDigitalModel[];
}

export class ListaMovsPendLibPreDatModel {
    numeroFicha: string;
    data: string | null;
    nomeCliente: string;
    clienteId: number;
    comissao: number;
    dataDocumento: string | null;
    dataVencimento: string;
    dataPagamentoRecebimento: string | null;
    servico: string;
    pagoVia: string;
    preco:number;
}

export class ListaOutrosEAdiantamentosModel {
    data: string | null;
    valorOriginal: number;
    valorPago: number;
    valorRestante: number;
    dataVencimento: string | null;
    dataPagamento: string | null;
    descricao : string;
}

export class DebitoClienteModel {
    data: string | null;
    valorOriginal: number;
    valorPago: number;
    valorRestante: number;
    fichaclisId: number | null;
    numeroDocumento: string;
    dataPagamento: string;
    dataVencimento: string;
}

export class ApuracaoFinalModel {
    saldoComissaoLiberada: number;
    outrasReceitas: number;
    repasse: number;
    debitoComoCliente: number;
    saldoAReceber: number;
    rateioDigital: number;
    pendente: number;
    preDatado: number;
}

export class ListSplitDigitalModel {
    numeroFicha: number;
    data: string | null;
    nomeCliente: string;
    comissao: number;
    tipoCartao: string;
}
export class ServicoFidelidadeModel {
    possuiFidelidade: boolean;
    servicos: Array<ListaServicosFidelidadeModel>
}

class ListaServicosFidelidadeModel{
    servicoId: number;
    nomeServico: string;
    quantidadeParaGanhar: number;
    quantidadeAtual: number;
    diasParaVencer: number;
}

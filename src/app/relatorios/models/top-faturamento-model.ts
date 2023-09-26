export class TopFaturamentoModel {
    valorTotal: number;
    profissionais: Profissional[];
}

class Profissional {
    nomeProfissional: string;
    profissionalId: number;
    valor: number;
    porcentagem;
}

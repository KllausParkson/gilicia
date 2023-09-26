export class TopServicosModel {
    valorTotal: 0;
    servicos: Servicos[];
}

class Servicos {
    nomeServico: string;
    servicoId: number;
    valor: number;
    porcentagem: number;
}

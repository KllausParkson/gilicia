export class GetRegistroServicoModel {
    servicoId: number;
    registroServicoId: number;
    servicoDescricao: string;
    preco: number;
    quantidade: number;
    observacao: string;
    quimicas: Array<Quimica>;
}


export class Quimica {
    registroServicoId: number;
    produtoId: number;
    partes: string;
    observacao: string;
}


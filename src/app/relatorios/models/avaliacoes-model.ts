export class AvalicaoProfissionalModel {
    numAvaliacoes: number;
    melhorNota: number;
    media: number;
    comentarios: DadosComentarios[];
}

export class DadosComentarios {
    nota: number;
    texto: string;
    data: string;
    clienteNome: string;
    clienteId: number;
}

export class AvalicoesProfissionalModel {
    numAvaliacoes: number;
    melhorNota: number;
    media: number;
    comentarios: DadosComentarios[];
    profisisonalId: number;
    nomeProfissional: string;
}

export class AvaliacoesModel {
    atendimentoRecepcao: AvalicoesProfissionalModel;
    estruturaEstabelecimento: AvalicoesProfissionalModel;
    avaliacaoGeral: AvalicoesProfissionalModel;
    avaliacoesProfissionais: AvalicoesProfissionalModel[];
}

export class RegistrarServicoModel {
    clienteId: number;
    servicoId: number;
    preco: number;
    quantidade: number;
    observacao: string;
    colaboradorAuxiliarID: number | null;
    colaboradorAuxiliarNome: string | null;
    quimicas: any | null;
    servicoAuxiliarID: number | null;
    nomeServico: string;
    naoPergAuxiliar: boolean;
}
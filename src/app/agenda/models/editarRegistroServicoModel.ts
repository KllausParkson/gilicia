export class EditarRegistroServicoModel {
    registroServicoId: number;
    preco: number;
    quantidade: number;
    observacao: string;
    colaboradorAuxiliarID: number;
    quimicas: Array<any> | null;
}
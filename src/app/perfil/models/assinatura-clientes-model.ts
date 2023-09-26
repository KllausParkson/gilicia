import { AssinaturaPlanosModel } from "./assinatura-planos-model";

export class AssinaturaClientesModel {
    assinaturaClientesId: number;
    cliForColsId: number;
    assinaturaPlanosId: number;
    assinaturaPlanos: AssinaturaPlanosModel
    empresaId: number;
    filialId: number;
    servicosPlano: Array<string>;
}
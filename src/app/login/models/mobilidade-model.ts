export class MobilidadeModel {
    empresasID: number;
    filiaisID: number;
    logoMarca: string;
    nomeEmpresa: string;
    nomeEmpresaFilial: string;
    cidade: string;
    estado: string;
    tipoNegocio: number;
    distancia: number;
}

export class MobilidadeCompleta  extends MobilidadeModel {
    endereco: string;
    numero: string;
    bairro: string;
    distancia: number;
}
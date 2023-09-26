export class TopClientesModel {
  produtos: Array<Geral>;
  servicos: Array<Geral>;
  geral: Array<Geral>;
}


export class Geral{
  clienteId: number;
  nomeCliente: string;
  valor: number;
}
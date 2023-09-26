export class WhatsappCobrancaModel{
    informacoesWhatsapp: Array<WhatsappInformacoes>;
    saldo: number;
}

class WhatsappInformacoes {
    whatsappMovimentacoesId: number;
    mobilidadesId: number;
    dataMovimentacao: string;
    tipoMovimentacao: string;
    custoCliente: number;
    taxaConversao: number;
    custoMensagensTrocadas: number;
    valorInteracaoUsuario: number;
    valorInteracaoBot: number;
    quantidadeInteracaoUsuario: number;
    quantidadeInteracaoBot: number;
    mensagensTrocadas: number;
    confirmacoesEnviadas: number;
    quantidadeAgendamentos: number;
    quantidadeConfirmacoes: number;
    custoTwilioDolar: number;
}
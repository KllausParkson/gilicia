export class ProximosAgendamentosModel {
    agendasId: number;
    dataAg: any;
    status: string;
    colaboradorId: number;
    nomeColaborador: string;
    fotoColaborador: string;
    servicoId: number;
    descricaoServico: string;
    horarioInicio: HorarioInicioModel;
    horarioFim: HorarioFimModel;
}


export class HorariosDisponiveisModel{
    horarioInicio: HorarioInicioModel
    horarioFinal: HorarioFimModel
}


export class HorarioInicioModel {
    ticks: number;
    days: number;
    hours: number;
    milliseconds: number;
    minutes: number;
    seconds: number;
    totalDays: number;
    totalHours: number;
    totalMilliseconds: number;
    totalMinutes: number;
    totalSeconds: number;
}

export class HorarioFimModel {
    ticks: number;
    days: number;
    hours: number;
    milliseconds: number;
    minutes: number;
    seconds: number;
    totalDays: number;
    totalHours: number;
    totalMilliseconds: number;
    totalMinutes: number;
    totalSeconds: number;
}

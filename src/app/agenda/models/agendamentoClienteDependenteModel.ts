import { HorarioFimModel } from './proximosAgendamentosModel'
import { HorarioInicioModel } from './proximosAgendamentosModel'

export class AgendamentoClienteDependenteModel {
    agendasId: number;
    dataAg: Date;
    servicoId: number;
    clienteDependenteId: number
    profissionalId: number;
    horarioInicio: HorarioInicioModel;
    horarioFim: HorarioFimModel;

}

import { HorarioFimModel } from './proximosAgendamentosModel'
import { HorarioInicioModel } from './proximosAgendamentosModel'

export class AgendamentoModel {
    agendasId: number;
    dataAg: Date;
    servicoId: number;
    profissionalId: number;
    horarioInicio: HorarioInicioModel;
    horarioFim: HorarioFimModel;
  
}
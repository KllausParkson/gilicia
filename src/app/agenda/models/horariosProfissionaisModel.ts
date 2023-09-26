export class HorariosProfissionaisModel{
    horariosDisponiveis: Array<ListaHorariosModel>
    profissionalId: number
}

class ListaHorariosModel{
    horarioInicio: String
    horarioFinal: String
}
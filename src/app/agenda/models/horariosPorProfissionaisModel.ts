export class HorariosPorProfissionaisModel {
    servicoId: number
    disponibilidades: Array<Disponibilidade>
}
class Disponibilidade {
    profissionalId: number;
    profissionalNome: string;
    profissionalFoto: string;
    profissionalSimultaneidade: boolean
    profissaoId: number
    profissao: string
    instagram: string
    horarios: Array<Horarios>
    curriculo: string
}
class Horarios {
    disabled: boolean
    horarioInicio: String
    horarioFinal: String
}

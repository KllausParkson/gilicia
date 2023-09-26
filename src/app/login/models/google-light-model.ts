export class GoogleLightModel {
    googleId: string;
    email: string;
    appId?: number;
    lingua: string;
  }

export class GoogleModel{
    nomeCompleto: string;
    celular: string;
    dadosGoogle: GoogleLightModel;
    Aniversario?: Date;
}

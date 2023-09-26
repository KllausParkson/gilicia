export class AppleLightModel {
    appleId: string;
    email: string;
    appId?: number;
    lingua: string;
  }

export class AppleModel{
    nomeCompleto: string;
    celular: string;
    dadosApple: AppleLightModel;
    Aniversario?: Date;
}

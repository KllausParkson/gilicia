export class FacebookLightModel {
  facebookId: string;
  email: string;
  appId?: number;
  lingua: string;
}

export class FacebookModel {
  nomeCompleto: string;
  celular: string;
  dataNascimento?: Date;
  dadosFacebook: FacebookLightModel;
}

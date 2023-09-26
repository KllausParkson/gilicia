### Login via Apple

**Fonte:** https://ionicframework.com/blog/adding-sign-in-with-apple-to-an-ionic-app/.

**Plugin:** Capacitor Apple Login

1 - Obter um `Apple App ID` em https://developer.apple.com/account/resources/identifiers/list.

2 - Ativar `Sign In with Apple` na lista de Capacidades.

3 - Instalar o plugin `Capacitor Apple Login:`

```
npm i https://github.com/rlfrahm/capacitor-apple-login
```

4 - Adicionar o `Apple App ID` obtido no passo 1, no arquivo `capacitor.config.json` para a chave `appID:`

```
{
    "appId": "onebeleza.app",
    "appName": "appleApp",
    "bundledWebRuntime": false,
    "npmClient": "npm",
    "webDir": "www",
    "cordova": {}
}
```

5 - Para o processo de login, você só precisa chamar a função `Authorize()` no plug-in Capacitor, que irá então acionar
a caixa de diálogo nativa da Apple. Assim que obtivermos o resultado, podemos usar o token para realizar qualquer tipo
de outra operação ou autenticação em outro serviço.

```
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  showAppleSignIn = false;
  user = null;
  constructor(private alertController: AlertController) {}
  async ngOnInit() {
    const { Device } = Plugins;
    // Only show the Apple sign in button on iOS

    let device = await Device.getInfo();
    this.showAppleSignIn = device.platform === 'ios';
  }

  openAppleSignIn() {
    const { SignInWithApple } = Plugins;
    SignInWithApple.Authorize()
      .then(async (res) => {
        if (res.response && res.response.identityToken) {
          this.user = res.response;
        } else {
          this.presentAlert();
        }
      })
      .catch((response) => {
        this.presentAlert();
      });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Login Failed',
      message: 'Please try again later',
      buttons: ['OK'],
    });
    await alert.present();
  }
}
```

Estrutura da resposta da Apple:

```
{
  "response": {
    "email": "foo@bar.com",
    "identityToken": "importantToken",
    "familyName": "Grimm",
    "user": "AppleUserId",
    "givenName": "Simon",
    "authorizationCode": "authCode"
  }
}
```

ALERTAS:

1 - O usuário pode ocultar seu email. A Apple disponibilizará um email que fará o redirecionamento para a caixa de
entrada do usuário.

2 - Também é importante observar que você verá essa resposta completa apenas durante o primeiro login bem-sucedido.
Depois disso, os campos _familyName_, _givenName_ e _email_ serão nulos, portanto, tome cuidado se usar as informações
desse token para atualizar seus registros de usuário! 




#OPCAO 2

FONTE: https://www.npmjs.com/package/cordova-plugin-sign-in-with-apple

FONTE: https://github.com/twogate/cordova-plugin-sign-in-with-apple

```
npm install cordova-plugin-sign-in-with-apple
```
```
npm install @ionic-native/sign-in-with-apple
```
```
ionic cap sync
```

Adicionar o provider em app.module.ts 

[SignInWithApple]

import {SignInWithApple} from '@ionic-native/sign-in-with-apple/ngx';






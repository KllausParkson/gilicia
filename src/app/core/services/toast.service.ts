import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  constructor(public toast: ToastController, private alertController: AlertController, private translate: TranslateService) {

  }

  async presentToast(message: string, color = 'success', duration = 2500, header = '') {
    if (color != 'success')
      duration = 5000;

    await this.toast.getTop().then(f => f ? this.toast.dismiss() : null);
    const toast = await this.toast.create({
      header: header,
      message: message,
      duration: duration,
      color: color,
      cssClass: "toast-custom",
      buttons: [
        {
          text: 'X',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    const style = document.createElement('style')
    style.textContent = `
      .toast-wrapper {
        width-min: 35% !important;
        max-width: 400px !important;
        margin-right: 25px !important;
        bottom: auto !important;
        top: 30px !important;
      }`
    toast.shadowRoot.appendChild(style);
    toast.present();
  }
  async presentToastAction(listServiceFailed: any, color: any, header = '') {

    const toast = await this.toast.create({
      header: header,
      message: "Erro ao marcar alguns dos seus agendamentos",
      duration: 10000,
      color: color,
      cssClass: "toast-custom",
      buttons: [
        {
          text: 'Ver Mais',
          role: 'info',
          handler: async () => {

            var stringErro = ""
            listServiceFailed.forEach(element => {
              stringErro += `<b>Profissional</b>: ${element.nomeProfissional} <br>
              <b>Servico:</b> ${element.nomeServico} <br>
              <b>Data:</b> ${element.data}: ${element.horario} <br>
              <b>Erro:</b> ${element.messagemErro} <br><br>`
            });
            const alert = await this.alertController.create({
              header: "Agendamentos:",
              message: stringErro,
              buttons: [{
                text: this.translate.instant('OK'),
              }]
            });
            await alert.present();
          }
        },
      ]
    });

    const style = document.createElement('style')
    style.textContent = `
      .toast-wrapper {
        width-min: 35% !important;
        max-width: 400px !important;
        margin-right: 25px !important;
        bottom: auto !important;
        top: 30px !important;
      }`
    toast.shadowRoot.appendChild(style);
    await toast.present();
  }


}

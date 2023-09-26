
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Calendar } from '@ionic-native/calendar/ngx';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AvaliarColaboradorModalComponent } from 'app/shared/avaliar-colaborador-modal/avaliar-colaborador-modal.component';
import { environment } from '../../../environments/environment';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';



@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private name: string;
  constructor(private ModalController: ModalController,
    private Calendar: Calendar,
    private translate: TranslateService) { }

  initPush() {
    this.name = environment.name
    if (Capacitor.getPlatform() != 'web') {
      this.registerPush()
    }
  }

  //requer permissao do usuario para poder mostrar as notificacoes
  private async registerPush() {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();

    await PushNotifications.addListener('registration',
      token => {
        localStorage.setItem('one.push', JSON.stringify(token))
      }
    );

    await PushNotifications.addListener('registrationError', (error) => {
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      async notification => {

        if (notification.data.action != undefined) {

          let actions = JSON.parse(notification.data.actions)
          let ns = JSON.parse(localStorage.getItem('one.notifications'))
          let notificationArr = []
          if (ns !== null) {
            notificationArr = ns
            let data = notification.data
            notificationArr.push(data)
          } else {
            let data = notification.data
            notificationArr.push(data)
          }

          localStorage.setItem('one.notifications', JSON.stringify(notificationArr))
          LocalNotifications.registerActionTypes({
            types: [
              {
                id: 'InserirAgenda',
                actions: [
                  {
                    id: 'inserir',
                    title: this.translate.instant('SHARED.NOTIFICACAO.INSERIR'),
                  },
                  {
                    id: 'cancelar',
                    title: this.translate.instant('SHARED.NOTIFICACAO.CANCELAR'),
                    destructive: true
                  }
                ]
              },
              {
                id: 'DesmarcarAgenda',
                actions: [
                  {
                    id: 'remover',
                    title: this.translate.instant('SHARED.NOTIFICACAO.REMOVER'),
                  },
                  {
                    id: 'cancel',
                    title: this.translate.instant('SHARED.NOTIFICACAO.CANCELAR'),
                    destructive: true
                  }
                ]
              },
              {
                id: 'Avaliar',
                actions: [
                  {
                    id: 'avaliar',
                    title: this.translate.instant('SHARED.NOTIFICACAO.AVALIAR')
                  },
                  {
                    id: 'cancel',
                    title: this.translate.instant('SHARED.NOTIFICACAO.CANCELAR'),
                    destructive: true
                  }
                ]
              }
            ]
          })

          LocalNotifications.schedule({
            notifications: [{
              id: 0,
              title: notification.data.title,
              body: notification.data.message,
              smallIcon: 'ic_oneapp',
              iconColor: '#600BE8',
              extra: notification,
              actionTypeId: actions[0].title,
              attachments: [
                {
                  id: 'image',
                  url: '../../assets/icon/faviconOne.png'
                }
              ]
            }]
          })

          LocalNotifications.addListener(
            'localNotificationActionPerformed',
            async (notificationAction) => {
              if (notificationAction.actionId == 'inserir') {
                //this.router.navigateByUrl('/agenda');
                let actions = JSON.parse(notificationAction.notification.extra.data.actions)
                let item = actions[0]

                let horaInicio = this.returnDateWithHours(item.parameters.horarioInicio)
                let horaFim = this.returnDateWithHours(item.parameters.horarioFim)

                this.Calendar.createEventInteractively(`${item.parameters.servicos} - ${item.parameters.colaborador}`, item.parameters.salao, null, horaInicio, horaFim).then((res) => {

                });

              } else if (notificationAction.actionId == 'remover') {
                let actions = JSON.parse(notificationAction.notification.extra.data.actions)
                let item = actions[0]

                let horaInicio = this.returnDateWithHours(item.parameters.horarioInicio)
                let horaFim = this.returnDateWithHours(item.parameters.horarioFim)
                this.Calendar.deleteEvent(`${item.parameters.servicos} - ${item.parameters.colaborador}`, item.parameters.salao, null, horaInicio, horaFim).then(() => {

                })
              } else if (notificationAction.actionId == 'avaliar') {
                let actions = JSON.parse(notificationAction.notification.extra.data.actions)
                let item = actions[0]

                this.showAvaliarModal(item.parameters.servicos)
              }
            })

        }

        else {//caso não haja vetor actions 

          let ns = JSON.parse(localStorage.getItem('one.notifications'))
          let notificationArr = []
          if (ns !== null) {
            notificationArr = ns
            let data = notification.data
            notificationArr.push(data)
          } else {
            let data = notification.data
            notificationArr.push(data)
          }

          localStorage.setItem('one.notifications', JSON.stringify(notificationArr))


          LocalNotifications.schedule({
            notifications: [{
              id: 0,
              title: notification.data.title,
              body: notification.data.message,
              smallIcon: 'ic_oneapp',
              iconColor: '#600BE8',
              extra: notification,
              attachments: [
                {
                  id: 'image',
                  url: '../../assets/icon/faviconOne.png'
                }
              ]
            }]
          })


        }
      }
    );

  }

  private returnDateWithHours(hours: string): Date {
    let today = new Date();

    let horas = hours.split(':')

    let novaData = new Date(today.getFullYear(), today.getMonth(), today.getDate(), Number(horas[0]), Number(horas[1]), Number(horas[2]))

    return novaData;
  }

  async showAvaliarModal(servicos: any[]) {
    const modal = await this.ModalController.create({
      component: AvaliarColaboradorModalComponent,
      componentProps: {
        servicos: servicos
      }
    })

    return await modal.present();
  }
}
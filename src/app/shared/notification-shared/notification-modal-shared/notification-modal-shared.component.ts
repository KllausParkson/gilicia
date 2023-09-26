import { Component, OnInit, ViewChild } from '@angular/core';
import { Calendar } from '@ionic-native/calendar/ngx';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AvaliarColaboradorModalComponent } from '../../avaliar-colaborador-modal/avaliar-colaborador-modal.component';
import { ToastService } from 'app/core/services/toast.service';
import { AlertController } from '@ionic/angular';
import { SharedService } from '../../services/shared.service';
import { MobilidadesNotificationModel, NotificationCacheModel } from '../../models/notification-cache-model'

@Component({
  selector: 'app-notification-modal-shared',
  templateUrl: './notification-modal-shared.component.html',
  styleUrls: ['./notification-modal-shared.component.scss'],
})
export class NotificationModalSharedComponent implements OnInit {


  //public notifications: Array<NotificationsModel>;
  public notifications: any[]
  public user: any;
  public notificationsCache: any;
  public notificacoesNovas: any;
  public notificacoesAntigas: number;

  constructor(private modalController: ModalController,
    private Calendar: Calendar,
    private toast: ToastService,
    private translate: TranslateService,
    private alertLimparNotification: AlertController,
    private sharedService: SharedService) { }

  @ViewChild('notificationContent') private notificationContent: any;

  async ngOnInit() {

    this.notificacoesNovas = this.notificacoesNovas - this.notificacoesAntigas
    this.user = JSON.parse(localStorage.getItem('one.user'))


    this.notificationsCache = new NotificationCacheModel()
    this.notificationsCache.mobilidades = new MobilidadesNotificationModel()
    this.notificationsCache.mobilidades.empresasID = this.user.authenticatedBranch.empresaId
    this.notificationsCache.mobilidades.filiaisId = this.user.authenticatedBranch.filialId
    this.notificationsCache.cliForColsId = this.user.authenticatedUser.cliForColsId;


    await this.sharedService.getNotifications(this.user.authenticatedBranch.empresaId, this.user.authenticatedBranch.filialId, this.user.authenticatedUser.cliForColsId).subscribe(res => {
      this.notifications = res?.reverse();
    })

  }


  closeModal() {
    localStorage.setItem('one.notificationsCount', this.notifications?.length.toString())
    this.modalController.dismiss({ count: this.notifications?.length })
  }

  setBorderStatus(title: string, message: string) {
    if (title.indexOf('Marcação de horário') != -1) {
      return '10px solid #C2D69B';
    }
    else if (title.indexOf('Cancelamento de agendamento') != -1) {
      return '10px solid var(--ion-color-danger)';
    }
    else if (title.indexOf('Avaliação do Cliente') != -1) {
      return '10px solid var(--ion-color-warning)';
    }
    else if (message.indexOf('remarcado') != -1) {
      return '10px solid #C2D69B';
    }
    else {
      return '10px solid var(--ion-color-primary)';
    }
  }

  toDate(dateStr) {

    var parts = dateStr.split("/");
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }

  async clicavel(not: any, i: any) {
    //var auxNotification = not.action.replace();


    let notificationParse = not.actions.replace(/\'/g, '"')
    notificationParse = JSON.parse(notificationParse)

    if (not.mensagem.indexOf('desmarcado') != -1) {
      notificationParse[0].callback = 'DeleteAgenda'
    }

    if (notificationParse[0].callback == 'InsereAgenda') {
      var input = notificationParse[0].parameters.horarioInicio.toString();
      var fields = input.split(':');
      var hora = fields[0];
      let horaFinal: number = +hora
      var minuto = fields[1];
      let minutoFinal: number = +minuto
      let horario = this.toDate(notificationParse[0].parameters.dataAgenda.split(" ")[0])
      horario.setHours(horaFinal, minutoFinal, 0)
      let horario2 = this.toDate(notificationParse[0].parameters.dataAgenda.split(" ")[0])
      input = notificationParse[0].parameters.horarioFim.toString();
      fields = input.split(':');
      hora = fields[0];
      horaFinal = +hora
      minuto = fields[1];
      minutoFinal = +minuto
      horario2.setHours(horaFinal, minutoFinal, 0)
      var title = notificationParse[0].parameters.servicos + ' - ' + notificationParse[0].parameters.colaborador
      var salao = notificationParse[0].parameters.salao
      this.Calendar.createEventInteractively(title, salao, null, horario, horario2).then((res) => {


      });
    }

    if (notificationParse[0].callback == 'DeleteAgenda') {
      var input = notificationParse[0].parameters.horarioInicio.toString();
      var fields = input.split(':');
      var hora = fields[0];
      let horaFinal: number = +hora
      var minuto = fields[1];
      let minutoFinal: number = +minuto
      let horario = this.toDate(notificationParse[0].parameters.dataAgenda.split(" ")[0])
      horario.setHours(horaFinal, minutoFinal, 0)
      let horario2 = this.toDate(notificationParse[0].parameters.dataAgenda.split(" ")[0])
      input = notificationParse[0].parameters.horarioFim.toString();
      fields = input.split(':');
      hora = fields[0];
      horaFinal = +hora
      minuto = fields[1];
      minutoFinal = +minuto
      horario2.setHours(horaFinal, minutoFinal, 0)

      var title = notificationParse[0].parameters.servicos + ' - ' + notificationParse[0].parameters.colaborador
      var salao = notificationParse[0].parameters.salao
      setTimeout(() => {
        this.Calendar.deleteEvent(title, salao, null, horario, horario2).then((res) => {

          if (res) {
            this.toast.presentToast(this.translate.instant('Agendamento excluido com sucesso'));
          }
          else {
            this.toast.presentToast(this.translate.instant('Erro ao excluir agendamento'), 'danger');
          }
        });
      }, 1500);


    }
    if (notificationParse[0].callback == 'AvaliaServico') {


      const actions = notificationParse[0];

      const modal = await this.modalController.create({
        component: AvaliarColaboradorModalComponent,
        componentProps: {
          servicos: actions.parameters.servicos
        },
      });
      modal.onDidDismiss().then(retorno => {
      });

      return await modal.present();
    }

  }

  apagar(item) {
    this.notifications = this.notifications.filter(x => x.notId != item.notId)
    localStorage.setItem('one.notifications', JSON.stringify(this.notifications))
  }
  async clearNotificationCache(notification) {

    this.notificationsCache.notification = notification
    await this.sharedService.clearNotificationByNotification(this.notificationsCache).subscribe(result => {

      this.sharedService.getNotifications(this.user.authenticatedBranch.empresaId, this.user.authenticatedBranch.filialId, this.user.authenticatedUser.cliForColsId).subscribe(res => {
        this.notifications = res;
      })

    }, fail => {
    })
  }

  async limparNotificacoes() {
    const alert = await this.alertLimparNotification.create({
      header: 'Confirmação',
      subHeader: 'Deseja apagar todas as notificações?',
      message: '',
      buttons: [
        {
          text: 'Sim',
          handler: () => {

            this.sharedService.clearNotifications(this.notificationsCache).subscribe(res => {
              this.notifications = [];
            }, fail => {
            })
          }
        },
        {
          text: 'Cancelar'
        }
      ]
    });
    alert.present();

  }

  async abrirAlertLimparNotification() {
    let confirmacao = false;
    const alert = await this.alertLimparNotification.create({
      header: 'Confirmação',
      subHeader: 'Deseja apagar todas as notificações?',
      message: '',
      buttons: [
        {
          text: 'Sim',
          handler: () => { confirmacao = true }
        },
        {
          text: 'Cancelar'
        }
      ]
    });
    alert.present();
    return confirmacao
  }
  onClickItem(item) {
    let actions = JSON.parse(item.actions);

    if (actions[0].title == 'Avaliar') {
      this.modalAvaliar(actions)
    } else if (actions[0].title == 'InserirAgenda') {
      let item = actions[0]

      let horaInicio = this.returnDateWithHours(item.parameters.horarioInicio)
      let horaFim = this.returnDateWithHours(item.parameters.horarioFim)

      this.Calendar.createEventInteractively(`${item.parameters.servicos} - ${item.parameters.colaborador}`, item.parameters.salao, null, horaInicio, horaFim).then((res) => {

      });

    } else if (actions[0].title == 'DesmarcarAgenda') {
      let item = actions[0]

      let horaInicio = this.returnDateWithHours(item.parameters.horarioInicio)
      let horaFim = this.returnDateWithHours(item.parameters.horarioFim)
      this.Calendar.deleteEvent(`${item.parameters.servicos} - ${item.parameters.colaborador}`, item.parameters.salao, null, horaInicio, horaFim).then(() => {

      })
    }
  }

  private returnDateWithHours(hours: string): Date {
    let today = new Date();

    let horas = hours.split(':')

    let novaData = new Date(today.getFullYear(), today.getMonth(), today.getDate(), Number(horas[0]), Number(horas[1]), Number(horas[2]))

    return novaData;
  }

  async modalAvaliar(actions) {
    const modal = await this.modalController.create({
      component: AvaliarColaboradorModalComponent,
      componentProps: {
        servicos: actions[0].parameters.servicos
      }
    })

    return await modal.present()
  }

  public returnBtnLabel(item): string {
    let actions = JSON.parse(item.actions);
    let title = actions[0].title

    if (title == 'InserirAgenda') {
      return this.translate.instant('SHARED.NOTIFICACAO.INSERIR')
    } else if (title == 'DesmarcarAgenda') {
      return this.translate.instant('SHARED.NOTIFICACAO.REMOVER')
    } else if (title == 'Avaliar') {
      return this.translate.instant('SHARED.NOTIFICACAO.AVALIAR')
    }
  }
}

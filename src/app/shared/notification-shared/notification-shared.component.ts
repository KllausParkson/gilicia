import { ChangeDetectorRef, Component, OnChanges, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SharedService } from '../services/shared.service';
import { NotificationModalSharedComponent } from './notification-modal-shared/notification-modal-shared.component';

@Component({
  selector: 'app-notification-shared',
  templateUrl: './notification-shared.component.html',
  styleUrls: ['./notification-shared.component.scss'],
})
export class NotificationSharedComponent implements OnInit, OnChanges {

  public countNotification: number;
  public tipoLogin: string;
  public notifications: any;
  public user: any;

  constructor(private modalController: ModalController,
    private cd: ChangeDetectorRef,
    private sharedService: SharedService) { }

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('one.user'))
    await this.sharedService.getNotifications(this.user.authenticatedBranch.empresaId, this.user.authenticatedBranch.filialId, this.user.authenticatedUser.cliForColsId).subscribe(res => {
      this.notifications = res;
      if (this.notifications) {
        this.countNotification = this.notifications?.length
      }
      else {
        this.countNotification = 0
      }
    })


    this.tipoLogin = localStorage.getItem('one.tipologin')
  }

  ngOnChanges() {
    this.cd.detectChanges()

    if (this.notifications) {
      this.countNotification = this.notifications?.length
    }
    else {
      this.countNotification = 0
    }


  }

  async onClick() {
    var notificacoes = localStorage.getItem('one.notificationsCount') == null ? 0 : localStorage.getItem('one.notificationsCount')
    const modal = await this.modalController.create({
      component: NotificationModalSharedComponent,
      componentProps: {
        notificacoesAntigas: notificacoes,
        notificacoesNovas: notificacoes
      },

    })

    modal.onDidDismiss().then(res => {
      if (res.data.count) {
        this.countNotification = res.data.count
      }
      else {
        this.countNotification = 0
      }
    })

    return await modal.present()
  }

}

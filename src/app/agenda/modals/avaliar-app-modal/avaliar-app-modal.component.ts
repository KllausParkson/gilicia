import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-avaliar-app-modal',
  templateUrl: './avaliar-app-modal.component.html',
  styleUrls: ['./avaliar-app-modal.component.scss'],
})
export class AvaliarAppModalComponent implements OnInit {


  public oneRate;
  public userData;

  constructor(public modalController: ModalController) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('one.user'))
    this.oneRate = JSON.parse(localStorage.getItem('one.rate'))
  }


  closeModal() {
    localStorage.setItem('one.timestamp', new Date().toDateString());
    this.modalController.dismiss()
  }

  openMarket() {
    localStorage.setItem('one.ratestamp', new Date().toDateString());
    if (Capacitor.getPlatform() == 'ios') {
      if (this.oneRate.filter(x => x.email == this.userData.authenticatedUser.email)?.length != 0) {
        let elementData = this.oneRate.filter(x => x.email == this.userData.authenticatedUser.email)[0]
        let index = this.oneRate.indexOf(elementData)
        elementData.rated = true
        this.oneRate.splice(index, 1)
        this.oneRate.push(elementData)
        localStorage.setItem('one.rate', JSON.stringify(this.oneRate));
      }
      window.location.href = localStorage.getItem('appId') != '1' ? localStorage.getItem('one.linkIOS') : 'http://itunes.apple.com/app/id1549875818';
    }
    else if (Capacitor.getPlatform() == 'android') {
      if (this.oneRate.filter(x => x.email == this.userData.authenticatedUser.email)?.length != 0) {
        let elementData = this.oneRate.filter(x => x.email == this.userData.authenticatedUser.email)[0]
        let index = this.oneRate.indexOf(elementData)
        elementData.rated = true
        this.oneRate.splice(index, 1)
        this.oneRate.push(elementData)
        localStorage.setItem('one.rate', JSON.stringify(this.oneRate));
      }
      window.location.href = localStorage.getItem('appId') != '1' ? localStorage.getItem('one.linkAndroid') : 'market://details?id=onebeleza.app';
    }

    //esse else if serve para debugar a lógica no web se for necessário
    // else if(Capacitor.getPlatform() == 'web'){
    //   if(this.oneRate.filter(x => x.email == this.userData.authenticatedUser.email)?.length != 0){
    //     let elementData = this.oneRate.filter(x => x.email == this.userData.authenticatedUser.email)[0]
    //     let index = this.oneRate.indexOf(elementData)
    //     elementData.rated = true
    //     this.oneRate.splice(index, 1)
    //     this.oneRate.push(elementData)
    //     localStorage.setItem('one.rate', JSON.stringify(this.oneRate));
    //   }
    // }

    this.modalController.dismiss();
  }

}

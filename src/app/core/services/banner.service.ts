import { Injectable } from "@angular/core";
import { AlertController } from "@ionic/angular";

@Injectable({
    providedIn: 'root'
  })
  export class BannerService {
  
    constructor(private alertController: AlertController) { }
    async bannerAnuncio(imgBanner, acaoClick, nomeBanner){
     
        var local = localStorage.getItem(nomeBanner)
        if((local == null || local != new Date().toDateString())){
          const alert = await this.alertController.create({
            cssClass: 'alertDiario',
            mode:"ios",
            message: "<div><img src="+imgBanner+"> </div>",
            buttons: [
              {
                text: "Saiba Mais",
                role: 'confirm',
                cssClass: 'confirmButton',
                handler: (blah) => {
                  window.open(acaoClick, '_system');
                  localStorage.setItem(nomeBanner, new Date().toDateString());
                }
              },
              {
                text: "Fechar",
                role: 'cancel',
                cssClass: 'cancelButton',
                handler: (blah) => {
                  localStorage.setItem(nomeBanner, new Date().toDateString());
                }
              }
            ]
          });
    
          await alert.present();
        }
      }
    
  }
  


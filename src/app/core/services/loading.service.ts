import { Injectable } from "@angular/core";
import { LoadingController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  isLoading = false;

  constructor(public loading: LoadingController) {}

  // Método para apresentar a animação de Loading. O tempo padrão é 2000ms, podendo ser alterado por meio de passagem de parâmetro.
  async present(timeLoading = 2) {
    timeLoading *= 1000;

    if (this.isLoading === false) {
      this.isLoading = true;

      await this.loading
        .create({
          spinner: null,
          cssClass: "custom-loading",
          message: '<div class="imgLogoLoading"> </div>',
        })
        .then((a) => {
          a.present().then(() => {
            if (!this.isLoading) {
              a.dismiss(); // Foi mandado dismiss antes do Loading carregar
            }
          });

          setTimeout(function () {
            a.dismiss();
          }, timeLoading);
        });
    }
  }

  async dismiss() {
    if (this.isLoading === true) {
      this.isLoading = false;
      return await this.loading
        .getTop()
        .then((f) => (f ? this.loading.dismiss() : null));
    }
  }
}

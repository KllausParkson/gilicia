import { Component, NgModule } from "@angular/core";

@Component({
  selector: "app-splashscreen",
  template: `
    <div class="LogoContainer">
      <div class="Logo"></div>
    </div>
  `,

  styles: [
    `
      .LogoContainer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;
        background-image: var(--background-splash-app) !important;
        background: radial-gradient(
          circle,
          var(--ion-splash-cor1) 0%,
          var(--ion-splash-cor2) 100%
        );      
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;  
        outline: var(--bordaNoSplash);
        outline-offset: -15px; 
      }

      .Logo {
        width: 200px;
        height: 200px;
        background-image: var(--estabelecimento-logo-splash);
        background-repeat: no-repeat;
        background-size: contain;
        filter: drop-shadow(0px 2px 5px rgb(0, 0, 0, 0.2));
        animation-name: LogoAnimada;
        animation-duration: 2s;
        animation-timing-function: ease;
      }

      @keyframes LogoAnimada {
        0% {
          opacity: 0%;
        }
        30% {
          opacity: 60%;
        }
        100% {
          opacity: 100%;
        }
      }
    `,
  ],
})
export class splashscreenComponent {}

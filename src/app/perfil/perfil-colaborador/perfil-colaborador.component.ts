import { Component, OnInit, Renderer2 } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DisabledDatesService } from '@progress/kendo-angular-dateinputs';
import { Observable } from 'rxjs';
import { DateUtils } from 'app/core/common/data-type-utils/date-utils';
import { TelefonePipe } from 'app/core/pipes/telefone.pipe';
import { AvaliacoesModalComponent } from '../modals/avaliacoes-modal/avaliacoes-modal.component';
import { EditarPerfilColaboradorModalComponent } from '../modals/editar-perfil-colaborador-modal/editar-perfil-colaborador-modal.component';
import { PerfilColaboradorModel } from '../models/perfil-colaborador-model';
import { PerfilServiceService } from '../services/perfil-service.service';

@Component({
  selector: 'app-perfil-colaborador',
  templateUrl: './perfil-colaborador.component.html',
  styleUrls: ['./perfil-colaborador.component.scss'],
})
export class PerfilColaboradorComponent implements OnInit {

  public semFoto = 'https://oneproducao.blob.core.windows.net/one2/Imagens/Sem_FotoPerfil.png';
  public colaborador: PerfilColaboradorModel;
  public notaProfissional: number;

  public avaliacoes: any

  private dataInicial: Date;
  private dataFinal: Date;

  public appidExclusivo: any;

  public nomeMostrado: string;
  public flagTema: any = false;

  constructor(private PerfilService: PerfilServiceService,
    private ModalController: ModalController,
    private TelefonePipe: TelefonePipe,
    private renderer: Renderer2) { }

  ngOnInit() {
    this.flagTema = (localStorage.getItem('tema') != undefined || localStorage.getItem('tema') != null) && localStorage.getItem('tema') == 'dark' ? true : false
    this.appidExclusivo = localStorage.getItem('appId')
    this.PerfilService.getColaborador().
      subscribe(res => {
        this.colaborador = res
        this.colaborador.celular = this.TelefonePipe.transform(this.colaborador.celular)

        //Mostra apenas o primeiro e o segundo nome do colaborador,
        //por isso, caso o nome seja muito grande devemos corta-lo

        let nomeTemp = this.colaborador.nome.split(' ')
        this.nomeMostrado = nomeTemp?.length > 2 ? `${nomeTemp[0]} ${nomeTemp[1]}` : this.colaborador.nome
      })

    this.dataFinal = new Date()
    this.dataInicial = new Date(this.dataFinal)
    this.dataInicial.setDate(1);
    this.dataInicial.setMonth(0);
    this.dataInicial.setFullYear(2010);

    this.PerfilService.getAvaliacaoColaborador(DateUtils.DateToString(this.dataInicial), DateUtils.DateToString(this.dataFinal))
      .subscribe(res => {
        this.avaliacoes = res
        this.setStars()
      })
  }

  modoEscuro(event) {

    if (event.detail.checked) {
      this.renderer.setAttribute(document.body, 'color-theme', 'dark')
      localStorage.setItem('tema', 'dark')
    } else {
      this.renderer.setAttribute(document.body, 'color-theme', 'light')
      localStorage.setItem('tema', 'light')
    }
  }

  setStars() {
    let stars = []

    stars.push(document.getElementById('star1'))
    stars.push(document.getElementById('star2'))
    stars.push(document.getElementById('star3'))
    stars.push(document.getElementById('star4'))
    stars.push(document.getElementById('star5'))


    if (this.avaliacoes.mediaGeral >= 5) {
      //todas as estrelas cheias            
      stars[0].setAttribute('name', 'star')
      stars[1].setAttribute('name', 'star')
      stars[2].setAttribute('name', 'star')
      stars[3].setAttribute('name', 'star')
      stars[4].setAttribute('name', 'star')
    } else if (this.avaliacoes.mediaGeral > 4 && this.avaliacoes.mediaGeral < 5) {
      // 4 estrelas cheias e 1 meia estrela
      stars[0].setAttribute('name', 'star')
      stars[1].setAttribute('name', 'star')
      stars[2].setAttribute('name', 'star')
      stars[3].setAttribute('name', 'star')
      stars[4].setAttribute('name', 'star-half')
    } else if (this.avaliacoes.mediaGeral == 4) {
      // 4 estrelas cheias e 1 estrela vazia
      stars[0].setAttribute('name', 'star')
      stars[1].setAttribute('name', 'star')
      stars[2].setAttribute('name', 'star')
      stars[3].setAttribute('name', 'star')
      stars[4].setAttribute('name', 'star-outline')
    } else if (this.avaliacoes.mediaGeral > 3 && this.avaliacoes.mediaGeral < 4) {
      //3 estrelas cheias 1 meias estrela e 1 estrela vazia
      stars[0].setAttribute('name', 'star')
      stars[1].setAttribute('name', 'star')
      stars[2].setAttribute('name', 'star')
      stars[3].setAttribute('name', 'star-half')
      stars[4].setAttribute('name', 'star-outline')
    } else if (this.avaliacoes.mediaGeral == 3) {
      //3 estrelas e 2 estrelas vazias
      stars[0].setAttribute('name', 'star')
      stars[1].setAttribute('name', 'star')
      stars[2].setAttribute('name', 'star')
      stars[3].setAttribute('name', 'star-outline')
      stars[4].setAttribute('name', 'star-outline')
    } else if (this.avaliacoes.mediaGeral > 2 && this.avaliacoes.mediaGeral < 3) {
      //2 estrelas cheias 1 meias estrela e 2 estrela vazia
      stars[0].setAttribute('name', 'star')
      stars[1].setAttribute('name', 'star')
      stars[2].setAttribute('name', 'star-half')
      stars[3].setAttribute('name', 'star-outline')
      stars[4].setAttribute('name', 'star-outline')
    } else if (this.avaliacoes.mediaGeral == 2) {
      //2 estrelas e 3 estrelas vazias
      stars[0].setAttribute('name', 'star')
      stars[1].setAttribute('name', 'star')
      stars[2].setAttribute('name', 'star-outline')
      stars[3].setAttribute('name', 'star-outline')
      stars[4].setAttribute('name', 'star-outline')
    } else if (this.avaliacoes.mediaGeral > 1 && this.avaliacoes.mediaGeral < 2) {
      //1 estrelas cheias 1 meias estrela e 3 estrela vazia
      stars[0].setAttribute('name', 'star')
      stars[1].setAttribute('name', 'star-half')
      stars[2].setAttribute('name', 'star-outline')
      stars[3].setAttribute('name', 'star-outline')
      stars[4].setAttribute('name', 'star-outline')
    } else if (this.avaliacoes.mediaGeral == 1) {
      //1 estrelas e 4 estrelas vazias
      stars[0].setAttribute('name', 'star')
      stars[1].setAttribute('name', 'star-outline')
      stars[2].setAttribute('name', 'star-outline')
      stars[3].setAttribute('name', 'star-outline')
      stars[4].setAttribute('name', 'star-outline')
    } else {
      //apenas estrelas vazias

      stars[0].setAttribute('name', 'star-outline')
      stars[1].setAttribute('name', 'star-outline')
      stars[2].setAttribute('name', 'star-outline')
      stars[3].setAttribute('name', 'star-outline')
      stars[4].setAttribute('name', 'star-outline')
    }
  }

  async onClickEditarColaborador() {
    const modal = await this.ModalController.create({
      component: EditarPerfilColaboradorModalComponent,
      componentProps: {
        colaboradorEditado: this.colaborador
      }
    });

    modal.onDidDismiss().then((res) => {
      if (res.data) {
        this.colaborador = res.data.colaboradorEditado
      }
    })

    return await modal.present();
  }

  async onClickAvaliacao() {
    const modal = await this.ModalController.create({
      component: AvaliacoesModalComponent,
      cssClass: "avaliacoesModal",
      componentProps: {
        avaliacoes: this.avaliacoes,
        dataInicial: this.dataInicial,
        dataFinal: this.dataFinal
      }
    });

    modal.onDidDismiss().then((res) => {
      if (res.data) {
        this.colaborador = res.data.colaboradorEditado
      }
    })

    return await modal.present();

  }

}

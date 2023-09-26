import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { RelatorioService } from 'app/relatorios/services/relatorio.service';

@Component({
  selector: 'app-popover-relatorios-shared',
  templateUrl: './popover-relatorios-shared.component.html',
  styleUrls: ['./popover-relatorios-shared.component.scss'],
})
export class PopoverRelatoriosSharedComponent implements OnInit {
  public active: string;
  public parametrosLight: any;
  public tipoLogin: any
  public temChatBot: boolean = false;
  public basehref: any

  @Input() temAssinatura;

  constructor(private router: Router,
    private relatorioService: RelatorioService) {
  }

  ngOnInit() {
    this.basehref = localStorage.getItem('basehref')
    this.tipoLogin = localStorage.getItem('one.tipologin')
    this.setaRelatorioAtivo();
    this.empresaTemChatbot();
  }

  onClick(route: string) {
    var url = window.location.origin;

    this.active = route;

    // eh necessario testar se esta em producao, pois a url precisa do nome do applicativo
    document.location.href = environment.production ? `${url}/${this.basehref}/relatorios/${route}` : `${url}/relatorios/${route}`;
  }

  empresaTemChatbot() {
    this.relatorioService.ExisteEmpresaComWhatsapp().subscribe(res => {
      this.temChatBot = res.data;
    })
  }

  private setaRelatorioAtivo() {
    this.active = this.router.url.slice(12);
    if (this.active.search('avaliacoes') === 0) {
      this.active = 'avaliacoes';
    } else if (this.active.search('faturamento') === 0) {
      this.active = 'faturamento';
    } else if (this.active.search('produtividade') === 0) {
      this.active = 'produtividade';
    }
  }
}

import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-popover-historico-shared',
  templateUrl: './popover-historico-shared.component.html',
  styleUrls: ['./popover-historico-shared.component.scss'],
})
export class PopoverHistoricoSharedComponent implements OnInit, DoCheck {

  public comissaoPermissao: boolean = false;
  public faturamentoPermissao: boolean = false;
  public produtividadePermissao: boolean = false;
  public historicoClientePermissao: boolean = true;
  public active: string;
  private name: string;
  public parametrosLight: any;
  public tipoLogin: any
  public basehref: any;
  @Input() temAssinatura;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.basehref = localStorage.getItem('basehref')
    const userCheck = JSON.parse(localStorage.getItem('one.user'));
    this.tipoLogin = localStorage.getItem('one.tipologin')
    if (userCheck.claims['Comissões'] != null) {
      this.comissaoPermissao = userCheck.claims['Comissões'].filter(x => x === 'Visualizar Extrato');
    }

    if (userCheck.claims['Relatórios'] != null) {
      this.faturamentoPermissao = userCheck.claims['Relatórios'].filter(x => x === 'Visualizar Faturamento');
      this.produtividadePermissao = userCheck.claims['Relatórios'].filter(x => x === 'Visualizar Produtividade');
    }
    this.historicoClientePermissao = this.parametrosLight.historicoCliente;

    this.setaRelatorioAtivo();
    this.name = environment.name;
  }

  ngDoCheck() {
    this.setaRelatorioAtivo();
  }

  onClickAssinaturas(route: string) {
    var url = window.location.origin;

    this.active = route;

    // eh necessario testar se esta em producao, pois a url precisa do nome do applicativo
    document.location.href = environment.production ? `${url}/${this.basehref}/relatorios/${route}` : `${url}/relatorios/${route}`;

  }

  onClick(route: string) {
    const url = window.location.origin;

    this.active = route;

    // eh necessario testar se esta em producao, pois a url precisa do nome do applicativo

    document.location.href = environment.production ? `${url}/${this.basehref}/financeiro/${route}` : `${url}/financeiro/${route}`;

  }

  private setaRelatorioAtivo() {
    this.active = this.router.url.slice(12);
    if (this.active.search('comissao') === 0) {
      this.active = 'comissao';
    } else if (this.active.search('faturamento') === 0) {
      this.active = 'faturamento';
    } else if (this.active.search('produtividade') === 0) {
      this.active = 'produtividade';
    }
  }



}

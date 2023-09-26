import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoadingService } from 'app/core/services/loading.service';
import { FinanceiroService } from '../services/financeiro.service';
import { ComissaoProfissionalModel } from '../models/comissaoProfissionalModel';
import { ToastService } from 'app/core/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { PerfilModel } from 'app/perfil/models/perfil-model';
import { TelefonePipe } from 'app/core/pipes/telefone.pipe';
import { HistoricoModel } from 'app/perfil/models/historico-model';
import { HistoricoObservacoesAgModel } from 'app/perfil/models/historico-observacoes-model';
import { AgendaService } from 'app/agenda/services/agenda.service';
import { LoginService } from 'app/login/services/login.service';
import { LoginUsuarioModel } from 'app/login/models/login-usuario-model';
import { environment } from 'environments/environment';
import { Capacitor } from '@capacitor/core';
import { LoginModel } from 'app/login/models/login-model';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { FloatingLabelModule } from '@progress/kendo-angular-label';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-historico-cliente',
  templateUrl: './historico-cliente.component.html',
  styleUrls: ['./historico-cliente.component.scss'],
})
export class HistoricoClienteComponent implements OnInit {

  public loginRes: LoginUsuarioModel;
  public mobilidade: any[];
  private userData: any;
  public segment = 'historico';
  public empresaAtual: any;
  public clienteId: number;
  public historico: HistoricoModel[] = new Array<HistoricoModel>();
  public historicoObs: HistoricoObservacoesAgModel[] = new Array<HistoricoObservacoesAgModel>();
  private ordem: number;
  private ordemObs: number;
  public acabouHistorico: boolean = false;
  public acabouHistoricoObs: boolean = false;
  public perfilUsuario: PerfilModel;
  public startDate: Date = new Date();
  public endDate: Date = new Date();
  public comissao: ComissaoProfissionalModel = new ComissaoProfissionalModel();
  public listClientes: any[];
  public pesquisaClienteLoader: boolean = false;
  public clienteCadastrado: any;
  public servicoSelecionado: any;
  public clientePreenchido: boolean;
  public horarioSelecionado: any;
  public servicoPreenchido: boolean;
  private name: string;

  validation_messages = {
    'nomeCliente': [
      { type: 'required', message: this.translate.instant('AGENDA.MODALS.CADASTRORAPIDO.VALIDATION.REQUIRED.NOME') }
    ],
    'celularCliente': [
      { type: 'required', message: this.translate.instant('AGENDA.MODALS.CADASTRORAPIDO.VALIDATION.REQUIRED.CELULAR') }
    ]
  };

  constructor(private Telefone: TelefonePipe,
    private cd: ChangeDetectorRef,
    private agendaService: AgendaService,
    private financeiroService: FinanceiroService,
    private loadingService: LoadingService,
    private toast: ToastService,
    public translate: TranslateService
  ) { }

  async ngOnInit() {

    this.name = environment.name
    this.userData = JSON.parse(localStorage.getItem('one.user'));
    await this.loadingService.present();
    this.ordem = 1;
    this.getValues();
    this.empresaAtual = JSON.parse(localStorage.getItem('one.user'))?.authenticatedBranch;
    this.financeiroService.getHistoricoColaboradorCliente(1, 8916)

  }

  getValues() {
    this.loadingService.present();

    this.financeiroService.getComissao(this.startDate.toISOString().split('T')[0], this.endDate.toISOString().split('T')[0])
      .subscribe(
        result => {
          this.loadingService.dismiss();
          this.comissao = result;
        },
        fail => {
          this.loadingService.dismiss();
          this.onError(fail);
        }
      );
  }

  receiveDate(event: any) {
    if (event.startDate != this.startDate || event.endDate != this.endDate) {
      this.startDate = event.startDate;
      this.endDate = event.endDate;
      this.getValues();
    }
  }

  // Tratar erros
  onError(fail: any) {
    if (fail.status === 403) {
      this.toast.presentToast(this.translate.instant('FINANCEIRO.PERMISSION'), 'danger');
    }
    else {
      this.toast.presentToast(this.translate.instant('FINANCEIRO.ERROR'), 'danger');
    }
  }

  getHistorico(ordem: number, clienteId: number) {
    return this.financeiroService.getHistoricoColaboradorCliente(ordem, clienteId);

  }

  pesquisaClientes(searchTerm: string) {
    this.pesquisaClienteLoader = true;
    if (searchTerm?.length > 0) {
      this.agendaService.getClientesPesquisados(searchTerm)
        .subscribe(
          result => {
            this.pesquisaClienteLoader = false;
            this.listClientes = result;
          },
          fail => {
            this.pesquisaClienteLoader = false;
            //this.onError(fail); 
          }
        );
    }
  }

  getHistoricoCliente(event: any) {
    this.clienteId = event.clienteId
    this.ordem = 1
    this.ordemObs = 1
    this.acabouHistorico = false
    this.acabouHistoricoObs = false
    this.historico = []
    this.historicoObs = []
    this.financeiroService.getHistoricoColaboradorCliente(this.ordem, this.clienteId)
    this.financeiroService.getHistoricoObservacaoCliente(this.ordemObs, this.clienteId)
    this.pesquisaClienteLoader = false;
    this.loadData(event);
    this.loadDataObs(event);
  }

  loadData(ev: any) {
    this.getHistorico(this.ordem, this.clienteId)
      .subscribe(
        res => {
          if (res?.length > 0) {
            this.historico = [...this.historico, ...res];
          }
          if (res?.length <= 4) {
            this.acabouHistorico = true;
          }
          this.cd.detectChanges();
        }
      );
    this.ordem++;

  }

  loadDataObs(ev: any) {
    this.financeiroService.getHistoricoObservacaoCliente(this.ordemObs, this.clienteId)
      .subscribe(
        res => {
          if (res?.length > 0) {
            this.historicoObs = [...this.historicoObs, ...res];
          }
          if (res?.length <= 4) {
            this.acabouHistoricoObs = true;
          }
          this.cd.detectChanges();
          console.log(this.historicoObs)
        }
      );
    this.ordemObs++;

  }

  public valueNormalizer = (text: Observable<string>) => text.pipe(map((text: string) => {
    return {
      value: null,
      text: ""
    };
  }));



}

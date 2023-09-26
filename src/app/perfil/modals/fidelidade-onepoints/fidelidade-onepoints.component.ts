import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { PerfilModel } from '../../models/perfil-model';
import { MilhagensModel } from '../../models/milhagens-model';
import { PerfilServiceService } from '../../services/perfil-service.service';
import { ServicoFidelidadeModel } from '../../models/servico-fidelidade-model';
import { AssinaturaClientesModel } from '../../models/assinatura-clientes-model';
import { DisponibilidadeOrcamentosModel } from '../../models/disponibilidade-ocamentos-model'
import { DisponibiliddeCredDebtModel } from '../../models/disponibilidade-CredDebt-model'
import { AgendaService } from 'app/agenda/services/agenda.service';

@Component({
  selector: 'app-fidelidade-onepoints',
  templateUrl: './fidelidade-onepoints.component.html',
  styleUrls: ['./fidelidade-onepoints.component.scss'],
})
export class FidelidadeOnepointsComponent implements OnInit {

  public mobilidade: any[];
  public empresaAtual: any;
  public perfilUsuario: PerfilModel;
  public milhagem: MilhagensModel;
  public servicosFidelidade: ServicoFidelidadeModel;
  public assinaturaClientes: Array<AssinaturaClientesModel>;
  public temAssinaturaClientes: boolean;
  public TemDispOrcamentos: boolean = false;
  public DispOrcamentos: DisponibilidadeOrcamentosModel[];
  public DispCred: boolean = false;
  public DispDebt: boolean = false;
  public DispCredDebt: DisponibiliddeCredDebtModel = { Cred: 0, Debt: 0 };
  public parametroIndividualizaCredito: boolean = false;
  public creditoAntecipadoNaFilial: number = 0;

  constructor(public navCtrl: NavController,
    private PerfilService: PerfilServiceService,
    public ModalController: ModalController,
    public agendaService: AgendaService,
    public navParams: NavParams) { }

  async ngOnInit() {
    this.PerfilService.getMilhagens()
      .subscribe(res => {
        this.milhagem = res;
      })

    this.PerfilService.getServicosFidelidade()
      .subscribe(res => {
        this.servicosFidelidade = res;
      })

    this.PerfilService.getClienteTemAssinatura()
      .subscribe(res => {
        this.temAssinaturaClientes = res;
        if (res == true) {
          this.PerfilService.getAssinaturaClientes()
            .subscribe(res => {
              this.assinaturaClientes = res;
              this.assinaturaClientes.forEach(element => {
                this.PerfilService.getServicosAssinatura(element.assinaturaClientesId)
                  .subscribe(res => {
                    element.servicosPlano = res.map(({ descricao }) => descricao)
                  });
              });
            })
        }
      });

    this.PerfilService.getDisponibilidadeOrcamentos().subscribe((res: DisponibilidadeOrcamentosModel) => {
      if (res == null) {
        this.TemDispOrcamentos = false;
      } else {
        this.TemDispOrcamentos = true;
        this.DispOrcamentos = Object.values(res)
      }
    })

    this.GetCredDebtDisponivel()
    await this.getCredFilial()
  }

  GetCredDebtDisponivel() {
    this.PerfilService.getCredDebtDisponivel().subscribe((res: any) => {
      this.DispCredDebt.Cred = res.creditoAntecipado;
      this.DispCredDebt.Debt = res.creditoDebito;
      this.DispCredDebt.Cred > 0 ? this.DispCred = true : this.DispCred = false;
      this.DispCredDebt.Debt < 0 ? this.DispDebt = true : this.DispDebt = false;
    })
  }

  async getCredFilial() {
    await this.PerfilService.getCredAntecipadoFilial().then(
      res => {
        this.creditoAntecipadoNaFilial = res;
      }
    );
    this.agendaService.getParametrosLight().subscribe(
      res => {
        this.parametroIndividualizaCredito = res.individualizaCreditoNestaFilial;
      }, fail => {
      })
  }

  getPorcentagem(i: number) {
    let porcentagemServico: number = 0;

    porcentagemServico = 1 * (this.servicosFidelidade.servicos[i].quantidadeAtual) /
      (this.servicosFidelidade.servicos[i].quantidadeParaGanhar);

    return porcentagemServico;
  }

  getMilhagem() {
    this.PerfilService.getMilhagens()
      .subscribe(res => {
        this.milhagem = res;
      })
  }

  closeModal() {
    this.ModalController.dismiss()
  }


}

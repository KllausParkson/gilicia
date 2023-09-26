import { Component, OnInit } from "@angular/core";
import { RelatorioService } from "../services/relatorio.service";
import { LoadingService } from "app/core/services/loading.service";
import { element } from "protractor";

@Component({
  selector: "app-relatorio-assinaturas",
  templateUrl: "./relatorio-assinaturas.page.html",
  styleUrls: [],
})
export class RelatorioAssinaturasComponent implements OnInit {
  public perfilGestor =
    localStorage.getItem("one.tipologin") == "gestor" ? true : false;
  public nomeUser = JSON.parse(localStorage.getItem("one.user"))
    .authenticatedUser.nomeUsuario;

  public dataFim: Date = new Date();
  public dataInicio: Date = new Date();

  constructor(
    private RelatorioService: RelatorioService,
    private loadingService: LoadingService
  ) { }

  //Receber colaboradores
  public RepostaApi: any;
  public arrayColaboradores = [];

  //Receber  
  public pacotes: Array<string> = ["Cabelo + Barba", "Tinturas"];

  //Array que irá aparecer no dropdown
  public dropdownColaboradores: Array<string> = [];
  public dropdownPacotes: Array<string> = ["Todos Pacotes"];

  ngOnInit(): void {
    this.pegarDataAtual();
    this.PegarRelatoriosAssinaturas(this.dataFim, this.dataInicio);
  }

  pegarDataAtual() {
    //Faz a página carregar mostrando o dia anterior
    this.dataFim.setDate(this.dataInicio.getDate() - 1);
  }

  emitirData(evento) {
    // O "startDate e endDate do component estão trocados"
    if (evento.startDate != this.dataFim || evento.endDate != this.dataInicio) {
      let dataInicio: Date = new Date(evento.endDate);
      let dataFim: Date = new Date(evento.startDate);
      this.PegarRelatoriosAssinaturas(dataFim, dataInicio);
      this.dataInicio = dataInicio;
      this.dataFim = dataFim;
    }
  }

  OrdernarServicos() {
    this.arrayColaboradores.forEach((elementColab) => {
      elementColab.servicos.forEach((elementServicos) => {
        elementServicos.atendidos.sort(function (a, b) {
          return a[1] - b[1];
        });
      });
    });
  }

  PegarRelatoriosAssinaturas(data1: Date, data2: Date) {
    this.arrayColaboradores = [];
    this.loadingService.present();
    let dia1 = data1.getDate();
    let mes1 = data1.getMonth();
    let ano1 = data1.getFullYear();
    let stringData1 = mes1 + 1 + "-" + dia1 + "-" + ano1;

    let dia2 = data2.getDate();
    let mes2 = data2.getMonth();
    let ano2 = data2.getFullYear();
    let stringData2 = mes2 + 1 + "-" + dia2 + "-" + ano2;

    if (this.perfilGestor) {
      this.RelatorioService.getRelatoriosAssinaturas(
        stringData1,
        stringData2
      ).subscribe((res) => {
        this.RepostaApi = res;
        this.arrayColaboradores = this.RepostaApi.servicosPorColaborador;
        this.montarDropDownColab();
        this.OrdernarServicos();
        this.loadingService.dismiss();
      });
    } else {
      this.RelatorioService.getRelatoriosAssinaturas(
        stringData1,
        stringData2
      ).subscribe((res) => {
        this.RepostaApi = res;
        this.RepostaApi.servicosPorColaborador.forEach((element) => {
          if (element.nomeColaborador == this.nomeUser) {
            this.arrayColaboradores.push(element);
          }
        });
        this.loadingService.dismiss();
      });
    }
  }

  montarDropDownColab() {
    this.dropdownColaboradores = [];
    this.arrayColaboradores.forEach((element) => {
      this.dropdownColaboradores.push(element.nomeColaborador);
    });
  }

  filtrarColaborador(evento) {
    this.loadingService.present();
    let dropdownEscolhido = evento.detail.value;
    this.arrayColaboradores = [];

    let dia1 = this.dataFim.getDate();
    let mes1 = this.dataFim.getMonth();
    let ano1 = this.dataFim.getFullYear();
    let stringData1 = mes1 + 1 + "-" + dia1 + "-" + ano1;

    let dia2 = this.dataInicio.getDate();
    let mes2 = this.dataInicio.getMonth();
    let ano2 = this.dataInicio.getFullYear();
    let stringData2 = mes2 + 1 + "-" + dia2 + "-" + ano2;

    if (dropdownEscolhido == "Todos") {
      this.PegarRelatoriosAssinaturas(this.dataFim, this.dataInicio);
    } else {
      this.RelatorioService.getRelatoriosAssinaturas(
        stringData1,
        stringData2
      ).subscribe((res) => {
        let todosCol: any = res;
        todosCol.servicosPorColaborador.forEach((element) => {
          if (element.nomeColaborador == dropdownEscolhido) {
            this.arrayColaboradores.push(element);
          }
          this.loadingService.dismiss();
        });
      });
    }
  }
}

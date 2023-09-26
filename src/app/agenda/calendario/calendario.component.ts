import { Component, OnInit, Output, EventEmitter, ViewChild, HostListener, Input, SimpleChanges, } from "@angular/core";
import { IonSlides, ModalController } from "@ionic/angular";
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";
import { DiasCorrecaoLangModel } from "../models/diasCorrecaoLangModel";
import { MesesModel } from "../models/mesesModel";
import { LoadingService } from "../../core/services/loading.service";
import { AgendaService } from "../services/agenda.service";
import { Day, addDays, prevDayOfWeek, nextDayOfWeek, firstDayOfMonth, lastDayOfMonth, } from "@progress/kendo-date-math";
import { DataToolbarComponent } from "app/financeiro/data-toolbar/data-toolbar.component";
import { DateUtils } from "app/core/common/data-type-utils/date-utils";
import { Subscription } from "rxjs";

  import { CalendarModalOptions, CalendarComponentOptions } from 'ion2-calendar-week'


@Component({
  selector: "app-calendario",
  templateUrl: "./calendario.component.html",
  styleUrls: ["./calendario.component.scss"],
})
export class CalendarioComponent implements OnInit {
  date: string;
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  optionsMulti: CalendarComponentOptions = {
    from: new Date(1),
    pickMode: 'single',
    displayMode: 'week',
    color: 'primary',
    monthPickerFormat: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'],
    weekdays: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    
    
    
  };
  @Input() parametrosLight: any;
  @Input() clientSchedule: boolean;

  @ViewChild("SwipedTabsSlider") SwipedTabsSlider: IonSlides;
  @ViewChild("SwipedTabsSlider2") SwipedTabsSlider2: IonSlides;

  @Output("dataSelecionada") dataSelecionada: EventEmitter<any> =
    new EventEmitter();

  @ViewChild(IonSlides, { static: false }) slides: IonSlides;
  public monthSelected: number = 0;
  public daysExibitionThirtyOne: Array<Array<number>> = new Array();
  public daysExibitionThirty: Array<Array<number>> = new Array();
  public daysExibitionTwentyEight: Array<Array<number>> = new Array();
  public dayClickedElement: any;
  public dateDay: number;
  public openCalendar: boolean = false;
  public calendarExtend: boolean = false;
  public SELECTED_DAY_BORDER_RADIUS = "20px";

  public upperLimitPeriod: any;
  public bottomLimitPeriod: any;

  public initializing: boolean = true;

  public storeSelection: any;

  public year = new Date().getFullYear();

  public fullDate: Date;

  public d: Date = new Date();

  public innerHeight: any;
  public innerWidth: any;
  public iOS: boolean;

  public agendamentos: any = [];
  public quantidadeAgendamentos: any = [];
  public quantidadeBloqueios: any = [];

  public diaHoje: Date = new Date();
  public quantSegunda: number = 0;
  public quantTerca: number = 0;
  public quantQuarta: number = 0;
  public quantQuinta: number = 0;
  public quantSexta: number = 0;
  public quantSabado: number = 0;
  public quantDomingo: number = 0;
  public fuso: any;
  public linguaPais: any;
  public numDayDomingo: number;
  public numDaySegunda: number;
  public numDayTerca: number;
  public numDayQuarta: number;
  public numDayQuinta: number;
  public numDaySexta: number;
  public numDaySabado: number;
  private subscriptionName: Subscription


  public calendarioInicial: any;

  slideOpts = {
    spaceBetween: 1, //tava -38 antes para não mostrar um pedaço do outro número
    slidesPerView: 1,
    slidesPerColumn: 1,
  };
  slideOptsExtend = {
    spaceBetween: 1, //tava -38 antes para não mostrar um pedaço do outro número
    slidesPerView: 1,
    slidesPerColumn: 6,
  };

  public daysCorrectLang: Array<DiasCorrecaoLangModel> =
    new Array<DiasCorrecaoLangModel>(); //array que irá conter os dias da semana no idioma do usuario
  public monthsList: Array<MesesModel> = new Array<MesesModel>();
  public DaysCheckEnglish; //array que irá conter os dias da semana em inglês

  // 31 dias --> 1 3 5 7 8 10 12
  // 30 dias --> 4 6 9 11
  // 28-29 dias --> 2
  thirtyOne = [
    { day: 1, belongsTo: true, belongsToPeriod: true },
    { day: 2, belongsTo: true, belongsToPeriod: true },
    { day: 3, belongsTo: true, belongsToPeriod: true },
    { day: 4, belongsTo: true, belongsToPeriod: true },
    { day: 5, belongsTo: true, belongsToPeriod: true },
    { day: 6, belongsTo: true, belongsToPeriod: true },
    { day: 7, belongsTo: true, belongsToPeriod: true },
    { day: 8, belongsTo: true, belongsToPeriod: true },
    { day: 9, belongsTo: true, belongsToPeriod: true },
    { day: 10, belongsTo: true, belongsToPeriod: true },
    { day: 11, belongsTo: true, belongsToPeriod: true },
    { day: 12, belongsTo: true, belongsToPeriod: true },
    { day: 13, belongsTo: true, belongsToPeriod: true },
    { day: 14, belongsTo: true, belongsToPeriod: true },
    { day: 15, belongsTo: true, belongsToPeriod: true },
    { day: 16, belongsTo: true, belongsToPeriod: true },
    { day: 17, belongsTo: true, belongsToPeriod: true },
    { day: 18, belongsTo: true, belongsToPeriod: true },
    { day: 19, belongsTo: true, belongsToPeriod: true },
    { day: 20, belongsTo: true, belongsToPeriod: true },
    { day: 21, belongsTo: true, belongsToPeriod: true },
    { day: 22, belongsTo: true, belongsToPeriod: true },
    { day: 23, belongsTo: true, belongsToPeriod: true },
    { day: 24, belongsTo: true, belongsToPeriod: true },
    { day: 25, belongsTo: true, belongsToPeriod: true },
    { day: 26, belongsTo: true, belongsToPeriod: true },
    { day: 27, belongsTo: true, belongsToPeriod: true },
    { day: 28, belongsTo: true, belongsToPeriod: true },
    { day: 29, belongsTo: true, belongsToPeriod: true },
    { day: 30, belongsTo: true, belongsToPeriod: true },
    { day: 31, belongsTo: true, belongsToPeriod: true },
  ];
  thirty = [
    { day: 1, belongsTo: true, belongsToPeriod: true },
    { day: 2, belongsTo: true, belongsToPeriod: true },
    { day: 3, belongsTo: true, belongsToPeriod: true },
    { day: 4, belongsTo: true, belongsToPeriod: true },
    { day: 5, belongsTo: true, belongsToPeriod: true },
    { day: 6, belongsTo: true, belongsToPeriod: true },
    { day: 7, belongsTo: true, belongsToPeriod: true },
    { day: 8, belongsTo: true, belongsToPeriod: true },
    { day: 9, belongsTo: true, belongsToPeriod: true },
    { day: 10, belongsTo: true, belongsToPeriod: true },
    { day: 11, belongsTo: true, belongsToPeriod: true },
    { day: 12, belongsTo: true, belongsToPeriod: true },
    { day: 13, belongsTo: true, belongsToPeriod: true },
    { day: 14, belongsTo: true, belongsToPeriod: true },
    { day: 15, belongsTo: true, belongsToPeriod: true },
    { day: 16, belongsTo: true, belongsToPeriod: true },
    { day: 17, belongsTo: true, belongsToPeriod: true },
    { day: 18, belongsTo: true, belongsToPeriod: true },
    { day: 19, belongsTo: true, belongsToPeriod: true },
    { day: 20, belongsTo: true, belongsToPeriod: true },
    { day: 21, belongsTo: true, belongsToPeriod: true },
    { day: 22, belongsTo: true, belongsToPeriod: true },
    { day: 23, belongsTo: true, belongsToPeriod: true },
    { day: 24, belongsTo: true, belongsToPeriod: true },
    { day: 25, belongsTo: true, belongsToPeriod: true },
    { day: 26, belongsTo: true, belongsToPeriod: true },
    { day: 27, belongsTo: true, belongsToPeriod: true },
    { day: 28, belongsTo: true, belongsToPeriod: true },
    { day: 29, belongsTo: true, belongsToPeriod: true },
    { day: 30, belongsTo: true, belongsToPeriod: true },
  ];
  twentyEight = [
    { day: 1, belongsTo: true, belongsToPeriod: true },
    { day: 2, belongsTo: true, belongsToPeriod: true },
    { day: 3, belongsTo: true, belongsToPeriod: true },
    { day: 4, belongsTo: true, belongsToPeriod: true },
    { day: 5, belongsTo: true, belongsToPeriod: true },
    { day: 6, belongsTo: true, belongsToPeriod: true },
    { day: 7, belongsTo: true, belongsToPeriod: true },
    { day: 8, belongsTo: true, belongsToPeriod: true },
    { day: 9, belongsTo: true, belongsToPeriod: true },
    { day: 10, belongsTo: true, belongsToPeriod: true },
    { day: 11, belongsTo: true, belongsToPeriod: true },
    { day: 12, belongsTo: true, belongsToPeriod: true },
    { day: 13, belongsTo: true, belongsToPeriod: true },
    { day: 14, belongsTo: true, belongsToPeriod: true },
    { day: 15, belongsTo: true, belongsToPeriod: true },
    { day: 16, belongsTo: true, belongsToPeriod: true },
    { day: 17, belongsTo: true, belongsToPeriod: true },
    { day: 18, belongsTo: true, belongsToPeriod: true },
    { day: 19, belongsTo: true, belongsToPeriod: true },
    { day: 20, belongsTo: true, belongsToPeriod: true },
    { day: 21, belongsTo: true, belongsToPeriod: true },
    { day: 22, belongsTo: true, belongsToPeriod: true },
    { day: 23, belongsTo: true, belongsToPeriod: true },
    { day: 24, belongsTo: true, belongsToPeriod: true },
    { day: 25, belongsTo: true, belongsToPeriod: true },
    { day: 26, belongsTo: true, belongsToPeriod: true },
    { day: 27, belongsTo: true, belongsToPeriod: true },
    { day: 28, belongsTo: true, belongsToPeriod: true },
  ];

  public userLang: any;
  public user: any;
  public messageReceived: any;
  public semProfissional: any = false;

  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

  }

  constructor(
    public translate: TranslateService,
    private LoadingService: LoadingService,
    private agendaService: AgendaService,
    private modalController: ModalController
  ) {
    this.subscriptionName = this.agendaService.getUpdate().subscribe
      (message => { //message contains the data sent from service


        if (message.data == 0) {
          this.semProfissional = true;
        }
        else {
          var data = new Date(message.data);
          this.semProfissional = false;
          if (localStorage.getItem('one.tipologin') != 'cliente') {
            this.quantidadeAgendamentosProfissional(data, message.profId);
            this.quantidadeBloqueiosProfissional(data, message.profId);
          }
        }

      }
      )

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.parametrosLight) {
      if (
        changes.parametrosLight.previousValue !=
        changes.parametrosLight.currentValue
      ) {
        if (changes.parametrosLight.currentValue != undefined) {
          this.parametrosLight = changes.parametrosLight.currentValue;

          this.upperLimitPeriod = this.addDays(
            new Date(),
            this.parametrosLight.limiteMarcacaoAgenda
          );
          this.bottomLimitPeriod = this.addDays(
            new Date(),
            -this.parametrosLight.limiteMarcacaoAgenda
          );
        }
      }
    }
  }
  onChange($event) {
    console.log($event);
  }

  ngAfterViewChecked() {
    setTimeout(() => {
      if (this.slides) {
        this.slides.update();
      }
    }, 1000);
  }

  async ngOnInit() {


    if (localStorage.getItem('diaAtualCalendario') == null || localStorage.getItem('diaAtualCalendario') == undefined) {
      localStorage.setItem('diaAtualCalendario', new Date().toDateString())
    }
    localStorage.setItem('diaAtualCalendario', new Date().toDateString())

    this.calendarioInicial = localStorage.getItem('calendarioExpandido')

    if (this.calendarioInicial != null || this.calendarioInicial != undefined) {
      if (this.calendarioInicial == '1') {
        this.expandirCalendario()
      }
    }
    else {
      localStorage.setItem('calendarioExpandido', '0')
    }
    let user = JSON.parse(localStorage.getItem("one.user"));
    let filial = user.authenticatedBranch;
    this.fuso = parseInt(filial.fuso, 10);
    this.linguaPais = filial.linguaPais;
    if (
      this.fuso != undefined &&
      this.fuso != null &&
      this.linguaPais == "ja-JP"
    ) {
      this.diaHoje.setHours(this.diaHoje.getHours() + this.fuso);
    }
    if (localStorage.getItem('one.tipologin') != 'cliente') {

      await this.quantidadeAgendamentosProfissional(this.diaHoje);
      await this.quantidadeBloqueiosProfissional(this.diaHoje);
    }




    this.iOS = this.detectiOS();
    this.getScreenSize();
    this.userLang = localStorage.getItem("one.lang");
    this.user = localStorage.getItem("one.tipologin");

    await this.translate
      ?.get("AGENDA.CALENDARIO.DOMINGO")
      .subscribe((translated: string) => {
        //essa função garante que as traduções ja foram caregadas, para só assim ser chamado o translate.instant()
        this.daysCorrectLang = [
          {
            text: this.translate?.instant("AGENDA.CALENDARIO.DOMINGO"),
          },
          {
            text: this.translate?.instant("AGENDA.CALENDARIO.SEGUNDA"),
          },
          {
            text: this.translate?.instant("AGENDA.CALENDARIO.TERCA"),
          },
          {
            text: this.translate?.instant("AGENDA.CALENDARIO.QUARTA"),
          },
          {
            text: this.translate?.instant("AGENDA.CALENDARIO.QUINTA"),
          },
          {
            text: this.translate?.instant("AGENDA.CALENDARIO.SEXTA"),
          },
          {
            text: this.translate?.instant("AGENDA.CALENDARIO.SABADO"),
          },
        ];

        this.monthsList = [
          {
            value: 1,
            name: this.translate?.instant("AGENDA.CALENDARIO.JANEIRO"),
          },
          {
            value: 2,
            name: this.translate?.instant("AGENDA.CALENDARIO.FEVEREIRO"),
          },
          {
            value: 3,
            name: this.translate?.instant("AGENDA.CALENDARIO.MARCO"),
          },
          {
            value: 4,
            name: this.translate?.instant("AGENDA.CALENDARIO.ABRIL"),
          },
          {
            value: 5,
            name: this.translate?.instant("AGENDA.CALENDARIO.MAIO"),
          },
          {
            value: 6,
            name: this.translate?.instant("AGENDA.CALENDARIO.JUNHO"),
          },
          {
            value: 7,
            name: this.translate?.instant("AGENDA.CALENDARIO.JULHO"),
          },
          {
            value: 8,
            name: this.translate?.instant("AGENDA.CALENDARIO.AGOSTO"),
          },
          {
            value: 9,
            name: this.translate?.instant("AGENDA.CALENDARIO.SETEMBRO"),
          },
          {
            value: 10,
            name: this.translate?.instant("AGENDA.CALENDARIO.OUTUBRO"),
          },
          {
            value: 11,
            name: this.translate?.instant("AGENDA.CALENDARIO.NOVEMBRO"),
          },
          {
            value: 12,
            name: this.translate?.instant("AGENDA.CALENDARIO.DEZEMBRO"),
          },
        ];

        this.monthSelected = this.d.getMonth();

        if (this.slides != null) {
          this.slides.update();
        }

        this.generateListOfDays();
      });
  }

  detectiOS() {
    if (
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i)
    )
      return true;
    else return false;
  }
  expandirCalendario() {

    var dataI = new Date(localStorage.getItem('diaAtualCalendario'));
    if (!this.openCalendar) {
      document.getElementById("setaEsquerda").style.visibility = "hidden";
      document.getElementById("setaDireita").style.visibility = "hidden";
      if (dataI.getMonth() == 6 || dataI.getMonth() == 9 || dataI.getMonth() == 0) {
        document.getElementById("calendarioExtendido").style.height = "355px";
      } else {
        document.getElementById("calendarioExtendido").style.height = "315px";
      }
      document.getElementById("calendarioMinimizado").style.visibility =
        "hidden";
      document.getElementById("calendarioMinimizado").style.position =
        "absolute";
      this.openCalendar = true;
      localStorage.setItem('calendarioExpandido', '1')
      this.voltarParaDiaSelecionadoExtendido(new Date(localStorage.getItem('diaAtualCalendario')))
    } else {
      document.getElementById("setaEsquerda").style.visibility = "inherit";
      document.getElementById("setaDireita").style.visibility = "inherit";
      document.getElementById("calendarioExtendido").style.height = "150px";
      document.getElementById("calendarioMinimizado").style.visibility =
        "inherit";
      document.getElementById("calendarioMinimizado").style.position =
        "relative";
      this.openCalendar = false;
      localStorage.setItem('calendarioExpandido', '0')
      this.voltarParaDiaSelecionado(new Date(localStorage.getItem('diaAtualCalendario')))
    }
  }

  selectedDay(event: any, i: number, day: any) {
    //debugger

    if (day.trocarMes == undefined && (day?.belongsTo == false || day?.belongsToPeriod == false) && localStorage.getItem('one.tipologin') == 'cliente') {
      return;
    }

    if (day?.trocarMes || day?.belongsTo == false || day?.belongsToPeriod == false) {
      if (day.day < 10) {
        var dateAtual = new Date(
          this.year,
          this.monthSelected + 1,
          day.day,
          0,
          0,
          0,
          0
        );
        this.nextMonth(dateAtual);
      } else {
        var dateAtual = new Date(
          this.year,
          this.monthSelected - 1,
          day.day,
          0,
          0,
          0,
          0
        );
        this.previousMonth(dateAtual);
      }
    } else if (this.clientSchedule != undefined) {
      if (this.clientSchedule == true && day.belongsToPeriod == false) {
        return;
      }
    }

    //Lógica para pegar o elemento event.target certo
    var parent = event.target;
    while (parent && parent.id !== "col") {
      parent = parent.parentElement;
    }
    if (
      this.dayClickedElement != undefined &&
      this.dayClickedElement != null &&
      parent != this.dayClickedElement
    ) {
      this.dayClickedElement.style.border = "none";
      this.dayClickedElement.style.borderRadius = "none";
      for (let i = 0; i <= this.dayClickedElement.classList?.length; i++) {
        if (this.dayClickedElement.classList[i] == "today") {
          this.dayClickedElement.style.color = "var(--cor-calendario-diaHoje)";
          parent.style.color = "var(--cor-calendario-principal)";
          break

        } else if (
          this.dayClickedElement.style.color != "var(--cor-calendario-secundaria)"
        ) {
          this.dayClickedElement.style.color = "var(--cor-calendario-secundaria)";
          if (parent.style.color != "var(--cor-calendario-principal)") {
            parent.style.color = "var(--cor-calendario-principal)";
          }

        }
        if (parent.classList[i] == "today") {
          parent.style.color = "var(--cor-calendario-diaHoje)"
        }
      }

      this.dayClickedElement.style.fontWeight = "bold";
      parent.style.border = "2px solid var(--cor-calendario-principal)";
      parent.style.borderRadius = this.SELECTED_DAY_BORDER_RADIUS;

      parent.style.fontWeight = "bold";
      this.dayClickedElement = parent;
    } else if (
      this.dayClickedElement == undefined ||
      this.dayClickedElement == null
    ) {
      parent.style.border = "2px solid var(--cor-calendario-principal)";
      parent.style.borderRadius = this.SELECTED_DAY_BORDER_RADIUS;

      for (let i = 0; i < parent.classList?.length; i++) {
        if (parent.classList[i] == "today") {
          parent.style.color = "var(--cor-calendario-diaHoje)";
          break;
        } else if (parent.style.color != "var(--cor-calendario-secundaria)") {
          parent.style.color = "var(--cor-calendario-principal)";
        }
      }

      parent.style.fontWeight = "bold";
      this.dayClickedElement = parent;
    }
    this.dateDay = day.day;

    this.getSlideAndColumnIndex();

    this.fullDate = new Date( this.year, this.monthSelected, this.dateDay, 0, 0, 0, 0 );
    if (this.calendarExtend) {
      this.voltarParaDiaSelecionado(this.fullDate);
      return;
    }

    localStorage.setItem('diaAtualCalendario', this.fullDate.toDateString())
    this.sendDate();
  }

  async selectDayStored(slideIndex: number, index: number, today?: boolean) {
    //function responsible for handle the style of the day selected when the month is changed

    await setTimeout(async () => {


      let slideForSelection = document.getElementsByTagName("ion-slide")[slideIndex] as HTMLElement;
      if (slideForSelection == undefined){
        return
      }

      if (localStorage.getItem('calendarioExpandido') == '1') {
        var slideAux = document.querySelectorAll("[id='calendarioE']");
        slideForSelection = slideAux[slideIndex] as HTMLElement;
      }
      //debugger
      let dayForSelection = (await slideForSelection.getElementsByClassName(
        "daySelection"
      )[index]) as HTMLElement;
      //let dayForSelection = document.getElementsByClassName('daySelection')[index] as HTMLElement
      dayForSelection.style.border =
        "2px solid var(--cor-calendario-principal)";
      dayForSelection.style.borderRadius = this.SELECTED_DAY_BORDER_RADIUS;
      if (today) {
        dayForSelection.style.color = "var(--cor-calendario-diaHoje)";
      } else {
        dayForSelection.style.color = "var(--cor-calendario-principal)";
      }

      dayForSelection.style.fontWeight = "bold";

      if (localStorage.getItem('calendarioExpandido') == '1') {
        this.SwipedTabsSlider2.slideTo(slideIndex);
      }
      else {
        this.SwipedTabsSlider.slideTo(slideIndex)
      }

      this.dayClickedElement = dayForSelection;
      await this.quantidadeAgendamentosProfissional(
        new Date(this.year, this.monthSelected, 1)
      );

    }, 500);
  }

  async nextMonth(dataAtual?: any) {

    this.dayClickedElement = null;
    if (this.monthSelected < 11) {
      this.monthSelected++;
    } else if (this.monthSelected == 11) {
      this.year = this.year + 1;
      this.monthSelected = 0;
    }
    await this.quantidadeAgendamentosProfissional(
      new Date(this.year, this.monthSelected, 1)
    );
    this.generateListOfDays();
    if (this.monthSelected == this.storeSelection.month) {
      this.selectDayStored(
        this.storeSelection.slideIndex,
        this.storeSelection.columnIndex
      ); //event: any, i: number, day: any)
    } else {
      if (localStorage.getItem('calendarioExpandido') == '1') {
        this.SwipedTabsSlider2.slideTo(0);
      }
      else {
        this.SwipedTabsSlider.slideTo(0)
      }

      //this.encontrarDiaUm()
    }


    if (this.openCalendar) {
      if (this.monthSelected == 6 || this.monthSelected == 9 || this.monthSelected == 0) {
        document.getElementById("calendarioExtendido").style.height = "355px";
      } else {
        document.getElementById("calendarioExtendido").style.height = "315px";
      }
    }
    if (dataAtual != undefined || dataAtual != null) {
      this.voltarParaDiaSelecionado(dataAtual);
      return;
    }
  }

  async voltarParaHoje() {

    setTimeout(async () => {

      var today = new Date();
      var found = false;
      var columnIndex: number;
      var slideIndex: number;

      if (this.monthSelected == today.getMonth()) {
        this.dayClickedElement.style.border = "none";
        this.dayClickedElement.style.borderRadius = "none";
        this.dayClickedElement.style.color = 'var(--cor-calendario-secundaria)';
      }

      this.year = today.getFullYear();
      this.monthSelected = today.getMonth();
      this.generateListOfDays();

      for (
        let i = 0;
        i < this.monthsList[this.monthSelected].days?.length;
        i++
      ) {
        for (
          let j = 0;
          j < this.monthsList[this.monthSelected].days[i]?.length;
          j++
        ) {
          if (
            this.monthsList[this.monthSelected].days[i][j].day ==
            today.getDate() &&
            this.monthsList[this.monthSelected].days[i][j].belongsTo == true
          ) {
            found = true;
            this.dateDay = today.getDate();
            columnIndex = j;
            slideIndex = i;
            //this.SwipedTabsSlider.slideTo(i);
            break;
          }
        }
        if (found == true) {
          break;
        }
      }
      this.storeSelection = {
        slideIndex: slideIndex,
        columnIndex: columnIndex,
        month: this.monthSelected,
      };
      this.selectDayStored(slideIndex, columnIndex, true);

      this.fullDate = new Date(
        this.year,
        this.monthSelected,
        this.dateDay,
        0,
        0,
        0,
        0
      );
      if (this.openCalendar) {
        if (new Date().getMonth() == 6 || new Date().getMonth() == 9 || new Date().getMonth() == 0) {
          document.getElementById("calendarioExtendido").style.height = "355px";
        } else {
          document.getElementById("calendarioExtendido").style.height = "315px";
        }
      }
      localStorage.setItem('diaAtualCalendario', new Date().toDateString())
      this.sendDate();
      await this.quantidadeAgendamentosProfissional(today);
    }, 500);
  }

  voltarParaDiaSelecionado(day: Date) {
    setTimeout(async () => {
      var today = day;
      var found = false;
      var columnIndex: number;
      var slideIndex: number;

      if (this.monthSelected == today.getMonth()) {
        this.dayClickedElement.style.border = "none";
        this.dayClickedElement.style.borderRadius = "none";
        this.dayClickedElement.style.color = "var(--cor-calendario-secundaria)";
      }

      this.year = today.getFullYear();
      this.monthSelected = today.getMonth();
      this.generateListOfDays();

      for (
        let i = 0;
        i < this.monthsList[this.monthSelected].days?.length;
        i++
      ) {
        for (
          let j = 0;
          j < this.monthsList[this.monthSelected].days[i]?.length;
          j++
        ) {
          if (
            this.monthsList[this.monthSelected].days[i][j].day ==
            today.getDate() &&
            this.monthsList[this.monthSelected].days[i][j].belongsTo == true
          ) {
            found = true;
            this.dateDay = today.getDate();
            columnIndex = j;
            slideIndex = i;
            //this.SwipedTabsSlider.slideTo(i);
            break;
          }
        }
        if (found == true) {
          break;
        }
      }
      this.storeSelection = {
        slideIndex: slideIndex,
        columnIndex: columnIndex,
        month: this.monthSelected,
      };

      var dateToday = new Date(new Date().setHours(0, 0, 0, 0)).toDateString();
      var aux = today.toDateString();
      if (aux == dateToday) {
        this.selectDayStored(slideIndex, columnIndex, true);
      }
      else {
        this.selectDayStored(slideIndex, columnIndex);
      }

      this.fullDate = new Date(
        this.year,
        this.monthSelected,
        this.dateDay,
        0,
        0,
        0,
        0
      );
      this.sendDate();
      await this.quantidadeAgendamentosProfissional(today);
    }, 500);
  }

  voltarParaDiaSelecionadoExtendido(day: Date) {
    setTimeout(async () => {

      var today = day;
      var found = false;
      var columnIndex: number;
      var slideIndex: number;

      if (this.monthSelected == today.getMonth() && this.dayClickedElement != null && this.dayClickedElement != undefined) {
        this.dayClickedElement.style.border = "none";
        this.dayClickedElement.style.borderRadius = "none";
        this.dayClickedElement.style.color = "var(--cor-calendario-secundaria)";
      }

      this.year = today.getFullYear();
      this.monthSelected = today.getMonth();
      this.generateListOfDays();

      for (
        let i = 0;
        i < this.monthsList[this.monthSelected].days?.length;
        i++
      ) {
        for (
          let j = 0;
          j < this.monthsList[this.monthSelected].days[i]?.length;
          j++
        ) {
          if (
            this.monthsList[this.monthSelected].days[i][j].day ==
            today.getDate() &&
            this.monthsList[this.monthSelected].days[i][j].belongsTo == true
          ) {
            found = true;
            this.dateDay = today.getDate();
            columnIndex = j;
            slideIndex = i;
            //this.SwipedTabsSlider.slideTo(i);
            break;
          }
        }
        if (found == true) {
          break;
        }
      }
      this.storeSelection = {
        slideIndex: slideIndex,
        columnIndex: columnIndex,
        month: this.monthSelected,
      };



      var dateToday = new Date(new Date().setHours(0, 0, 0, 0)).toDateString();
      var aux = today.toDateString();
      if (aux == dateToday) {
        this.selectDayStored(slideIndex, columnIndex, true);
      }
      else {
        this.selectDayStored(slideIndex, columnIndex);
      }


      this.fullDate = new Date(
        this.year,
        this.monthSelected,
        this.dateDay,
        0,
        0,
        0,
        0
      );
      this.sendDate();
      await this.quantidadeAgendamentosProfissional(today);
    }, 500);
  }

  encontrarDiaUm() {
    setTimeout(() => {
      var found = false;
      var slideIndex: number;
      for (
        let i = 0;
        i < this.monthsList[this.monthSelected].days?.length;
        i++
      ) {
        for (
          let j = 0;
          j < this.monthsList[this.monthSelected].days[i]?.length;
          j++
        ) {
          if (
            this.monthsList[this.monthSelected].days[i][j].day == 1 &&
            this.monthsList[this.monthSelected].days[i][j].belongsTo == true
          ) {
            found = true;
            slideIndex = i;
            break;
          }
        }
        if (found == true) {
          break;
        }
      }
      if (localStorage.getItem('calendarioExpandido') == '1') {
        this.SwipedTabsSlider2.slideTo(slideIndex);
      }
      else {
        this.SwipedTabsSlider.slideTo(slideIndex)
      }
    }, 500);
  }

  async previousMonth(dataAtual?: any) {
    if (this.monthSelected > 0) {
      this.monthSelected--;
    } else if (this.monthSelected == 0) {
      this.year = this.year - 1;
      this.monthSelected = 11;
    }

    await this.generateListOfDays();
    if (this.monthSelected == this.storeSelection.month) {
      this.selectDayStored(
        this.storeSelection.slideIndex,
        this.storeSelection.columnIndex
      ); //event: any, i: number, day: any)
    } else {
      if (localStorage.getItem('calendarioExpandido') == '1') {
        this.SwipedTabsSlider2.slideTo((await this.SwipedTabsSlider2?.length()) - 1);
      }
      else {
        this.SwipedTabsSlider.slideTo((await this.SwipedTabsSlider?.length()) - 1);
      }
      await this.quantidadeAgendamentosProfissional(
        new Date(this.year, this.monthSelected, 1)
      );
    }

    if (this.openCalendar) {
      if (this.monthSelected == 6 || this.monthSelected == 9) {
        document.getElementById("calendarioExtendido").style.height = "355px";
      } else {
        document.getElementById("calendarioExtendido").style.height = "315px";
      }
    }
    if (dataAtual != undefined || dataAtual != null) {
      this.voltarParaDiaSelecionado(dataAtual);
      return;
    }
  }

  async generateListOfDays() {
    //debugger
    var temparray: any;
    var i,
      j = 10;
    var chunk = 7;

    if (this.monthsList[this.monthSelected]["days"] == undefined) {
      var dateControl = new Date(this.year, this.monthSelected, 1, 0, 0, 0, 0);
      let weekDay = dateControl.toLocaleString(
        this.userLang != null
          ? this.userLang?.substr(0, 2)
          : window.navigator.language,
        { weekday: "long" }
      );
      let index = 0;
      for (let i = 0; i < this.daysCorrectLang?.length; i++) {
        if (
          this.daysCorrectLang[i].text.toLowerCase() == weekDay.toLowerCase()
        ) {
          index = i;
          break;
        }
      }

      //JSON.parse(JSON.stringify(this.listaHorariosDisponiveisControl)); usar para copia profunda

      if (
        this.monthsList[this.monthSelected].value == 1 ||
        this.monthsList[this.monthSelected].value == 3 ||
        this.monthsList[this.monthSelected].value == 5 ||
        this.monthsList[this.monthSelected].value == 7 ||
        this.monthsList[this.monthSelected].value == 8 ||
        this.monthsList[this.monthSelected].value == 10 ||
        this.monthsList[this.monthSelected].value == 12
      ) {
        let thirtyOneCOPY = JSON.parse(JSON.stringify(this.thirtyOne)); //copia profunda para não alterar o original
        let daysExibiTionthirtyOneCOPY: Array<Array<any>> = new Array();

        thirtyOneCOPY = this.fillPreviousMonthDaysInterval(
          index,
          thirtyOneCOPY
        );

        for (i = 0, j = thirtyOneCOPY?.length; i < j; i += chunk) {
          temparray = thirtyOneCOPY.slice(i, i + chunk);
          daysExibiTionthirtyOneCOPY.push(temparray);
          // do whatever
        }

        let k = 1;
        while (
          daysExibiTionthirtyOneCOPY[daysExibiTionthirtyOneCOPY?.length - 1]
            ?.length != 7
        ) {
          daysExibiTionthirtyOneCOPY[
            daysExibiTionthirtyOneCOPY?.length - 1
          ].push({ day: k, belongsTo: false });
          k++;
        }

        this.monthsList[this.monthSelected]["days"] = JSON.parse(
          JSON.stringify(daysExibiTionthirtyOneCOPY)
        );
      } else if (
        this.monthsList[this.monthSelected].value == 4 ||
        this.monthsList[this.monthSelected].value == 6 ||
        this.monthsList[this.monthSelected].value == 9 ||
        this.monthsList[this.monthSelected].value == 11
      ) {
        let thirtyCOPY = JSON.parse(JSON.stringify(this.thirty)); //copia profunda para não alterar o original
        let daysExibitionThirtyCOPY: Array<Array<any>> = new Array();

        thirtyCOPY = this.fillPreviousMonthDaysInterval(index, thirtyCOPY);

        for (i = 0, j = thirtyCOPY?.length; i < j; i += chunk) {
          temparray = thirtyCOPY.slice(i, i + chunk);
          daysExibitionThirtyCOPY.push(temparray);
        }

        let k = 1;
        while (
          daysExibitionThirtyCOPY[daysExibitionThirtyCOPY?.length - 1]?.length !=
          7
        ) {
          daysExibitionThirtyCOPY[daysExibitionThirtyCOPY?.length - 1].push({
            day: k,
            belongsTo: false,
          });
          k++;
        }

        this.monthsList[this.monthSelected]["days"] = JSON.parse(
          JSON.stringify(daysExibitionThirtyCOPY)
        );
      } else {
        let twentyEightCOPY = JSON.parse(JSON.stringify(this.twentyEight)); //copia profunda para não alterar o original
        let daysExibitionTwentyEightCOPY: Array<Array<any>> = new Array();

        twentyEightCOPY = this.fillPreviousMonthDaysInterval(
          index,
          twentyEightCOPY
        );

        for (i = 0, j = twentyEightCOPY?.length; i < j; i += chunk) {
          temparray = twentyEightCOPY.slice(i, i + chunk);
          daysExibitionTwentyEightCOPY.push(temparray);
        }
        let k = 1;
        while (
          daysExibitionTwentyEightCOPY[daysExibitionTwentyEightCOPY?.length - 1]
            ?.length != 7
        ) {
          daysExibitionTwentyEightCOPY[
            daysExibitionTwentyEightCOPY?.length - 1
          ].push({ day: k, belongsTo: false });
          k++;
        }

        this.monthsList[this.monthSelected]["days"] = JSON.parse(
          JSON.stringify(daysExibitionTwentyEightCOPY)
        );
      }

      //chamar a função de scrollintoview
      if (this.initializing == true) {
        this.initializing = false;
        this.scrollWhenLoaded();
      }
    } else {
      return;
    }

    if (this.clientSchedule == true) {
      await this.checkDayBelongsToPeriod();
    }
  }

  updateIndicatorPosition() { }

  fillPreviousMonthDaysInterval(index: number, daysList: any) {
    if (
      this.monthsList[this.monthSelected].value == 1 ||
      (this.monthSelected - 1 != -1 &&
        (this.monthsList[this.monthSelected - 1].value == 1 ||
          this.monthsList[this.monthSelected - 1].value == 3 ||
          this.monthsList[this.monthSelected - 1].value == 5 ||
          this.monthsList[this.monthSelected - 1].value == 7 ||
          this.monthsList[this.monthSelected - 1].value == 8 ||
          this.monthsList[this.monthSelected - 1].value == 10 ||
          this.monthsList[this.monthSelected - 1].value == 12))
    ) {
      for (let j = 31; j > 31 - index; j--) {
        //adiciono zeros nas primeiras posições do array para marcar no template como dia vazio
        daysList.unshift({ day: j, belongsTo: false });
      }
    } else if (
      this.monthSelected - 1 != -1 &&
      (this.monthsList[this.monthSelected - 1].value == 4 ||
        this.monthsList[this.monthSelected - 1].value == 6 ||
        this.monthsList[this.monthSelected - 1].value == 9 ||
        this.monthsList[this.monthSelected - 1].value == 11)
    ) {
      for (let j = 30; j > 30 - index; j--) {
        //adiciono zeros nas primeiras posições do array para marcar no template como dia vazio
        daysList.unshift({ day: j, belongsTo: false });
      }
    } else if (this.monthSelected - 1 != -1) {
      //fevereiro
      for (let j = 28; j > 28 - index; j--) {
        //adiciono zeros nas primeiras posições do array para marcar no template como dia vazio
        daysList.unshift({ day: j, belongsTo: false });
      }
    }

    return daysList;
  }

  animateIndicator(event: any) { }

  async previousWeek() {
    if ((await this.SwipedTabsSlider.getActiveIndex()) == 0) {
      this.previousMonth();
    } else {
      this.SwipedTabsSlider.slidePrev();
    }
  }

  async nextWeek() {
    if (
      (await this.SwipedTabsSlider.getActiveIndex()) ==
      (await this.SwipedTabsSlider?.length()) - 1
    ) {
      this.nextMonth();
    } else {
      this.SwipedTabsSlider.slideNext();
    }
  }

  sendDate() {

    this.dataSelecionada.emit(this.fullDate.toISOString());
  }

  scrollWhenLoaded() {
    setTimeout(() => {
      var today = new Date();
      var found = false;
      var columnIndex: number;
      var slideIndex: number;
      for (
        let i = 0;
        i < this.monthsList[this.monthSelected].days?.length;
        i++
      ) {
        for (
          let j = 0;
          j < this.monthsList[this.monthSelected].days[i]?.length;
          j++
        ) {
          if (
            this.monthsList[this.monthSelected].days[i][j].day ==
            today.getDate() &&
            this.monthsList[this.monthSelected].days[i][j].belongsTo == true
          ) {
            this.monthsList[this.monthSelected].days[i][j]["today"] = true;
            found = true;
            columnIndex = j;
            slideIndex = i;
            break;
          }
        }
        if (found == true) {
          break;
        }
      }
      this.storeSelection = {
        slideIndex: slideIndex,
        columnIndex: columnIndex,
        month: this.monthSelected,
      };
      this.selectDayStored(slideIndex, columnIndex, true);
    }, 500);
  }

  getSlideAndColumnIndex() {
    var day: any = new Date();
    if (this.dateDay) {
      day = this.dateDay;
    } else {
      day = day.getDate();
    }
    var found = false;
    var columnIndex: number;
    var slideIndex: number;
    for (let i = 0; i < this.monthsList[this.monthSelected].days?.length; i++) {
      for (
        let j = 0;
        j < this.monthsList[this.monthSelected].days[i]?.length;
        j++
      ) {
        if (
          this.monthsList[this.monthSelected].days[i][j].day == day &&
          this.monthsList[this.monthSelected].days[i][j].belongsTo == true
        ) {
          found = true;
          columnIndex = j;
          slideIndex = i;
          break;
        }
      }
      if (found == true) {
        break;
      }
    }
    this.storeSelection = {
      slideIndex: slideIndex,
      columnIndex: columnIndex,
      month: this.monthSelected,
    };
  }

  addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  checkDayBelongsToPeriod() {
//debugger
    let date = new Date();

    if (this.monthSelected < date.getMonth() && this.year < date.getFullYear()) {
      for (let i = 0; i < this.monthsList[this.monthSelected].days?.length; i++) {
        for (let j = 0; j < this.monthsList[this.monthSelected].days[i]?.length; j++) {
          if (new Date(this.year, this.monthSelected, this.monthsList[this.monthSelected].days[i][j].day, 0, 0, 0, 0)
            < this.addDays(date, -this.parametrosLight.limiteMarcacaoAgenda) || this.quantidadeAgendamentos[j].feriado == true) {

            this.monthsList[this.monthSelected].days[i][j].belongsToPeriod = false;
          } else {
            var diaVerificarFeriado = this.quantidadeAgendamentos.find((c) =>
              new Date(c.dia.substring(0, 10)).getDate() + 1 ==
              new Date(this.year, this.monthSelected, this.monthsList[this.monthSelected].days[i][j].day, 0, 0, 0, 0).getDate());
            if (diaVerificarFeriado != undefined && diaVerificarFeriado.feriado) {

              this.monthsList[this.monthSelected].days[i][j].belongsToPeriod = false;
            }
          }
          if (new Date(this.year, this.monthSelected, this.monthsList[this.monthSelected].days[i][j].day, 0, 0, 0, 0)
            > this.addDays(date, -this.parametrosLight.limiteMarcacaoAgenda) || this.quantidadeAgendamentos[j].feriado == true) {

            this.monthsList[this.monthSelected].days[i][j].belongsToPeriod = false;
          }
        }
      }
    } else if (this.monthSelected > date.getMonth() || this.year > date.getFullYear()) {
      for (
        let i = 0;
        i < this.monthsList[this.monthSelected].days?.length;
        i++
      ) {
        for (
          let j = 0;
          j < this.monthsList[this.monthSelected].days[i]?.length;
          j++
        ) {
          if (new Date(this.year, this.monthSelected, this.monthsList[this.monthSelected].days[i][j].day, 0, 0, 0, 0) >
            this.addDays(date, this.parametrosLight.limiteMarcacaoAgenda || this.quantidadeAgendamentos[j].feriado == true)) {
            this.monthsList[this.monthSelected].days[i][j].belongsToPeriod =
              false;
          }
          else {
            var diaVerificarFeriado = this.quantidadeAgendamentos.find((c) => new Date(c.dia.substring(0, 10)).getDate() + 1 ==
              new Date(this.year, this.monthSelected, this.monthsList[this.monthSelected].days[i][j].day, 0, 0, 0, 0).getDate());
            if (
              diaVerificarFeriado != undefined &&
              diaVerificarFeriado.feriado
            ) {

              this.monthsList[this.monthSelected].days[i][j].belongsToPeriod = false;
            }

          }
          if (localStorage.getItem('one.tipologin') == 'cliente' && i == 0) {
            //debugger
            var dataLimite = this.addDays(date, this.parametrosLight.limiteMarcacaoAgenda || this.quantidadeAgendamentos[j].feriado == true)



            var dataaux = new Date(this.year, this.monthSelected, this.monthsList[this.monthSelected].days[i][j].day, 0, 0, 0, 0).getDate()
            var dataaux2 = date.getDate()
            var dateToday = new Date(this.year, this.monthSelected - 1, new Date().getDate(), 0, 0, 0, 0)

            if (dataaux > dataaux2) {
              dataaux = this.monthSelected - 1 == 1 && dataaux >= 28 ? 28 : dataaux
              dataaux = (this.monthSelected - 1 == 3 || this.monthSelected - 1 == 5 || this.monthSelected - 1 == 8 || this.monthSelected - 1 == 10) && dataaux == 31 ? dataaux = 30 : dataaux
               
              var dataComparar = new Date(this.year, this.monthSelected - 1, dataaux, 0, 0, 0, 0)
            }
            else {
              //debugger
              var dataComparar = new Date(this.year, this.monthSelected + 1, dataaux, 0, 0, 0, 0)
            }
            if (dataComparar > dateToday && dataComparar < dataLimite) {
//debugger
              this.monthsList[this.monthSelected].days[i][j].trocarMes = true;
            }
          }
        }
      }
    } else {
      for (
        let i = 0;
        i < this.monthsList[this.monthSelected].days?.length;
        i++
      ) {
        for (
          let j = 0;
          j < this.monthsList[this.monthSelected].days[i]?.length;
          j++
        ) {
          if (new Date(this.year, this.monthSelected, this.monthsList[this.monthSelected].days[i][j].day, 0, 0, 0, 0).getDate() < date.getDate()
          ) {

            this.monthsList[this.monthSelected].days[i][j].belongsToPeriod = false;
          } else {
            var diaVerificarFeriado = this.quantidadeAgendamentos.find(
              (c) =>
                new Date(c.dia.substring(0, 10)).getDate() + 1 ==
                new Date(this.year, this.monthSelected + 1, this.monthsList[this.monthSelected].days[i][j].day, 0, 0, 0, 0).getDate()
            );
            if (
              diaVerificarFeriado != undefined &&
              diaVerificarFeriado.feriado
            ) {
              this.monthsList[this.monthSelected].days[i][j].belongsToPeriod =
                false;
            }

            if (new Date(this.year, this.monthSelected, this.monthsList[this.monthSelected].days[i][j].day, 0, 0, 0, 0) >
              this.addDays(date, this.parametrosLight.limiteMarcacaoAgenda || this.quantidadeAgendamentos[j].feriado == true)) {

              this.monthsList[this.monthSelected].days[i][j].belongsToPeriod = false;
            }

            var datacomp1 = new Date(this.year, this.monthSelected, this.monthsList[this.monthSelected].days[i][j].day, 0, 0, 0, 0);
            var datacomp2 = this.addDays(date, -this.parametrosLight.limiteMarcacaoAgenda) || this.quantidadeAgendamentos[j].feriado == true
            if (datacomp1
              < datacomp2) {

              this.monthsList[this.monthSelected].days[i][j].belongsToPeriod = false;
            }
          }
          if (localStorage.getItem('one.tipologin') == 'cliente' && i == this.monthsList[this.monthSelected].days?.length - 1) {
            //debugger
            var dataLimite = this.addDays(date, this.parametrosLight.limiteMarcacaoAgenda || this.quantidadeAgendamentos[j].feriado == true)



            var dataaux = new Date(this.year, this.monthSelected, this.monthsList[this.monthSelected].days[i][j].day, 0, 0, 0, 0).getDate()
            var dataaux2 = date.getDate()
            var dateToday = new Date(this.year, this.monthSelected, new Date().getDate(), 0, 0, 0, 0)
            
            if (dataaux > dataaux2) {
              dataaux = this.monthSelected - 1 == 1 && dataaux >= 28 ? 28 : dataaux
              dataaux = (this.monthSelected - 1 == 3 || this.monthSelected - 1 == 5 || this.monthSelected - 1 == 8 || this.monthSelected - 1 == 10) && dataaux == 31 ? dataaux = 30 : dataaux
               
              var dataComparar = new Date(this.year, this.monthSelected - 1, dataaux, 0, 0, 0, 0)
            }
            else {
              
              var dataComparar = new Date(this.year, this.monthSelected + 1, dataaux, 0, 0, 0, 0)
            }
            if (dataComparar > dateToday && dataComparar < dataLimite) {
              //debugger
              this.monthsList[this.monthSelected].days[i][j].trocarMes = true;
            }
          }


        }
      }
    }
  }

  async quantidadeAgendamentosProfissional(dataHoje: any, profId?: number) {

    await this.agendaService.getQuantidadeAgendamentosProfissional(dataHoje.toISOString(), profId).then(
      (result) => {

        this.quantidadeAgendamentos = result;
        if (this.semProfissional) {
          this.quantidadeBloqueios.forEach(element => {
           element.quantidadeAgendamentos = 0
         });
         this.quantidadeAgendamentos.forEach(element => {
          element.quantidadeAgendamentos = 0
         });
       }

      },
      async (fail) => {
        await this.LoadingService.dismiss();
      }
    );
    return await this.quantidadeAgendamentos;
  }

  async quantidadeBloqueiosProfissional(dataHoje: any, profId?: number) {
    //await this.LoadingService.present();

  this.agendaService
     .getQuantidadeBloqueiosProfissional(dataHoje.toISOString(), profId)
     .subscribe(
        (result) => {
          this.quantidadeBloqueios = result;
           if (this.semProfissional) {
           this.quantidadeBloqueios.forEach(element => {
             element.quantidadeAgendamentos = 0
            });
          this.quantidadeAgendamentos.forEach(element => {
              element.quantidadeAgendamentos = 0
            });
          }
        },
        (fail) => {
          this.LoadingService.dismiss();
         }
  );
   }
}

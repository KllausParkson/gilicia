import {Component, OnInit, ElementRef, ViewChild, HostListener, Output, EventEmitter, Input} from '@angular/core';
import {
  Day, prevDayOfWeek, nextDayOfWeek, firstDayOfMonth, lastDayOfMonth, firstMonthOfYear, lastMonthOfYear,
  addWeeks, addMonths, addYears, addDays
} from '@progress/kendo-date-math';
import {Align} from '@progress/kendo-angular-popup';

@Component({
  selector: 'app-data-toolbar',
  templateUrl: './data-toolbar.component.html',
  styleUrls: ['./data-toolbar.component.scss'],
})
export class DataToolbarComponent implements OnInit {
  @ViewChild('dateToolbar', {read: ElementRef})
  public dateToolbarRef: ElementRef;

  @ViewChild('popup', {read: ElementRef}) public popup: ElementRef;
  public segment: string;

  @Input() startDate: Date = new Date();
  @Input() endDate: Date;

  @Output() dateEmmiter = new EventEmitter<any>();
  @Output() changeCalcValue = new EventEmitter<number>();

  public showCalendar = false;

  public innerWidth: any;
  public innerHeight: any;

  public anchorAlign: Align = {horizontal: 'right', vertical: 'bottom'};
  public popupAlign: Align = {horizontal: 'right', vertical: 'top'};

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
  }

  constructor() {
    this.getScreenSize();
  }

  ngOnInit() {
    if (this.endDate && this.startDate) {
      this.segment = this.setSegmentString();
    }
  }

  setSegmentString(): string {
    const value = (this.endDate.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24);
    if (value >= 0 && value < 6) {
      return 'dia';
    } else if (value >= 6 && value < 30) {
      return 'semana';
    } else if (value >= 30 && value < 364) {
      return 'mes';
    } else if (value >= 364) {
      return 'ano';
    }
  }

  segmentChanged(ev: any) {
    this.segment = ev.target.value;

    /*Retornando o dia atual*/
    if (ev.target.value === 'dia') {
      this.dateEmmiter.emit({startDate: new Date(), endDate: new Date()});
    }

    /* Retornando o primeiro e ultimo dia da semana */
    if (ev.target.value === 'semana') {
      this.startDate = prevDayOfWeek(new Date(), Day.Sunday);
      this.endDate = nextDayOfWeek(new Date(), Day.Saturday);
      this.dateEmmiter.emit({startDate: this.startDate, endDate: this.endDate});
    }
    /* Retornando o primeiro e ultimo dia do mês */
    if (ev.target.value === 'mes') {
      this.startDate = firstDayOfMonth(new Date());
      this.endDate = lastDayOfMonth(new Date());
      this.dateEmmiter.emit({startDate: this.startDate, endDate: this.endDate});
    }
    /* Retornando o primeiro dia do primeiro mês e ultimo dia do ultimo mês do ano atual */
    if (ev.target.value === 'ano') {
      this.startDate = firstDayOfMonth(firstMonthOfYear(new Date()));
      this.endDate = lastDayOfMonth(lastMonthOfYear(new Date()));
      this.dateEmmiter.emit({startDate: this.startDate, endDate: this.endDate});
    }
  }

  openCalendar(): void {
    this.showCalendar = !this.showCalendar;
  }

  next() {
    if (this.segment === 'dia') {
      this.startDate = addDays(this.startDate, 1);
      this.endDate = this.startDate;
      this.dateEmmiter.emit({startDate: this.startDate, endDate: this.startDate});
    } else if (this.segment === 'semana') {
      this.endDate = addWeeks(this.endDate, 1);
      this.startDate = addWeeks(this.startDate, 1);
      this.dateEmmiter.emit({startDate: this.startDate, endDate: this.endDate});
    } else if (this.segment === 'mes') {
      this.endDate = addMonths(this.endDate, 1);
      this.startDate = addMonths(this.startDate, 1);
      this.dateEmmiter.emit({startDate: this.startDate, endDate: this.endDate});
    } else if (this.segment === 'ano') {
      this.endDate = addYears(this.endDate, 1);
      this.startDate = addYears(this.startDate, 1);
      this.dateEmmiter.emit({startDate: this.startDate, endDate: this.endDate});
    }
  }

  prev() {
    if (this.segment === 'dia') {
      this.startDate = addDays(this.startDate, -1);
      this.endDate = this.startDate;
      this.dateEmmiter.emit({startDate: this.startDate, endDate: this.startDate});
    } else if (this.segment === 'semana') {
      this.endDate = addWeeks(this.endDate, -1);
      this.startDate = addWeeks(this.startDate, -1);
      this.dateEmmiter.emit({startDate: this.startDate, endDate: this.endDate});
    } else if (this.segment === 'mes') {
      this.endDate = addMonths(this.endDate, -1);
      this.startDate = addMonths(this.startDate, -1);
      this.dateEmmiter.emit({startDate: this.startDate, endDate: this.endDate});
    } else if (this.segment === 'ano') {
      this.endDate = addYears(this.endDate, -1);
      this.startDate = addYears(this.startDate, -1);
      this.dateEmmiter.emit({startDate: this.startDate, endDate: this.endDate});
    }
  }

  selectDateCalendar(event: any) {
    if (event.start !== undefined) {
      this.startDate = event.start;

      if (event.end !== undefined) {
        this.endDate = event.end;
      }
    } else {
      this.startDate = event;
    }
  }

  // métodos para fechar o popup de calendario quando clicar fora dele
  @HostListener('document:click', ['$event'])
  public documentClick(event: any): void {
    if (!this.contains(event.target)) {
      this.toggle(false);
    } else {
      this.toggle(true);
    }
  }

  public toggle(show?: boolean): void {
    this.showCalendar = show !== undefined ? show : !this.showCalendar;

    if (!this.showCalendar) {
      this.dateEmmiter.emit({startDate: this.startDate, endDate: this.endDate});
    }
  }

  private contains(target: any): boolean {
    return this.dateToolbarRef.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false);
  }
}

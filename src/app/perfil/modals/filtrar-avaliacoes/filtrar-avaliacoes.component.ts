import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { SelectionRange } from '@progress/kendo-angular-dateinputs';
import { Offset } from '@progress/kendo-angular-popup';
import { addYears } from '@progress/kendo-date-math';

@Component({
    selector: 'app-filtrar-avaliacoes',
    templateUrl: './filtrar-avaliacoes.component.html',
    styleUrls: ['./filtrar-avaliacoes.component.scss'],
})
export class FiltrarAvaliacoesComponent implements OnInit {
    public exibeCalendario = false;
    public range = {
        start: new Date(2018, 10, 10),
        end: new Date(2018, 10, 20)
    };
    public offset: Offset = { left: 0, top: 130 }
    dataFinal: string = new Date().toISOString().split('T')[0];
    dataInicial: string = addYears(new Date(), -1).toISOString().split('T')[0]

    @ViewChild('dateToolbar', { read: ElementRef })
    public dateToolbarRef: ElementRef;

    @ViewChild('calendar', { read: ElementRef }) public calendar: ElementRef;

    @HostListener('document:click', ['$event'])
    public documentClick(event: any): void {
        if (this.dateToolbarRef != undefined && this.calendar != undefined &&
            !this.dateToolbarRef.nativeElement.contains(event.target) && !this.calendar.nativeElement.contains(event.target) && this.exibeCalendario) {
            this.openCalendar();
        }
    }

    constructor(
        private modalController: ModalController,
        private datePipe: DatePipe
    ) { }

    ngOnInit() {

    }

    closeModal() {
        this.modalController.dismiss();
    }

    //confirma atualizacoes
    update() {

    }

    //impede que data inicial seja maior que a final e vice-versa
    checkSince() {
        if ((document.getElementById("since") as HTMLIonDatetimeElement).value > (document.getElementById("until") as HTMLIonDatetimeElement).value)
            (document.getElementById("until") as HTMLIonDatetimeElement).value = (document.getElementById("since") as HTMLIonDatetimeElement).value;

    }

    checkUntil() {
        if ((document.getElementById("until") as HTMLIonDatetimeElement).value < (document.getElementById("since") as HTMLIonDatetimeElement).value)
            (document.getElementById("since") as HTMLIonDatetimeElement).value = (document.getElementById("until") as HTMLIonDatetimeElement).value;

    }

    //envia dados para filtragem
    filter() {
        if ((document.getElementById("grade") as HTMLIonRangeElement).value["lower"] == undefined) {
            this.modalController.dismiss({
                //init: this.dataInicial,
                //fin: this.dataFinal,

                                /*
                    Erro: TS2339: Property 'split' does not exist on type 'string | string[]'.Property 'split' does not exist on type 'string[]'.
                    Solução: https://stackoverflow.com/questions/47813730/error-ts2339-property-split-does-not-exist-on-type-string-string-prope
                    Código anterior a solução.
                    init: new Date((document.getElementById("since") as HTMLIonDatetimeElement).value.split('T')[0]),
                    fin: new Date((document.getElementById("until") as HTMLIonDatetimeElement).value.split('T')[0]),
                    Código arrumado: 
                */
                init: new Date(((document.getElementById("since") as HTMLIonDatetimeElement).value as string).split('T')[0]),
                fin: new Date(((document.getElementById("until") as HTMLIonDatetimeElement).value as string).split('T')[0]),
                min_grad: 1,
                max_grad: 5,
                com_only: (document.getElementById("filled_only") as HTMLIonToggleElement).checked
            });
        } else {
            this.modalController.dismiss({
                //init: this.dataInicial,
                //fin: this.dataFinal,

                /*
                    Erro: TS2339: Property 'split' does not exist on type 'string | string[]'.Property 'split' does not exist on type 'string[]'.
                    Solução: https://stackoverflow.com/questions/47813730/error-ts2339-property-split-does-not-exist-on-type-string-string-prope
                    Código anterior a solução.
                    init: new Date((document.getElementById("since") as HTMLIonDatetimeElement).value.split('T')[0]), <string>
                    fin: new Date((document.getElementById("until") as HTMLIonDatetimeElement).value.split('T')[0]),
                    Código arrumado: 
                */
                init: new Date(((document.getElementById("since") as HTMLIonDatetimeElement).value as string).split('T')[0]),
                fin: new Date(((document.getElementById("until") as HTMLIonDatetimeElement).value as string).split('T')[0]),

                min_grad: (document.getElementById("grade") as HTMLIonToggleElement).value["lower"],
                max_grad: (document.getElementById("grade") as HTMLIonToggleElement).value["upper"],
                com_only: (document.getElementById("filled_only") as HTMLIonToggleElement).checked
            });
        }
    }

    //funcoes para o calendario do kendo (bagunca geral)
    openCalendar() {
        this.exibeCalendario = !this.exibeCalendario;
    }


}

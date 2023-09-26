import { Component,HostListener, OnInit, ElementRef, ViewChild} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from 'app/core/services/loading.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-saiba-mais-modal',
    templateUrl: './politica-privacidade-modal.component.html',
    styleUrls: ['politica-privacidade-modal.component.scss'],
  })
  @HostListener('scroll', ['$event'])




export class PoliticaPrivacidadeModalComponent implements OnInit{
  @ViewChild('scroll', { read: ElementRef }) public scroll: ElementRef<any>;
  
 
  public mostraPolitica = false;
  public mostraCondicao = false;
  public fechaModal = false;
  
  disableBtn:boolean=true;
  top:number;
  offSetHeight:number;
  scrollHeight:number;

  public innerWidth: any;
  public innerHeight: any;
  public addAppointmentButtonHeight: any;
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.addAppointmentButtonHeight = this.innerHeight - 300;
    this.addAppointmentButtonHeight = this.addAppointmentButtonHeight.toString() + 'px'
  }

  constructor(private modalController: ModalController,
                      private Translate: TranslateService,
                      private eleRef:ElementRef,){}
     public version:string=environment.version;

    public botaoATV= false;
    public politica: string = "";
    public coleta: string = "";
    public log: string = "";
    public provedor: string = "";
    public seguranca: string = "";
    public links: string = "";
    public privacidade: string = "";
    public conformidade: string = "";
    public alteracao: string = "";
    public contate: string = "";
    public motivocoleta: string = "";
    public revogacaodados: string = "";
    public resolucaoconflitos: string = "";
    public direitostitular: string = "";
                    

  ngOnInit() {
    this.politica = this.Translate.instant('LOGIN.SAIBAMAIS.MODAL.POLITICAPRIVACIDADE.POLITICA').replace(/(?:\r\n|\r|\n)/g, '<br>');
    this.coleta = this.Translate.instant('LOGIN.SAIBAMAIS.MODAL.POLITICAPRIVACIDADE.COLETA').replace(/(?:\r\n|\r|\n)/g, '<br>');
    this.log = this.Translate.instant('LOGIN.SAIBAMAIS.MODAL.POLITICAPRIVACIDADE.LOG').replace(/(?:\r\n|\r|\n)/g, '<br>');
    this.provedor = this.Translate.instant('LOGIN.SAIBAMAIS.MODAL.POLITICAPRIVACIDADE.PROVEDOR').replace(/(?:\r\n|\r|\n)/g, '<br>');
    this.seguranca = this.Translate.instant('LOGIN.SAIBAMAIS.MODAL.POLITICAPRIVACIDADE.SEGURANCA').replace(/(?:\r\n|\r|\n)/g, '<br>');
    this.links = this.Translate.instant('LOGIN.SAIBAMAIS.MODAL.POLITICAPRIVACIDADE.LINKS').replace(/(?:\r\n|\r|\n)/g, '<br>');
    this.privacidade = this.Translate.instant('LOGIN.SAIBAMAIS.MODAL.POLITICAPRIVACIDADE.PRIVACIDADE').replace(/(?:\r\n|\r|\n)/g, '<br>');
    this.conformidade = this.Translate.instant('LOGIN.SAIBAMAIS.MODAL.POLITICAPRIVACIDADE.CONFORMIDADE').replace(/(?:\r\n|\r|\n)/g, '<br>');
    this.alteracao = this.Translate.instant('LOGIN.SAIBAMAIS.MODAL.POLITICAPRIVACIDADE.ALTERACAO').replace(/(?:\r\n|\r|\n)/g, '<br>');
    this.contate = this.Translate.instant('LOGIN.SAIBAMAIS.MODAL.POLITICAPRIVACIDADE.CONTATE').replace(/(?:\r\n|\r|\n)/g, '<br>');
    this.motivocoleta = this.Translate.instant('LOGIN.SAIBAMAIS.MODAL.POLITICAPRIVACIDADE.MOTIVOCOLETA').replace(/(?:\r\n|\r|\n)/g, '<br>');
    this.revogacaodados = this.Translate.instant('LOGIN.SAIBAMAIS.MODAL.POLITICAPRIVACIDADE.REVOGACAODADOS').replace(/(?:\r\n|\r|\n)/g, '<br>');
    this.resolucaoconflitos = this.Translate.instant('LOGIN.SAIBAMAIS.MODAL.POLITICAPRIVACIDADE.RESOLUCAOCONFLITOS').replace(/(?:\r\n|\r|\n)/g, '<br>');
    this.direitostitular = this.Translate.instant('LOGIN.SAIBAMAIS.MODAL.POLITICAPRIVACIDADE.DIREITOSTITULAR').replace(/(?:\r\n|\r|\n)/g, '<br>');
  }
  closeModal() {
    this.modalController.dismiss();
  }

  @HostListener('scroll') onScrollEvent(event:Event){
    this.top=this.eleRef.nativeElement.scrollTop;
    this.offSetHeight=this.eleRef.nativeElement.offsetHeight;
    this.scrollHeight=this.eleRef.nativeElement.scrollHeight;
    if(this.top === 0){
      this.disableBtn=true;
    }
    if(this.top>this.scrollHeight-this.offSetHeight-1){
      this.disableBtn=false;
    }
}
}
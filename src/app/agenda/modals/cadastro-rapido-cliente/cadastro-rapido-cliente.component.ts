import { Component, OnInit, HostListener, ViewChild, } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ToastService } from 'app/core/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { AgendaService } from '../../services/agenda.service'
import { FormGroup, FormBuilder, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { LoadingService } from '../../../core/services/loading.service';
import { CadastroRapidoModel } from '../../models/cadastroRapidoModel';
import { CpfcnpjPipe } from 'app/core/pipes/cpfcnpj.pipe';
import { TelefonePipe } from 'app/core/pipes/telefone.pipe';
import { I18nUtils } from 'app/core/common/i18n/i18nUtils';
import { AppComponent } from './../../../app.component';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-cadastro-rapido-cliente',
  templateUrl: './cadastro-rapido-cliente.component.html',
  styleUrls: ['./cadastro-rapido-cliente.component.scss'],
})
export class CadastroRapidoClienteComponent implements OnInit {
  public emailAutomatico: boolean = false;
  public nomeCompleto;
  public email;
  public cpf;
  public celular;
  public cadastroRapidoModel: CadastroRapidoModel;
  public loading: any;

  public cadastroButtonWaitingAPI: boolean = false; //faz o controle do bloqueio do botão para que não seja possível acionar o mesmo no intervalo de espera do retorno da API de cadastro

  validation_messages = {
    'nomeCliente': [
      { type: 'required', message: this.translate.instant('AGENDA.MODALS.CADASTRORAPIDO.VALIDATION.REQUIRED.NOME') }
    ],
    'celular': [
      { type: 'required', message: this.translate.instant('AGENDA.MODALS.CADASTRORAPIDO.VALIDATION.REQUIRED.CELULAR') }
    ]
  };

  createCadastroRapidoForm: FormGroup;

  public screenHeight: any;
  public screenWidth: any;
  public borderHeight: any;
  public divHeight: any;

  @ViewChild("dropdownlist") public dropdownlist: DropDownListComponent;
  public iconCountry: string = 'globe';
  public menuCountries: Array<any> = this.loadCountries();
  public selectedValue: any;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.borderHeight = this.screenHeight - 550
    this.borderHeight = this.borderHeight.toString() + 'px'
    this.divHeight = this.screenHeight - 500
    this.divHeight = this.divHeight.toString() + 'px'
  }




  constructor(public navCtrl: NavController,
    private ModalController: ModalController,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    private loadingService: LoadingService,
    private agendaService: AgendaService,
    private navParams: NavParams,
    public cpfcnpjPipe: CpfcnpjPipe,
    public telefonePipe: TelefonePipe,
    private appComponent: AppComponent) {
    this.loadDefaultLanguage()
  }



  ngOnInit() {
    this.createCadastroRapidoForm = this.formBuilder.group({
      nomeCompleto: new FormControl('', Validators.compose([
        Validators.required
      ])),
      celular: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])),
      cpf: new FormControl(),
      email: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
    }, {
      
    });

    let lang = localStorage.getItem('one.lang') != "" && localStorage.getItem('one.lang') != undefined
      && localStorage.getItem('one.lang') != null && localStorage.getItem('one.lang') != "null"
      ? localStorage.getItem('one.lang')
      : navigator.language;


  }

  closeModal() {
    this.ModalController.dismiss()
  }

  onResize(event: any) {
    this.getScreenSize()
  }

  checkCelular(group: FormGroup): ValidatorFn {
    let cel = group.controls["celular"];
    if (cel.value == null || cel.value.replace(/\D/g, "")?.length < 8 || cel.value.replace(/\D/g, "")?.length > 11)
      cel.setErrors({ celInvalid: true });
    return;
  }

  setTelefoneMask(event) {

    this.createCadastroRapidoForm.controls['celular'].setValue(this.telefonePipe.transform(event.target.value, this.selectedValue.language))
  }

  setCpfMask(event) {
    this.createCadastroRapidoForm.controls['cpf'].setValue(this.cpfcnpjPipe.transform(event.target.value))
  }

  switchLanguage(language: string) {
    switch (language) {
      case 'pt-PT':
        return 'pt-PT';
      default:
        return language.substring(0, 2);
    }
  }

  loadDefaultLanguage() {
    this.translate.addLangs(I18nUtils.Languages());

    let userLang = localStorage.getItem('one.lang');

    if (userLang != '' && userLang != undefined && userLang != null && userLang != 'null') {
      this.translate.setDefaultLang(this.switchLanguage(userLang));
      this.translate.reloadLang(this.switchLanguage(userLang));
      this.appComponent.onLocaleChange(userLang);

      this.iconCountry = 'flag-icon flag-icon-' + userLang.substring(3, 5).toLocaleLowerCase() + ' flag-icon-squared';

      this.selectedValue = {
        text: userLang.substring(3, 5),
        icon: this.iconCountry,
        language: userLang
      };

    } else {
      let browserLang = navigator.language;

      let lang = (I18nUtils.Internationalizations()).includes(browserLang) ? browserLang : 'pt-BR';

      this.translate.setDefaultLang(this.switchLanguage(lang));
      this.translate.reloadLang(this.switchLanguage(lang));
      this.appComponent.onLocaleChange(lang);

      this.iconCountry = 'flag-icon flag-icon-' + lang.substring(3, 5).toLocaleLowerCase() + ' flag-icon-squared';

      this.selectedValue = {
        text: browserLang.substring(3, 5),
        icon: this.iconCountry,
        language: browserLang
      };

    }

  }

  loadCountries(): Array<any> {

    let countries = I18nUtils.Internationalizations();
    let arrayCountries: Array<any> = new Array<any>();

    countries.forEach(element => {
      arrayCountries.push(
        {
          text: element.substring(3, 5),
          icon: 'flag-icon flag-icon-' + element.substring(3, 5).toLocaleLowerCase() + ' flag-icon-squared',
          language: element
        }
      );
    });

    return arrayCountries;
  }

  changeLanguage(event: any) {
    this.selectedValue = event;
    this.iconCountry = 'flag-icon flag-icon-' + this.selectedValue.language.substring(3, 5).toLocaleLowerCase() + ' flag-icon-squared';

  }

  async cadastraCliente() {
    this.cadastroButtonWaitingAPI = true
    this.cadastroRapidoModel = Object.assign({}, this.cadastroRapidoModel, this.createCadastroRapidoForm.value);
    if (this.emailAutomatico) {
      this.cadastroRapidoModel.email = null;
    }
    if (!this.Validacpf(this.createCadastroRapidoForm.value.cpf)) {
      this.toast.presentToast(this.translate.instant('AGENDA.MODALS.CADASTRORAPIDO.VALIDATION.CPF'), 'danger');
    }
    else {
      this.loadingService.present();
      await this.agendaService.createCadastroRapido(this.cadastroRapidoModel)
        .then(
          result => {
            this.loadingService.dismiss();
            this.onSaveComplete(result)
          },
          fail => {
            this.cadastroButtonWaitingAPI = false
            this.loadingService.dismiss();
            this.onError(fail);
          }
        );
    }
  }
  onError(fail: any) {
    if (fail.error == "API.OCLIFORCOLSUSUARIOPERFIL.COLABORADOR.SEMPERMISSAO.CADASTRO")
      this.toast.presentToast(this.translate.instant('AGENDA.PERMISSION'), 'danger');
    else if (fail.error == "API.OCLIFORCOLSUSUARIOPERFIL.EMAILEXIST")
      this.toast.presentToast(this.translate.instant('AGENDA.CADASTRORAPIDO.MODAL.ALERTA.EMAILEXIST'), 'danger');
    else if (fail.error == "API.OCLIFORCOLSUSUARIOPERFIL.CELULAREXIST")
      this.toast.presentToast(this.translate.instant('AGENDA.CADASTRORAPIDO.MODAL.ALERTA.CELULAREXIST'), 'danger');
    else if (fail.error == "API.OCLIFORCOLSUSUARIOPERFIL.CPFEXIST")
      this.toast.presentToast(this.translate.instant('AGENDA.CADASTRORAPIDO.MODAL.ALERTA.CPFEXIST'), 'danger');
    else
      this.toast.presentToast(this.translate.instant('AGENDA.DEFAULTERROR'), 'danger');
  }

  onSaveComplete(response: any): void {
    this.cadastroRapidoModel.clienteId = response
    //this.modalCtrl.dismiss({cadastro: this.cadastroRapidoModel});
    this.toast.presentToast(this.translate.instant('AGENDA.MODALS.CADASTRORAPIDO.SUCCESS'));
    this.ModalController.dismiss(this.createCadastroRapidoForm.value.nomeCompleto);
  }

  limparEmail() {
    if (this.emailAutomatico == true) {
      this.createCadastroRapidoForm.controls['email'].setValue('')
    }
  }

  Validacpf(cpf: string): boolean {
    if (cpf == null) {
      return true;
    }
    else {
      cpf = cpf.replace(".", "");
      cpf = cpf.replace(".", "");
      cpf = cpf.replace("-", "");
    }
    if (cpf?.length != 11) {
      return false;
    }
    if ((cpf == '00000000000') || (cpf == '11111111111') || (cpf == '22222222222') || (cpf == '33333333333') || (cpf == '44444444444') || (cpf == '55555555555') || (cpf == '66666666666') || (cpf == '77777777777') || (cpf == '88888888888') || (cpf == '99999999999')) {
      return false;
    }
    let numero: number = 0;
    let caracter: string = '';
    let numeros: string = '0123456789';
    let j: number = 10;
    let somatorio: number = 0;
    let resto: number = 0;
    let digito1: number = 0;
    let digito2: number = 0;
    let cpfAux: string = '';
    cpfAux = cpf.substring(0, 9);
    for (let i: number = 0; i < 9; i++) {
      caracter = cpfAux.charAt(i);
      if (numeros.search(caracter) == -1) {
        return false;
      }
      numero = Number(caracter);
      somatorio = somatorio + (numero * j);
      j--;
    }
    resto = somatorio % 11;
    digito1 = 11 - resto;
    if (digito1 > 9) {
      digito1 = 0;
    }
    j = 11;
    somatorio = 0;
    cpfAux = cpfAux + digito1;
    for (let i: number = 0; i < 10; i++) {
      caracter = cpfAux.charAt(i);
      numero = Number(caracter);
      somatorio = somatorio + (numero * j);
      j--;
    }
    resto = somatorio % 11;
    digito2 = 11 - resto;
    if (digito2 > 9) {
      digito2 = 0;
    }
    cpfAux = cpfAux + digito2;
    if (cpf != cpfAux) {
      return false;
    }
    else {
      return true;
    }
  }

}

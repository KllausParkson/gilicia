import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { TelefonePipe } from 'app/core/pipes/telefone.pipe';

@Component({
  selector: 'app-cadastrar-email-apple',
  templateUrl: './cadastrar-email-apple.component.html',
  styleUrls: ['./cadastrar-email-apple.component.scss'],
})
export class CadastrarEmailAppleComponent implements OnInit {

  
  // Data passed in by componentProps
  @Output() email: string;

  public getEmailForm: FormGroup;

  public validationMessages = {
    celular: [
      {type: 'required', message: 'LOGIN.REGISTER.INVALIDNUMBER'}
    ]
  };

  constructor(public modalController: ModalController,
              public telefonePipe: TelefonePipe,
              private Translate: TranslateService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {

    this.getEmailForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])),
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async saveEmail() {
    this.email = await this.getEmailForm.controls.email.value
    
    this.modalController.dismiss({
      email: this.email
    });
  }

}

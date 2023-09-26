import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { TelefonePipe } from 'app/core/pipes/telefone.pipe';

@Component({
  selector: 'app-atualizar-celular',
  templateUrl: './atualizar-celular.component.html',
  styleUrls: ['./atualizar-celular.component.scss'],
})
export class AtualizarCelularComponent implements OnInit {

  @Input() userName: string;
  @Output() phoneNumber: string;
  @Output() dataAniversario: Date;

  public getPhoneNumberForm: FormGroup;
  public celular: any;

  public validationMessages = {
    celular: [
      { type: 'required', message: 'LOGIN.REGISTER.INVALIDNUMBER' }
    ]
  };

  constructor(public modalController: ModalController,
    public telefonePipe: TelefonePipe,
    private Translate: TranslateService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getPhoneNumberForm = this.formBuilder.group({
      celular: new FormControl('', [Validators.required]),
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }

  setTelefoneMask(event) {
    this.getPhoneNumberForm.controls.celular.setValue(this.telefonePipe.transform(event.target.value));
  }

  async savePhoneNumber() {
    this.phoneNumber = await this.getPhoneNumberForm.controls.celular.value

    this.modalController.dismiss({
      phoneNumber: this.phoneNumber
    });
  }

}

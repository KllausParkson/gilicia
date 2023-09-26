import { Component, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TelefonePipe } from '../../../core/pipes/telefone.pipe';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastrar-telefone-modal',
  templateUrl: './cadastrar-telefone-modal.component.html',
  styleUrls: ['./cadastrar-telefone-modal.component.scss'],
})
export class CadastrarTelefoneModalComponent implements OnInit {

  // Data passed in by componentProps
  @Input() userName: string;
  @Output() phoneNumber: string;
  @Output() dataAniversario: Date;
  @Output() nomeCompleto: string;

  public getPhoneNumberForm: FormGroup;

  public validationMessages = {
    celular: [
      { type: 'required', message: 'LOGIN.REGISTER.INVALIDNUMBER' }
    ]
  };

  constructor(public modalController: ModalController,
    public telefonePipe: TelefonePipe,
    private Translate: TranslateService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {

    this.getPhoneNumberForm = this.formBuilder.group({
      celular: new FormControl('', [Validators.required]),
      aniversario: new FormControl(),
      nomeCompleto: new FormControl()
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
    this.dataAniversario = await new Date(this.getPhoneNumberForm.controls.aniversario.value)
    this.nomeCompleto = await this.getPhoneNumberForm.controls.nomeCompleto.value


    if (this.dataAniversario.getTime() == new Date(null).getTime()) {
      this.dataAniversario = null;
    }

    this.modalController.dismiss({
      phoneNumber: this.phoneNumber,
      dataAniversario: this.dataAniversario,
      nomeCompleto: this.nomeCompleto
    });
  }
}

import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BugModel } from '../models/bug-model';
import { SharedService } from '../services/shared.service';
import { ToastService } from 'app/core/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ImageCompressService } from 'app/core/services/image-compress.service';
import { EMPTY } from 'rxjs';
import { expand, map } from 'rxjs/operators';
import { FileRestrictions, SelectEvent } from '@progress/kendo-angular-upload';

@Component({
  selector: 'app-relatar-bug-modal',
  templateUrl: './relatar-bug-modal.component.html',
  styleUrls: ['./relatar-bug-modal.component.scss'],
})
export class RelatarBugComponent implements OnInit {

  public bugForm: FormGroup;
  public userData: any;
  public tipoUsuario: any;
  public mensagemBug: string;
  public celularBug: string;
  public assuntoBug: string;
  public compressedImages = [];
  public fotoUpload: FormData = null;
  public urlFotoEnviada: string = null;
  public gatilhoEnvioFoto: boolean = true;
  public quantidadeFotos: number = 0;

  constructor(private ModalController: ModalController,
    private formBuild: FormBuilder,
    private reporte: SharedService,
    private toastService: ToastService,
    public translate: TranslateService,
    private compress: ImageCompressService,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('one.user'))
    this.tipoUsuario = localStorage.getItem('one.tipologin')
    this.bugForm = this.formBuild.group({
      assunto: new FormControl(),
      mensagem: new FormControl(),
      tipoUsuario: new FormControl(this.tipoUsuario),
      email: new FormControl(this.userData.authenticatedUser.email),
      salao: new FormControl(this.userData.authenticatedBranch.nomeEmpresaFilial),
      celular: new FormControl(this.userData.authenticatedUser.celularUsuario)
    })
    this.celularBug = this.userData.authenticatedUser.celularUsuario

  }

  closeModal() {
    this.ModalController.dismiss()
  }

  enviar() {
    let bugReportado: BugModel = new BugModel
    bugReportado.assunto = this.bugForm.controls['assunto'].value
    bugReportado.mensagem = this.bugForm.controls['mensagem'].value + "<br><br>Telefone para contato: " + this.bugForm.controls['celular'].value
    bugReportado.tipoUsuario = this.bugForm.controls['tipoUsuario'].value
    bugReportado.email = this.bugForm.controls['email'].value
    bugReportado.salao = this.bugForm.controls['salao'].value
    bugReportado.urlFoto = this.urlFotoEnviada;
    this.reporte.reportarBug(bugReportado).subscribe(
      res => {
        this.ModalController.dismiss()
        this.toastService.presentToast(this.translate.instant('SHARED.RELATAR.TOAST.SUCESSO'));
      },
      fail => {
        this.toastService.presentToast(this.translate.instant('SHARED.RELATAR.TOAST.ERRO'), 'danger');
      }
    )
  }

  public triggerFileSelect() {
    document.getElementsByName('files').forEach((file) => {
      file.click();
    })

  }



  public selectEventHandler(e: SelectEvent): void {
    const compressor = this.recursiveCompress(e.files[0].rawFile, 0, e.files)
      .pipe(
        expand(res => {
          return res.index > res.array?.length - 1
            ? EMPTY
            : this.recursiveCompress(e.files[res.index].rawFile, res.index, e.files);
        })
      )
    this.toastService.presentToast(this.translate.instant('SHARED.RELATAR.TOAST.ADICIONANDO'), 'success', 1000, '');
    this.gatilhoEnvioFoto = false;
    compressor.subscribe(res => {
      if (res.index > res.array?.length - 1) {
        const formData = new FormData();
        formData.append('files', res.data);
        this.fotoUpload = formData;

        this.reporte.uploadFotoBug(formData)
          .subscribe(response => {
            if (this.urlFotoEnviada == null) {
              this.urlFotoEnviada = response.data;
              this.quantidadeFotos += 1;
            }
            else {
              this.urlFotoEnviada = this.urlFotoEnviada + "\n" + response.data;
              this.quantidadeFotos += 1;
            }
            this.toastService.presentToast(this.translate.instant('SHARED.RELATAR.TOAST.ADDFOTOSUCESS'));
            this.gatilhoEnvioFoto = true;
          }, fail => {
            this.gatilhoEnvioFoto = true;
            this.toastService.presentToast(this.translate.instant('SHARED.RELATAR.TOAST.ADDFOTOERRO'), 'danger');
          })
      }
    });
  }


  public recursiveCompress(image: File, index, array) {
    return this.compress.compress(image).pipe(
      map(response => {

        //Code block after completing each compression
        this.compressedImages.push(response);
        return {
          data: response,
          index: index + 1,
          array: array,
        };
      }),
    );
  }

}

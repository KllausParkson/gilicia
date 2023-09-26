import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { FileRestrictions, SelectEvent } from '@progress/kendo-angular-upload';
import { EMPTY } from 'rxjs';
import { expand, map } from 'rxjs/operators';
import { ImageCompressService } from 'app/core/services/image-compress.service';
import { LoadingService } from 'app/core/services/loading.service';
import { ToastService } from 'app/core/services/toast.service';
import { PerfilColaboradorModel } from '../../models/perfil-colaborador-model';
import { PerfilModel } from '../../models/perfil-model';
import { PerfilServiceService } from '../../services/perfil-service.service';
import { TranslateService } from '@ngx-translate/core';
import { EditarSenhaComponent } from './editar-senha/editar-senha.component';

@Component({
  selector: 'app-editar-perfil-colaborador-modal',
  templateUrl: './editar-perfil-colaborador-modal.component.html',
  styleUrls: ['./editar-perfil-colaborador-modal.component.scss'],
})
export class EditarPerfilColaboradorModalComponent implements OnInit {

  @Input() colaboradorEditado: PerfilColaboradorModel;

  public semFoto = 'https://oneproducao.blob.core.windows.net/one2/Imagens/Sem_FotoPerfil.png';
  public colaboradorForm: FormGroup;
  public didInit: boolean = false;
  public currentImage
  public overlayDivControl: boolean = false;

  //foto: string = null;
  uploadSaveUrl: string = '';
  uploadHeaders: string = '';
  uploadRestrictions: FileRestrictions = {
    allowedExtensions: ['.jpg', '.png', '.jpeg']
  };
  public compressedImages = [];

  constructor(private modalController: ModalController,
    private formBuild: FormBuilder,
    private perfilService: PerfilServiceService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private Translate: TranslateService,
    private compress: ImageCompressService,
    private cd: ChangeDetectorRef,
    private alertController: AlertController,
    public platform: Platform) { }

  ngOnInit() {
    this.colaboradorForm = this.formBuild.group({
      nome: new FormControl(this.colaboradorEditado.nome, Validators.required),
      email: new FormControl(this.colaboradorEditado.email, Validators.required),
      celular: new FormControl(this.colaboradorEditado.celular, Validators.required),
      curriculo: new FormControl(this.colaboradorEditado.curriculo),
      foto: this.colaboradorEditado.foto,
      instagram: new FormControl(this.colaboradorEditado.instagram)
    });

    let response = this.perfilService.setFoto();
    this.uploadHeaders = response.Headers.headers
    this.uploadSaveUrl = response.UrlSave
  }

  closeModal() {
    this.modalController.dismiss()
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.cd.detectChanges();
      this.didInit = true;
    }, 0)

  }

  async editar() {
    await this.loadingService.present()

    let novoCol: PerfilModel = new PerfilModel()

    novoCol.nome = this.colaboradorForm.controls['nome'].value
    novoCol.email = this.colaboradorForm.controls['email'].value
    novoCol.celular = this.colaboradorForm.controls['celular'].value
    novoCol.curriculo = this.colaboradorForm.controls['curriculo'].value ? this.colaboradorForm.controls['curriculo'].value : ''
    novoCol.fotoUrl = this.colaboradorEditado.foto != null ? this.colaboradorForm.controls['foto'].value : null;
    novoCol.instagram = this.colaboradorForm.controls['instagram'].value;

    this.colaboradorEditado.nome = this.colaboradorForm.controls['nome'].value
    this.colaboradorEditado.email = this.colaboradorForm.controls['email'].value
    this.colaboradorEditado.celular = this.colaboradorForm.controls['celular'].value
    this.colaboradorEditado.curriculo = this.colaboradorForm.controls['curriculo'].value
    this.colaboradorEditado.foto = this.colaboradorEditado.foto
    this.colaboradorEditado.instagram = this.colaboradorForm.controls['instagram'].value;


    this.perfilService.editarPerfil(novoCol)
      .subscribe(
        res => {
          this.loadingService.dismiss()
          this.toastService.presentToast('Sucesso!').then(() => {
            this.modalController.dismiss({ colaboradorEditado: this.colaboradorEditado })
          })
        },
        fail => {
          this.loadingService.dismiss()
          this.toastService.presentToast('Erro!', 'danger');
        }
      )

  }

  async editarSenha() {
    this.overlayDivControl = true;
    const modal = await this.modalController.create({
      component: EditarSenhaComponent,
      componentProps: {
        email: this.colaboradorEditado.email,
      },
      cssClass: 'editarSenhaColaborador',
    });

    modal.onDidDismiss().then(res => {
      this.overlayDivControl = false;
    })

    return await modal.present();
  }

  public triggerFileSelect() {

    document.getElementsByName('files').forEach((file) => {
      file.click();
    })
  }
  public async removeImage() {

    const alert = await this.alertController.create({
      mode: "md",
      cssClass: "backgroundAlertApp",
      header: this.Translate.instant('PERFIL.MODALEDITAR.REMOVERFOTOHEADER'),
      //message: this.Translate.instant('PERFIL.MODALEDITAR.REMOVERFOTOMESSAGE'),
      buttons: [
        {
          text: this.Translate.instant('PERFIL.MODALEDITAR.REMOVERFOTOCANCELAR'),
          cssClass: 'cancelButton backgroundButtonApp',
          handler: () => {
          }
        },
        {
          text: this.Translate.instant('PERFIL.MODALEDITAR.REMOVERFOTOOK'),
          handler: () => {
            this.loadingService.present(); // inicia loading
            this.perfilService.deleteFotoProfissional()
              .subscribe(
                result => {
                  this.colaboradorEditado.foto = null;
                  this.colaboradorForm.controls['foto'].setValue(null);
                  this.loadingService.dismiss();
                },
                fail => {
                  this.loadingService.dismiss();
                })
          }
        }
      ],
      backdropDismiss: false,
    });

    await alert.present();



  }

  public successEventHandlerFoto(event) {

    this.colaboradorForm.controls['foto'].setValue(event.response.body.data);

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

    compressor.subscribe(res => {
      if (res.index > res.array?.length - 1) {
        const formData = new FormData();
        formData.append('files', res.data);
        this.perfilService.uploadImages(formData, this.uploadSaveUrl)
          .subscribe(response => {
            this.colaboradorForm.controls['foto'].setValue(response.data)
            this.uploadSuccess(res.data)

          }, fail => {
            //this.onError(fail)
          })
      }
    });
  }

  uploadSuccess(file: File) {
    const reader = new FileReader();

    reader.onloadend = () => {
      this.colaboradorEditado.foto = <string>reader.result;
      this.cd.detectChanges()
    }

    reader.readAsDataURL(file)
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

  removeEventHandlerFoto(event) {
    this.colaboradorEditado.foto = null
    this.colaboradorForm.controls['foto'].setValue(null)
  }

  errorEventHandler(event) {

  }

}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditarPerfilColaboradorModalComponent } from './editar-perfil-colaborador-modal.component';

describe('EditarPerfilColaboradorModalComponent', () => {
  let component: EditarPerfilColaboradorModalComponent;
  let fixture: ComponentFixture<EditarPerfilColaboradorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarPerfilColaboradorModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarPerfilColaboradorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

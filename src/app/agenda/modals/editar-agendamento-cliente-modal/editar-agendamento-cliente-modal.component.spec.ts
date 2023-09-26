import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditarAgendamentoClienteModalComponent } from './editar-agendamento-cliente-modal.component';

describe('EditarAgendamentoClienteModalComponent', () => {
  let component: EditarAgendamentoClienteModalComponent;
  let fixture: ComponentFixture<EditarAgendamentoClienteModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarAgendamentoClienteModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarAgendamentoClienteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

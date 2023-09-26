import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OutrosAgendamentosDoClienteComponent } from './outros-agendamentos-do-cliente.component';

describe('OutrosAgendamentosDoClienteComponent', () => {
  let component: OutrosAgendamentosDoClienteComponent;
  let fixture: ComponentFixture<OutrosAgendamentosDoClienteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OutrosAgendamentosDoClienteComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OutrosAgendamentosDoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

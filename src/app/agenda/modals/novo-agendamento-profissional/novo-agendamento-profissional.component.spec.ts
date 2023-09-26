import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NovoAgendamentoProfissionalComponent } from './novo-agendamento-profissional.component';

describe('NovoAgendamentoProfissionalComponent', () => {
  let component: NovoAgendamentoProfissionalComponent;
  let fixture: ComponentFixture<NovoAgendamentoProfissionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovoAgendamentoProfissionalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NovoAgendamentoProfissionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

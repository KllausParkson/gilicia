import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResumoAgendamentoProfissionalComponent } from './resumo-agendamento-profissional.component';

describe('ResumoAgendamentoProfissionalComponent', () => {
  let component: ResumoAgendamentoProfissionalComponent;
  let fixture: ComponentFixture<ResumoAgendamentoProfissionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumoAgendamentoProfissionalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResumoAgendamentoProfissionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

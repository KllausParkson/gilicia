import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OpcoesHorariolivreComponent } from './opcoes-horariolivre.component';

describe('OpcoesHorariolivreComponent', () => {
  let component: OpcoesHorariolivreComponent;
  let fixture: ComponentFixture<OpcoesHorariolivreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpcoesHorariolivreComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OpcoesHorariolivreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

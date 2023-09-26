import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FiltrarAvaliacoesComponent } from './filtrar-avaliacoes.component';

describe('FiltrarAvaliacoesComponent', () => {
  let component: FiltrarAvaliacoesComponent;
  let fixture: ComponentFixture<FiltrarAvaliacoesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrarAvaliacoesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FiltrarAvaliacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HistoricoObservacaoClienteComponent } from './historico-observacao-cliente.component';

describe('HistoricoObservacaoClienteComponent', () => {
  let component: HistoricoObservacaoClienteComponent;
  let fixture: ComponentFixture<HistoricoObservacaoClienteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoObservacaoClienteComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricoObservacaoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

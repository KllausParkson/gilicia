import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServicoAssinaturaMarcadoComponent } from './servico-assinatura-marcado.component';

describe('ServicoAssinaturaMarcadoComponent', () => {
  let component: ServicoAssinaturaMarcadoComponent;
  let fixture: ComponentFixture<ServicoAssinaturaMarcadoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicoAssinaturaMarcadoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServicoAssinaturaMarcadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

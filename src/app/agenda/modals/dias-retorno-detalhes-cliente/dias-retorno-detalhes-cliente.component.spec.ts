import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DiasRetornoDetalhesClienteComponent } from './dias-retorno-detalhes-cliente.component';

describe('DiasRetornoDetalhesClienteComponent', () => {
  let component: DiasRetornoDetalhesClienteComponent;
  let fixture: ComponentFixture<DiasRetornoDetalhesClienteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DiasRetornoDetalhesClienteComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DiasRetornoDetalhesClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

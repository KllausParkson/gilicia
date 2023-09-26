import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServicoPesquisadoModalComponent } from './servico-pesquisado-modal.component';

describe('ServicoPesquisadoModalComponent', () => {
  let component: ServicoPesquisadoModalComponent;
  let fixture: ComponentFixture<ServicoPesquisadoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicoPesquisadoModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServicoPesquisadoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

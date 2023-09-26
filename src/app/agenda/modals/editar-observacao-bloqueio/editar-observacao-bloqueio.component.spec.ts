import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditarObservacaoBloqueioComponent } from './editar-observacao-bloqueio.component';

describe('EditarObservacaoBloqueioComponent', () => {
  let component: EditarObservacaoBloqueioComponent;
  let fixture: ComponentFixture<EditarObservacaoBloqueioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarObservacaoBloqueioComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarObservacaoBloqueioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

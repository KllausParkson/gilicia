import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetalhesAvaliacoesModalComponent } from './detalhes-avaliacoes-modal.component';

describe('DetalhesAvaliacoesModalComponent', () => {
  let component: DetalhesAvaliacoesModalComponent;
  let fixture: ComponentFixture<DetalhesAvaliacoesModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalhesAvaliacoesModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalhesAvaliacoesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AvaliarColaboradorModalComponent } from './avaliar-colaborador-modal.component';

describe('AvaliarColaboradorModalComponent', () => {
  let component: AvaliarColaboradorModalComponent;
  let fixture: ComponentFixture<AvaliarColaboradorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvaliarColaboradorModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AvaliarColaboradorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

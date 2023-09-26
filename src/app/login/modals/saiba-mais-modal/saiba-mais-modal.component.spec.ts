import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SaibaMaisModalComponent } from './saiba-mais-modal.component';

describe(' SaibaMaisModalComponent', () => {
  let component:  SaibaMaisModalComponent;
  let fixture: ComponentFixture< SaibaMaisModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [  SaibaMaisModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent( SaibaMaisModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

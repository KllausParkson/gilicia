import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CadastrarEmailAppleComponent } from './cadastrar-email-apple.component';

describe('CadastrarEmailAppleComponent', () => {
  let component: CadastrarEmailAppleComponent;
  let fixture: ComponentFixture<CadastrarEmailAppleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastrarEmailAppleComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastrarEmailAppleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

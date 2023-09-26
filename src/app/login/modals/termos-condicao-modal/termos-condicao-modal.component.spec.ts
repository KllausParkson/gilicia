import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TermosCondicaoModalComponent} from './termos-condicao-modal.component';

describe(' TermosCondicaoModalComponent', () => {
  let component: TermosCondicaoModalComponent;
  let fixture: ComponentFixture< TermosCondicaoModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [  TermosCondicaoModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent( TermosCondicaoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

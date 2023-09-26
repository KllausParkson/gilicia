import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SenhaTemporariaModalComponent } from './senha-temporaria-modal.component';

describe('SenhaTemporariaModalComponent', () => {
  let component: SenhaTemporariaModalComponent;
  let fixture: ComponentFixture<SenhaTemporariaModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SenhaTemporariaModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SenhaTemporariaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

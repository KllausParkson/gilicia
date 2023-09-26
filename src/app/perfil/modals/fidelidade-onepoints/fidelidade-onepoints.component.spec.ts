import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FidelidadeOnepointsComponent } from './fidelidade-onepoints.component';

describe('FidelidadeOnepointsComponent', () => {
  let component: FidelidadeOnepointsComponent;
  let fixture: ComponentFixture<FidelidadeOnepointsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FidelidadeOnepointsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FidelidadeOnepointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

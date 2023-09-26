import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverRelatoriosSharedComponent } from './popover-relatorios-shared.component';

describe('PopoverRelatoriosSharedComponent', () => {
  let component: PopoverRelatoriosSharedComponent;
  let fixture: ComponentFixture<PopoverRelatoriosSharedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverRelatoriosSharedComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverRelatoriosSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

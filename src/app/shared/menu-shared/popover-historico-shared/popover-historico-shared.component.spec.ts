import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverHistoricoSharedComponent } from './popover-historico-shared.component';

describe('PopoverHistoricoSharedComponent', () => {
  let component: PopoverHistoricoSharedComponent;
  let fixture: ComponentFixture<PopoverHistoricoSharedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverHistoricoSharedComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverHistoricoSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

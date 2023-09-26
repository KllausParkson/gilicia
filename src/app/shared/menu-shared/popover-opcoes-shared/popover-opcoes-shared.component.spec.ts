import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopoverOpcoesSharedComponent } from './popover-opcoes-shared.component';

describe('PopoverOpcoesSharedComponent', () => {
  let component: PopoverOpcoesSharedComponent;
  let fixture: ComponentFixture<PopoverOpcoesSharedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverOpcoesSharedComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverOpcoesSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

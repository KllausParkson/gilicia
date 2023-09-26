import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NovoBloqueioComponent } from './novo-bloqueio.component';

describe('NovoBloqueioComponent', () => {
  let component: NovoBloqueioComponent;
  let fixture: ComponentFixture<NovoBloqueioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovoBloqueioComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NovoBloqueioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

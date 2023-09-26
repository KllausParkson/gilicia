import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OpcoesBloqueioComponent } from './opcoes-bloqueio.component';

describe('OpcoesBloqueioComponent', () => {
  let component: OpcoesBloqueioComponent;
  let fixture: ComponentFixture<OpcoesBloqueioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpcoesBloqueioComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OpcoesBloqueioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

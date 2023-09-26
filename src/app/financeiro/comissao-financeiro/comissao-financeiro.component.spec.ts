import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ComissaoFinanceiroComponent } from './comissao-financeiro.component';

describe('ComissaoFinanceiroComponent', () => {
  let component: ComissaoFinanceiroComponent;
  let fixture: ComponentFixture<ComissaoFinanceiroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComissaoFinanceiroComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ComissaoFinanceiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

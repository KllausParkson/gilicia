import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FaturamentoFinanceiroComponent } from './faturamento-financeiro.component';

describe('FaturamentoFinanceiroComponent', () => {
  let component: FaturamentoFinanceiroComponent;
  let fixture: ComponentFixture<FaturamentoFinanceiroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaturamentoFinanceiroComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FaturamentoFinanceiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

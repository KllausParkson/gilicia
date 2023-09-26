import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProdutividadeFinanceiroComponent } from './produtividade-financeiro.component';

describe('ProdutividadeFinanceiroComponent', () => {
  let component: ProdutividadeFinanceiroComponent;
  let fixture: ComponentFixture<ProdutividadeFinanceiroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdutividadeFinanceiroComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutividadeFinanceiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

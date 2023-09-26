import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RelatorioPesquisaSatisfacaoComponent } from './relatorio-pesquisa-satisfacao.component';

describe('RelatorioPesquisaSatisfacaoComponent', () => {
  let component: RelatorioPesquisaSatisfacaoComponent;
  let fixture: ComponentFixture<RelatorioPesquisaSatisfacaoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatorioPesquisaSatisfacaoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RelatorioPesquisaSatisfacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

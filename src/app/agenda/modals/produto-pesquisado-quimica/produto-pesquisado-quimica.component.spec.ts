import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProdutoPesquisadoQuimicaComponent } from './produto-pesquisado-quimica.component';

describe('ProdutoPesquisadoQuimicaComponent', () => {
  let component: ProdutoPesquisadoQuimicaComponent;
  let fixture: ComponentFixture<ProdutoPesquisadoQuimicaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdutoPesquisadoQuimicaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutoPesquisadoQuimicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

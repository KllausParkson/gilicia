import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EscolherEstabelecimentoModalComponent } from './escolher-estabelecimento-modal.component';

describe('EscolherEstabelecimentoModalComponent', () => {
  let component: EscolherEstabelecimentoModalComponent;
  let fixture: ComponentFixture<EscolherEstabelecimentoModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EscolherEstabelecimentoModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EscolherEstabelecimentoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

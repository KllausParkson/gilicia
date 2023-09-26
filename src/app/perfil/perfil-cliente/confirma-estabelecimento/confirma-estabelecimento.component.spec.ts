import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConfirmaEstabelecimentoComponent } from './confirma-estabelecimento.component';

describe('ConfirmaEstabelecimentoComponent', () => {
  let component: ConfirmaEstabelecimentoComponent;
  let fixture: ComponentFixture<ConfirmaEstabelecimentoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmaEstabelecimentoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmaEstabelecimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

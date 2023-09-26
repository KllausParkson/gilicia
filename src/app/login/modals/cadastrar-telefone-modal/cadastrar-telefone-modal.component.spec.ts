import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CadastrarTelefoneModalComponent } from './cadastrar-telefone-modal.component';

describe('CadastrarTelefoneModalComponent', () => {
  let component: CadastrarTelefoneModalComponent;
  let fixture: ComponentFixture<CadastrarTelefoneModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastrarTelefoneModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastrarTelefoneModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

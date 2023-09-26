import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfosEmpresaModalComponent } from './infos-empresa-modal.component';

describe('AvaliarColaboradorModalComponent', () => {
  let component: InfosEmpresaModalComponent;
  let fixture: ComponentFixture<InfosEmpresaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfosEmpresaModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfosEmpresaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

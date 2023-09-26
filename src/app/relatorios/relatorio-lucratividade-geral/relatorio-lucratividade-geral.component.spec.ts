import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RelatorioLucratividadeGeralComponent } from './relatorio-lucratividade-geral.component';

describe('RelatorioLucratividadeGeralComponent', () => {
  let component: RelatorioLucratividadeGeralComponent;
  let fixture: ComponentFixture<RelatorioLucratividadeGeralComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatorioLucratividadeGeralComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RelatorioLucratividadeGeralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import {PopupTermosPoliticaModalComponent } from './popup-termos-politica-modal.component';

describe(' PopupTermosPoliticaModalComponent', () => {
  let component: PopupTermosPoliticaModalComponent;
  let fixture: ComponentFixture< PopupTermosPoliticaModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [  PopupTermosPoliticaModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent( PopupTermosPoliticaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

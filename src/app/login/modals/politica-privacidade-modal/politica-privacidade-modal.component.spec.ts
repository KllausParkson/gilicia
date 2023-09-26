import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import {PoliticaPrivacidadeModalComponent } from './politica-privacidade-modal.component';

describe(' PoliticaPrivacidadeModalComponent', () => {
  let component: PoliticaPrivacidadeModalComponent;
  let fixture: ComponentFixture< PoliticaPrivacidadeModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [  PoliticaPrivacidadeModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent( PoliticaPrivacidadeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

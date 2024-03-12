import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationModalPage } from './registration-modal.page';

describe('RegistrationModalPage', () => {
  let component: RegistrationModalPage;
  let fixture: ComponentFixture<RegistrationModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RegistrationModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

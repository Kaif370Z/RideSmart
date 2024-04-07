import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrashModalPage } from './crash-modal.page';

describe('CrashModalPage', () => {
  let component: CrashModalPage;
  let fixture: ComponentFixture<CrashModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CrashModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

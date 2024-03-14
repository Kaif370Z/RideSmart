import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileUpdateModalPage } from './user-profile-update-modal.page';

describe('UserProfileUpdateModalPage', () => {
  let component: UserProfileUpdateModalPage;
  let fixture: ComponentFixture<UserProfileUpdateModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UserProfileUpdateModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

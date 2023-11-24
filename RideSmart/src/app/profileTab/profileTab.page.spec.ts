import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { profileTabPage } from './profileTab.page';

describe('maintenanceTabPage', () => {
  let component: profileTabPage;
  let fixture: ComponentFixture<profileTabPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [profileTabPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(profileTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

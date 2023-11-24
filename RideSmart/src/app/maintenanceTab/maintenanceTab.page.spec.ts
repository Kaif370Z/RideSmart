import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { maintenanceTabPage } from './maintenanceTab.page';

describe('maintenanceTabPage', () => {
  let component: maintenanceTabPage;
  let fixture: ComponentFixture<maintenanceTabPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [maintenanceTabPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(maintenanceTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

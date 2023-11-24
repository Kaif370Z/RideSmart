import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { driveTabPage } from './driveTab.page';

describe('driveTabPage', () => {
  let component: driveTabPage;
  let fixture: ComponentFixture<driveTabPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [driveTabPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(driveTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

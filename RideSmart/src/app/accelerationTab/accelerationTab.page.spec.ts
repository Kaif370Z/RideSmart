import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { accelerationTabPage } from './accelerationTab.page';

describe('accelerationTabPage', () => {
  let component: accelerationTabPage;
  let fixture: ComponentFixture<accelerationTabPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [accelerationTabPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(accelerationTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

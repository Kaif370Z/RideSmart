import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { driveTab } from './driveTab.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { driveTabRoutingModule } from './driveTab-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    driveTabRoutingModule
  ],
  declarations: [driveTab]
})
export class driveTabPageModule {}

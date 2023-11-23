import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { accelerationTabPage } from './accelerationTab.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { accelerationTabPageRoutingModule } from './accelerationTab-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    accelerationTabPageRoutingModule
  ],
  declarations: [accelerationTabPage]
})
export class accelerationTabPageModule {}

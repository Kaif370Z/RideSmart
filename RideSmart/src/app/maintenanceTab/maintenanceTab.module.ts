import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { maintenanceTabPage } from './maintenanceTab.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { maintenanceTabPageRoutingModule } from './maintenanceTab-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    maintenanceTabPageRoutingModule
  ],
  declarations: [maintenanceTabPage]
})
export class maintenanceTabPageModule {}

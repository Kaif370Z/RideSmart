import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { profileTabPage } from './profileTab.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { maintenanceTabPageRoutingModule } from './profileTab-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    maintenanceTabPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [profileTabPage]
})
export class profileTabPageModule {}

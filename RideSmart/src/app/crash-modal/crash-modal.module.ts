import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrashModalPageRoutingModule } from './crash-modal-routing.module';

import { CrashModalPage } from './crash-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrashModalPageRoutingModule
  ],
  declarations: [CrashModalPage]
})
export class CrashModalPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserProfileUpdateModalPageRoutingModule } from './user-profile-update-modal-routing.module';

import { UserProfileUpdateModalPage } from './user-profile-update-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserProfileUpdateModalPageRoutingModule
  ],
  declarations: [UserProfileUpdateModalPage]
})
export class UserProfileUpdateModalPageModule {}

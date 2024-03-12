import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrationModalPageRoutingModule } from './registration-modal-routing.module';

import { RegistrationModalPage } from './registration-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrationModalPageRoutingModule
  ],
  declarations: [RegistrationModalPage]
})
export class RegistrationModalPageModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrationModalPage } from './registration-modal.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrationModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationModalPageRoutingModule {}

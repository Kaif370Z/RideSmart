import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserProfileUpdateModalPage } from './user-profile-update-modal.page';

const routes: Routes = [
  {
    path: '',
    component: UserProfileUpdateModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserProfileUpdateModalPageRoutingModule {}

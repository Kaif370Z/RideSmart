import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrashModalPage } from './crash-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CrashModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrashModalPageRoutingModule {}

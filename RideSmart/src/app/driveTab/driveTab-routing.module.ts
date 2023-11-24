import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { driveTab } from './driveTab.page';

const routes: Routes = [
  {
    path: '',
    component: driveTab,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class driveTabRoutingModule {}

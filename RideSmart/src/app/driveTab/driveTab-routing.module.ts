import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { driveTabPage } from './driveTab.page';

const routes: Routes = [
  {
    path: '',
    component: driveTabPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class driveTabRoutingModule {}

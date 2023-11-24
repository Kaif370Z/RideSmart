import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { maintenanceTabPage } from './maintenanceTab.page';

const routes: Routes = [
  {
    path: '',
    component: maintenanceTabPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class maintenanceTabPageRoutingModule {}

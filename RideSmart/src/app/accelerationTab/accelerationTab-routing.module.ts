import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { accelerationTabPage } from './accelerationTab.page';

const routes: Routes = [
  {
    path: '',
    component: accelerationTabPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class accelerationTabPageRoutingModule {}

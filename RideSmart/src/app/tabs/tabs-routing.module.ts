import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'driveTab',
        loadChildren: () => import('../driveTab/driveTab.module').then(m => m.driveTabPageModule)
      },
      {
        path: 'accelerationTab',
        loadChildren: () => import('../accelerationTab/accelerationTab.module').then(m => m.accelerationTabPageModule)
      },
      {
        path: 'maintenanceTab',
        loadChildren: () => import('../maintenanceTab/maintenanceTab.module').then(m => m.maintenanceTabPageModule)
      },
      {
        path: 'profileTab',
        loadChildren: () => import('../profileTab/profileTab.module').then(m => m.profileTabPageModule)
      },

      {
        path: '',
        redirectTo: '/tabs/driveTab',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/driveTab',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login-modal',
    loadChildren: () => import('./login-modal/login-modal.module').then( m => m.LoginModalPageModule)
  },
  {
    path: 'registration-modal',
    loadChildren: () => import('./registration-modal/registration-modal.module').then( m => m.RegistrationModalPageModule)
  },
  {
    path: 'login-modal',
    loadChildren: () => import('./login-modal/login-modal.module').then( m => m.LoginModalPageModule)
  },
  {
    path: 'user-profile-update-modal',
    loadChildren: () => import('./user-profile-update-modal/user-profile-update-modal.module').then( m => m.UserProfileUpdateModalPageModule)
  },  {
    path: 'crash-modal',
    loadChildren: () => import('./crash-modal/crash-modal.module').then( m => m.CrashModalPageModule)
  }


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

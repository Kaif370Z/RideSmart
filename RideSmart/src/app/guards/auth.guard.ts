import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    return this.authService.currentUser.pipe(
      take(1),
      map(user => {
        if (user) {
          //allow access if user logged in
          return true;
        } else {
          //redirect to login if not logged in
          this.router.navigateByUrl('/login');
          return false;
        }
      })
    );
  }
}

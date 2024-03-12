import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //BehaviourSubject keeps track of current user
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  //update when auth state changes
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private auth: Auth) {

    //listening for changes on user
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });

   }

  async register ({ email, password }: { email: string; password: string }) {
    try {
      const user = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return user;
    } catch (e) {
      return null;
    }
  }

  async login({ email, password }: { email: string; password: string }) {
    try {
      const user = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return user;
    } catch (e) {
      return null;
    }
  }

  logout() {
    return signOut(this.auth);
  }
}

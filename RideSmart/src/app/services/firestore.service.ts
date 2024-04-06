import { Injectable } from '@angular/core';
import { Firestore,  addDoc, setDoc,doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private firestore: Firestore
  ) { }

  async addUserDetails(uid: string, userDetails: any) {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userDocRef, userDetails);
  }

  getUserDetails(userId: string): Observable<any> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return docData(userDocRef, { idField: 'id' }); // Ensure this matches your implementation
  }
  

}

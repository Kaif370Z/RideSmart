import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, setDoc,doc } from '@angular/fire/firestore';


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

}

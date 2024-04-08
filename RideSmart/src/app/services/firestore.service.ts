import { Injectable } from '@angular/core';
import { Firestore,  addDoc, setDoc,doc, docData } from '@angular/fire/firestore';
import { collection, collectionData } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private firestore: Firestore
  ) { }

  async addUserDetails(uid: string, userDetails: any) {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userDocRef, userDetails), { merge: true };
  }

  getUserDetails(userId: string): Observable<any> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return docData(userDocRef, { idField: 'id' });
  } 

  async addRouteData(userId: string, routeData: any): Promise<void> {
    const routeCollectionRef = collection(this.firestore, `users/${userId}/routes`);
    await addDoc(routeCollectionRef, routeData);
  }

  getRoutes(userId: string): Observable<any[]> {
    const routesRef = collection(this.firestore, `users/${userId}/routes`);
    return collectionData(routesRef, { idField: 'id' }).pipe(
      map((routes: any) => routes)
    );
  }
  
}

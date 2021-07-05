import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, from as fromPromise, Observable, of } from 'rxjs';
import { User } from '../model/user';
import { switchMap, tap } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  

  public currentUser: Observable<User | null>;
  public currentUserSnapShot: User | null;

  constructor(private http: HttpClient, private router: Router, private afAuth: AngularFireAuth, private db: AngularFirestore) {
    //dohvata korisnika iz baze
    this.currentUser = this.afAuth.authState.pipe(switchMap((user) => {
      if (user) {
        return this.db.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        return of(null);
      }
    }))

    this.setCurrentUserSnapShot();

  }

  // Kreiramo korisnika
  public signup(firstName: string, lastName: string, email: string, password: string): Observable<boolean> {
    return fromPromise(
      this.afAuth.createUserWithEmailAndPassword(email, password)
        .then((user) => {
          //referenca na korisnika
          const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${user.user.uid}`);
          const updatedUser = {
            id: user.user.uid,
            email: user.user.email,
            firstName,
            lastName,
            photoUrl: 'https://firebasestorage.googleapis.com/v0/b/chat-94f8e.appspot.com/o/avatar.jpg?alt=media&token=125332be-1484-485d-b2a4-b182a1d1d8b6'
          }
          console.log(userRef);

          userRef.set(updatedUser);
          return true;
        })
        .catch((err) => false)
    )


  }


  public login(email: string, passwrod: string): Observable<boolean> {
    return fromPromise(
      this.afAuth.signInWithEmailAndPassword(email, passwrod)
        .then((user) => true)
        .catch((err) => false)
    );
  }

  setCurrentUserSnapShot(): void {
    this.currentUser.subscribe(user => this.currentUserSnapShot = user);
  }
  public logout(): void {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}

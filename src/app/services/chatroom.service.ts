import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LoadingService } from './loading.service';
import { switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';



@Injectable({
  providedIn: 'root'
})
export class ChatroomService {

 

  public chatrooms: Observable<any>;
  public changeChatroom: BehaviorSubject<string | null> = new BehaviorSubject(null);
  public selectedChatroom: Observable<any>;
  public selectedChatroomMessages: Observable<any>;

  //Jedna soba
  constructor(private db: AngularFirestore, private loadingService: LoadingService, private authService: AuthService) {
    this.selectedChatroom = this.changeChatroom.pipe(switchMap(chatroomId => {
      if (chatroomId) {
        return db.doc(`chatrooms/${chatroomId}`).valueChanges();
      }

      return of(null);
    }));

//Poruke za odredjenu sobu
    this.selectedChatroomMessages = this.changeChatroom.pipe(switchMap(chatroomId => {
      if (chatroomId) { 
        return db.collection(`chatrooms/${chatroomId}/messages`).valueChanges();
      }

      return of(null);
    }));

    //Sve chat sobe
    this.chatrooms = db.collection('chatrooms').valueChanges();
  }

  public createMessage(text: string): void{
    
    const chatroomId = this.changeChatroom.value;
    const message = {
      message: text,
      createdAt: new Date(),
      sender: this.authService.currentUserSnapShot 
    };

    this.db.collection(`chatrooms/${chatroomId}/messages`).add(message); 
  }
}

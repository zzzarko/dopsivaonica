import { Component, OnInit,Input } from '@angular/core';
import { Message } from 'src/app/model/message';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {

  @Input() message: Message; //Dobija se message tipa Message;

  constructor() { }

  ngOnInit(): void {
  }

}

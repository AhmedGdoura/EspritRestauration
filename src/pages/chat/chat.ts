import { Component, ViewChild, ElementRef } from "@angular/core";
import { FormGroup } from '@angular/forms';
//import { Content } from "ionic-angular/index";
import { IonicPage, NavController } from "ionic-angular";
import { AuthService } from "../../services/auth.service"
import { SocketService } from "../../services/socket.service"
import { FormService } from '../../services/form.service';
import { ChatService } from '../../services/chat.service';

import { MessagesResponse } from '../../classes/messages-response';
import { Message } from '../../classes/message';
import { User } from '../../classes/user';
import { ChatListResponse } from '../../classes/chat-response-list';


@IonicPage()
@Component({
  selector: "page-chat",
  templateUrl: "chat.html"
})
export class ChatPage {
  @ViewChild('messageThread')
  private messageContainer: ElementRef;
  /* userId: any;
  messageList: Array<any>;
  messageObserable: AngularFireList<any>;
  chatMessage = {
    message: "",
    sendBy: "User",
    userName: "",
    createdAt: Date.now()
  };
  userDisplayPic: string = "assets/img/profile.jpg";
  sevenDaysBack: any;
  imageUrl: string; */

  public selectedUser: User = {
    email: null,
    name: null,
    online: 'N',
  };
  public user: any;
  public messages: Message[] = [];
  public messageForm: FormGroup;

  constructor(
    private auth: AuthService,
    private socket: SocketService,
    private formService: FormService,
    private chatService: ChatService,
    private navCtrl: NavController,
  ) {
    this.messageForm = this.formService.createMessageForm();
    this.auth.user.subscribe((userInfo: any) => {
      if (userInfo != null) {
        this.user=userInfo;
        this.socket.getChatList(userInfo.message.email, userInfo.message.role).subscribe((chatListResponse: ChatListResponse) => {
          this.renderChatList(chatListResponse);
          this.getMessages(this.selectedUser.email);
        });
      }
      else {
        this.navCtrl.push("HomePage");;
      }
    });
   }

   ionViewDidLoad() {
    this.listenForMessages();
   }


   renderChatList(chatListResponse: ChatListResponse): void {

    if (!chatListResponse.error) {
      if (chatListResponse.singleUser) {
        this.selectedUser.online = 'Y'
        /* Adding new online user into chat list array */
      } else if (chatListResponse.userDisconnected) {
        this.selectedUser.online = 'N'
      } else {
        /* Updating entire chatlist if user logs in. */
        this.selectedUser = chatListResponse.chatList[0];
      }

    } else {
      alert(`Unable to load Chat list`);
    }
  }

  scrollToBottom() {
    if (this.messageContainer !== undefined) {
      try {
        setTimeout(() => {
          this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
        }, 100);
      } catch (error) {
        console.warn(error);
      }
    }
  }

  getMessages(toUserEmail: string) {
    this.chatService
      .getMessages({ userEmail: this.user.message.email, toUserEmail: toUserEmail })
      .subscribe((response: MessagesResponse) => {
        this.messages = response.messages;
        setTimeout(() => {
          this.scrollToBottom();
        }, 300);
      });

  }


  listenForMessages(): void {
    this.socket
      .receiveMessages()
      .subscribe((socketResponse: Message) => {
        if (
          this.selectedUser !== null &&
          this.selectedUser.email === socketResponse.fromUserEmail
        ) {
          this.messages = [...this.messages, socketResponse];
          this.scrollToBottom();
        }
      });
  }


  sendMessage(event) {
    const message = this.messageForm.controls['message'].value.trim();
    if (message === '' || message === undefined || message === null) {
      console.log(`Message can't be empty.`);
    } else if (this.user.message.email === '') {
      console.log('no User Email');
    } else if (this.selectedUser.email === '') {
      console.log(`Select a user to chat.`);
    } else {
      console.log('************ Sendm ****************');
      console.log(message);
      this.sendAndUpdateMessages({
        fromUserEmail: this.user.message.email,
        message: message.trim(),
        toUserEmail: this.selectedUser.email,
        role: this.user.message.role,
      });
    }

}



sendAndUpdateMessages(message: Message) {
  try {
    this.messageForm.disable();
    this.socket.sendMessage(message);
    this.messages = [...this.messages, message];
    this.messageForm.reset();
    this.messageForm.enable();
    this.scrollToBottom();
  } catch (error) {
    console.warn(error);
    alert(`Can't send your message`);
  }
}

  alignMessage(userEmail: string): boolean {
    return this.user.message.email === userEmail ? false : true;
  }

  /* ionViewDidLoad() {
    let date = new Date();
    let midnight = date.setUTCHours(0, 0, 0, 0);
    this.sevenDaysBack = midnight - 7 * 24 * 60 * 60 * 1000;

     if (this.af.auth.currentUser) {
      this.userId = this.af.auth.currentUser.uid;
      this.db
        .object("/users/" + this.userId)
        .valueChanges()
        .subscribe((res: any) => {
          this.chatMessage.userName = res.name;
          if (res.image) {
            this.userDisplayPic = res.image;
            this.imageUrl = res.image;
          } else {
            this.userDisplayPic = "assets/img/profile.jpg";
          }
        });
      this.messageObserable = this.db.list("/messages/" + this.userId);
      this.messageObserable.valueChanges().subscribe(res => {
        this.messageList = [];
        this.messageList = res;
        this.scrollToBottom();
      });
    } else {
    }
  } */

 /*  sendMessage(form: NgForm) {
    this.messageObserable.push(this.chatMessage).then(res => {
      this.chatMessage.message = "";
      this.scrollToBottom();
    });
  } */

}

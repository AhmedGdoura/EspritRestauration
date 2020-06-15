import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { ChatListResponse } from '../classes/chat-response-list';
import { MessageSocketEvent } from '../classes/message-socket-event';
import { Message } from '../classes/message';
import { environment } from '../environments/environment'
export class SocketService {


    private url = environment.apiUrl;
    private socket;
    /* private page = new BehaviorSubject(false);
    pageStatus: Observable<boolean> = this.page.asObservable(); */

    constructor() {
    }

    /* changePageStatus(status: boolean) {
      this.page.next(status);
    } */

    connectSocket(userEmail: string, userRole: string): void {
    this.socket = io(this.url, { query: `userEmail=${userEmail}&userRole=${userRole}`   });
    }


    getChatList(userEmail: string = null, userRole: string = null): Observable<ChatListResponse> {
      if ((userEmail !== null)&&(userRole !== null)) {
        this.socket.emit('chat-list', { userEmail: userEmail, userRole: userRole });
        console.log('sent');
      }
      return new Observable(observer => {
        this.socket.on('chat-list-response', (data: ChatListResponse) => {
          observer.next(data);
        });
        return () => {
          this.socket.disconnect();
        };
      });
    }

    sendMessage(message: MessageSocketEvent): void {
      console.log('************ Socket ***********');
      console.log(message);
      this.socket.emit('add-message', message);
    }

      /*
    * Method to receive add-message-response event.
    */
    receiveMessages(): Observable<Message> {
      this.socket.removeListener( 'add-message-bell' );
      this.socket.removeListener( 'add-message-alert' );
      return new Observable(observer => {
        this.socket.on('add-message-response', (data) => {
          observer.next(data);
        });


        return () => {
          this.socket.disconnect();
        };
      });
    }

    /* receiveBell(): Observable<Message> {
      this.socket.removeListener( 'add-message-response' );
      return new Observable(observer => {
        this.socket.on('add-message-bell', (data) => {
          console.log('hello');
          observer.next(data);
        });

        return () => {
          this.socket.disconnect();
        };
      });
    }

    receiveAlert(): Observable<Message> {
      return new Observable(observer => {
        this.socket.on('add-message-alert', (data) => {
          console.log(data);
          observer.next(data);
        });

        return () => {
          this.socket.disconnect();
        };
      });
    }



    activatedPage(value: boolean): Observable<boolean> {
      return new Observable(observer => {
        observer.next(value);
      });
    } */


    logout(Email:string, Role: string) {
      this.socket.emit('logout', {userEmail: Email, userRole: Role});
    }


}

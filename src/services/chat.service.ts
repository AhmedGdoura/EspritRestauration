import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/* importing interfaces starts */
import { MessageRequest } from '../classes/message-request';
import { MessagesResponse } from '../classes/messages-response';
/* importing interfaces ends */

import { environment } from '../environments/environment'

@Injectable()
export class ChatService {
  private BASE_URL = environment.apiUrl+'api/v1/users/';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getMessages(params: MessageRequest): Observable<MessagesResponse> {
    return this.http
      .post(
        `${this.BASE_URL}messages`,
        JSON.stringify(params),
        this.httpOptions
      )
      .pipe(
        map(
          (response: MessagesResponse) => {
            return response;
          },
          (error) => {
            throw error;
          }
        )
      );
  }
}

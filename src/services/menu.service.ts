import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment'


@Injectable()
export class MenusService {

  constructor(private http: HttpClient) {}

  getMenus() {
    return this.http.get(environment.apiUrl+'api/v1/menu/menu');

    }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MenusService {

  constructor(private http: HttpClient) {}

  getMenus() {
    return this.http.get('http://localhost:8080/api/v1/menu/menu');

    }

}

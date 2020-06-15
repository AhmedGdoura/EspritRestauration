import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment'

@Injectable()
export class UpdateProfileService {

  constructor(private http: HttpClient) {
  }

  update(user: any, file: any) {
    console.log(file == null);
    let menuData: FormData;
      menuData = new FormData();
      menuData.append('email', user.email);
      menuData.append('name', user.name);
      menuData.append('lastname', user.lastname);
      menuData.append('phone', user.phone);
      if(file != null){
      menuData.append('image', file, user.email);
      }
    return this.http
      .put(environment.apiUrl+'api/v1/users/update-data/', menuData);
    }

}

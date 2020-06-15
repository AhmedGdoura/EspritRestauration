import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment'
@Injectable()
export class ProductDetailsService {

  constructor(private http: HttpClient) {}

  getDetails(plate: any) {
    return this.http.get(environment.apiUrl+'api/v1/composition/get-data/' + plate);

    }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProductDetailsService {

  constructor(private http: HttpClient) {}

  getDetails(plate: any) {
    return this.http.get('http://localhost:8080/api/v1/composition/get-data/' + plate);

    }

}

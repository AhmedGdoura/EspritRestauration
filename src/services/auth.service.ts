import { Platform, AlertController } from "ionic-angular";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tap, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

const TOKEN_KEY = 'token';

@Injectable()
export class AuthService {
  token=null;
  user = new  BehaviorSubject(null);


  constructor(private http: HttpClient, private helper: JwtHelperService,
    private plt: Platform, private alertController: AlertController) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    this.token=localStorage.getItem(TOKEN_KEY);
      if (this.token) {
        let decoded = this.helper.decodeToken(this.token);
        let isExpired = this.helper.isTokenExpired(this.token);

        if (!isExpired) {
          this.user.next(decoded);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      }
  }

  /* register(credentials) {
    return this.http.post(`${this.url}/api/register`, credentials).pipe(
      catchError(e => {
        this.showAlert(e.error.msg);
        throw new Error(e);
      })
    );
  } */

  login(email: String, password: String) {
    return this.http.post(`http://localhost:8080/api/v1/users/authenticateuser`, {email: email, password: password})
      .pipe(
        tap(res => {
          localStorage.setItem(TOKEN_KEY, res['token']);
          this.user.next(this.helper.decodeToken(res['token']));
        })
      );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
      this.user.next(null)
  }

  /* getSpecialData() {
    return this.http.get(`${this.url}/api/special`).pipe(
      catchError(e => {
        let status = e.status;
        if (status === 401) {
          this.showAlert('You are not authorized for this!');
          this.logout();
        }
        throw new Error(e);
      })
    )
  } */




  showAlert(message) {
    let alert = this.alertController.create({
      subTitle: message,
      buttons: ["OK"],
    });
    alert.present();
  }

  getUserInfo (email: any) {
    return this.http.get(`http://localhost:8080/api/v1/users/get-data/`+email);

  }

}

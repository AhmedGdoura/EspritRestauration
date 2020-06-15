import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  LoadingController,
  Platform,
  AlertController,
  Events
} from "ionic-angular";
import { CustomValidators } from "ng2-validation";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from "@angular/fire/database";
import { Facebook } from "@ionic-native/facebook";
import * as firebase from "firebase";
import { GooglePlus } from "@ionic-native/google-plus";
import { TwitterConnect } from "@ionic-native/twitter-connect";
import { AuthService } from "../../services/auth.service"

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html",
  providers: [Facebook, GooglePlus, TwitterConnect]
})
export class LoginPage {
  tagHide: boolean = true;
  valForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public fb: FormBuilder,
    public af: AngularFireAuth,
    public db: AngularFireDatabase,
    public facebook: Facebook,
    public googlePlus: GooglePlus,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public twitter: TwitterConnect,
    public platform: Platform,
    public events: Events,
    public auth: AuthService,
  ) {
    this.valForm = fb.group({
      email: [
        "",
        Validators.compose([Validators.required, CustomValidators.email])
      ],
      password: ["", Validators.required]
    });
  }

  toggleRegister() {
    this.tagHide = this.tagHide ? false : true;
  }

  OnLogin($ev, value: any) {
    $ev.preventDefault();
    for (let c in this.valForm.controls) {
      this.valForm.controls[c].markAsTouched();
    }
    if (this.valForm.valid) {
      /* this.af.auth.signInWithEmailAndPassword(value.email, value.password).then((success: any) => {
        localStorage.setItem("uid", success.uid);
        this.publishEvent();
        this.navCtrl.setRoot("HomePage");
      }) */
      this.auth.login(value.email, value.password).subscribe(
        ()=>{
          this.publishEvent();
          this.navCtrl.setRoot("HomePage");
        },

        (error) => {
          this.showAlert(error.message);
        }
      )
    }
  }

  private publishEvent() {
    /* this.db.object("/users/" + this.af.auth.currentUser.uid).valueChanges().subscribe((userInfo: any) => {
      console.log(userInfo);
      this.events.publish("imageUrl", userInfo);
    }); */

    this.auth.user.subscribe((userInfo: any)=> {
      if(userInfo!=null){
        this.auth.getUserInfo(userInfo.message.email).subscribe(res => {this.events.publish("imageUrl", res);})
      }
    })
  }

  showAlert(message) {
    let alert = this.alertCtrl.create({
      subTitle: message,
      buttons: ["OK"]
    });
    alert.present();
  }

  Register() {
    this.navCtrl.setRoot("RegistrationPage");
  }

  onClickForgotPassword() {
    this.navCtrl.setRoot("ForgotPasswordPage");
  }
}

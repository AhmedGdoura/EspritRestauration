import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ToastController,
  LoadingController,
  Platform,
  Events,
} from "ionic-angular";
import { NgForm } from "@angular/forms";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from "@angular/fire/database";
import { TranslateService } from "@ngx-translate/core";
import * as firebase from "firebase/app";
import { AuthService } from "../../services/auth.service";
import {  UpdateProfileService } from "../../services/updateProfile.service";
@IonicPage()
@Component({
  selector: "page-settings",
  templateUrl: "settings.html",
})
export class Settings {
  user: any = {};
  url: any = null;
  value: any;
  options = [
    {
      language: "english",
      value: "en",
    },
    {
      language: "français",
      value: "fr",
    },
    {
      language: "العربية",
      value: "ar",
    },
  ];
  public file: any = {};
  public storageRef = firebase.storage();

  constructor(
    public af: AngularFireAuth,
    public db: AngularFireDatabase,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public platform: Platform,
    public translate: TranslateService,
    public events: Events,
    public auth: AuthService,
    public updateProfile: UpdateProfileService,
  ) {
    let value = localStorage.getItem("language");
    this.value = value != null ? value : "en";
    this.translate.setDefaultLang("en");
  }

  ngOnInit() {
    /* if (this.af.auth.currentUser) {
      this.db
        .object("/users/" + this.af.auth.currentUser.uid)
        .valueChanges()
        .subscribe((res: any) => {
          this.user = res;
          this.user.image = res.image ? res.image : "";
          this.url = res.image ? res.image : "assets/img/profile.jpg";
        });
    } */

    this.auth.user.subscribe((userInfo: any) => {
      console.log(userInfo);
      if (userInfo != null) {
        this.auth.getUserInfo(userInfo.message.email).subscribe((res) => {
          this.user = res;
          this.url = this.user.imagePath;
          console.log(res);
        });
      }
    });
  }

  readUrl(event) {
    this.file = (<HTMLInputElement>document.getElementById("file")).files[0];
    /* let metadata = {
      contentType: "image/*"
    };
    let loader = this.loadingCtrl.create({
      content: "please wait.."
    });
    loader.present();
    this.storageRef
      .ref()
      .child("profile/" + this.file.name)
      .put(this.file, metadata)
      .then(res => {
        this.user.image = res.downloadURL;
        this.url = res.downloadURL;
        this.db
          .object("users" + "/" + this.af.auth.currentUser.uid + "/image")
          .set(res.downloadURL);
        loader.dismiss();
      })
      .catch(error => {
        loader.dismiss();
      }); */
    let loader = this.loadingCtrl.create({
      content: "please wait..",
    });
    loader.present();
    const reader = new FileReader();
    reader.onload = () => {
      this.url = reader.result as string;
      loader.dismiss();
    };
    if(this.file != null){
      reader.readAsDataURL(this.file);
    }
  }

  changeLanguage() {
    localStorage.setItem("language", this.value);
    if (this.value == "fr") {
      this.platform.setDir("ltr", true);
      this.translate.use("fr");
    } else if (this.value == "ar") {
      this.platform.setDir("rtl", true);
      this.translate.use("ar");
    } else {
      this.platform.setDir("ltr", true);
      this.translate.use("en");
    }
  }

  onSubmit(user: NgForm) {
    /* if (this.af.auth.currentUser) {
      this.db
        .object("/users/" + this.af.auth.currentUser.uid)
        .update({
          name: this.user.name,
          image: this.user.image,
          email: this.user.email,
          mobileNo: this.user.mobileNo,
        })
        .then(() => {
          this.createToaster("user information updated successfully", 3000);
          this.events.publish("imageUrl", this.user);
        });
    } */
   this.updateProfile.update (this.user, this.file).subscribe ( res => {
    this.createToaster("user information updated successfully", 3000);
    this.events.publish("imageUrl", res);
    this.file = null;
   });
  }

  createToaster(message, duration) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
    });
    toast.present();
  }
}

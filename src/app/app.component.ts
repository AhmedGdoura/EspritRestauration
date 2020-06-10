import { Component, ViewChild, OnInit } from "@angular/core";
import { Nav, Platform, Events } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from "@angular/fire/database";

import { OneSignal } from "@ionic-native/onesignal";
import { SocialSharing } from "@ionic-native/social-sharing";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "../services/auth.service"
import { SocketService } from "../services/socket.service"

@Component({
  templateUrl: "app.html",
  selector: "MyApp",
  providers: [StatusBar, SplashScreen, OneSignal, SocialSharing]
})
export class MyApp implements OnInit {
  @ViewChild(Nav) nav: Nav;
  user: any;
  Cart: any = [];
  noOfItemsInCart: any;
  noOfItemsInFevrt: any;
  noOfItemsInNews: any;
  noOfItemsInOffer: any;
  name: any;
  imageUrl: any = "assets/img/profile.jpg";
  rootPage: string = "HomePage";
  public uid: string;

  constructor(
    public af: AngularFireAuth,
    public db: AngularFireDatabase,
    public platform: Platform,
    public statusbar: StatusBar,
    public splashscreen: SplashScreen,
    public socialSharing: SocialSharing,
    private oneSignal: OneSignal,
    private events: Events,
    private translateService: TranslateService,
    private auth: AuthService,
    private socket: SocketService,
  ) {
    this.initializeApp();
    this.auth.user.subscribe((userInfo: any) => {
      if (userInfo != null) {
        this.auth.getUserInfo(userInfo.message.email).subscribe( res => {
          this.user = res;
          this.establishSocketConnection();
          this.name = this.user.name;
          this.imageUrl = this.user.imagePath;


        });
      }
      else {
        this.name = 'USER'
      }
    });
  }

  ngOnInit() {
 /*    this.uid = localStorage.getItem("uid");
    if (this.uid != null) {
      this.db
        .object("/users/" + this.uid)
        .valueChanges()
        .subscribe((res: any) => {
          if (res != null) {
            this.name = res.name;
            this.imageUrl =
              res.image != "" && res.image != null
                ? res.image
                : "assets/img/profile.jpg";
          } else {
            this.name = 'USER'
            this.imageUrl = 'assets/img/profile.jpg';
          }

        });
    } */

    this.useTranslateService();
    this.getNewsCount();
    this.getOfferCount();
    this.listenEvents();
  }

  async establishSocketConnection() {
    try {

      if (
        this.user.email === '' ||
        typeof this.user.email === 'undefined' ||
        this.user.email === null
      ) {
        alert('error email not found');
      } else {

        /* making socket connection by passing UserId. */
        await this.socket.connectSocket(this.user.email, this.user.role);
      }
    } catch (error) {
      console.log('heyyyyy'+error);
    }
  }

  private getNewsCount() {
    this.db
      .list("/news")
      .valueChanges()
      .subscribe(res => {
        this.noOfItemsInNews = res.length;
      });
  }

  private getOfferCount() {
    this.db
      .list("/menuItems", ref => ref.orderByChild("offer").equalTo(true))
      .valueChanges()
      .subscribe(queriedItems => {
        this.noOfItemsInOffer = queriedItems.length;
      });
  }

  private listenEvents() {
    this.events.subscribe("imageUrl", response => {
      this.imageUrl =
        response.imagePath != "" && response.imagePath != null
          ? response.imagePath
          : "assets/img/profile.jpg";
      this.name = response.name;
    });
  }

  private useTranslateService() {
    let value = localStorage.getItem("language");
    let language = value != null ? value : "en";
    language == "ar"
      ? this.platform.setDir("rtl", true)
      : this.platform.setDir("ltr", true);
    this.translateService.use(language);
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  initializeApp() {
    this.db.object('/settings/currency').valueChanges().subscribe(res => {
      localStorage.setItem('currency', JSON.stringify(res));
    }, err => {
      localStorage.setItem('currency', JSON.stringify({ currencyName: 'USD', currencySymbol: '$' }));
    });
    if (this.platform.ready()) {
      this.platform.ready().then(res => {
        if (res == "cordova") {
          this.oneSignal.startInit(
            "9740a50f-587f-4853-821f-58252d998399",
            "714618018341"
          );
          this.oneSignal.getIds().then(response => {
            if (this.uid != null) {
              this.uid = localStorage.getItem("uid");
              localStorage.setItem('playerId', response.userId);
              this.db.object("/users/" + this.uid).update({
                playerId: response.userId
              });
            }
          });
          this.oneSignal.inFocusDisplaying(
            this.oneSignal.OSInFocusDisplayOption.InAppAlert
          );
          this.oneSignal.handleNotificationReceived().subscribe(() => { });
          this.oneSignal.handleNotificationOpened().subscribe(() => { });
          this.oneSignal.endInit();
        }
      });
    }
  }

  home() {
    this.nav.setRoot("HomePage");
  }

  yourOrders() {
    this.nav.push("OrderListPage");
  }

  addToCart() {
    this.nav.push("CartPage");
  }

  catagory() {
    this.nav.push("CategoryPage");
  }

  favourite() {
    this.nav.push("FavouritePage");
  }

  offer() {
    this.nav.push("OfferPage");
  }

  news() {
    this.nav.push("NewsPage");
  }

  contact() {
    this.nav.push("ContactPage");
  }

  aboutUs() {
    this.nav.push("AboutUsPage");
  }

  settings() {
    this.nav.push("Settings");
  }

  invite() {
    this.socialSharing.share(
      "share Restaurant App with friends to get credits",
      null,
      null,
      "https://ionicfirebaseapp.com/#/"
    );
  }

  chat() {
    this.nav.push("ChatPage");
  }
  tableBooking() {
    this.nav.push("TableBookingPage");
  }
  bookingHistory() {
    this.nav.push("BookingHistoryPage");
  }

  login() {
    this.nav.setRoot("LoginPage");
  }

  logout() {
    /* this.af.auth.signOut(); */
    this.socket.logout(this.user.email, this.user.role);
    this.auth.logout();
    localStorage.removeItem("uid");
    localStorage.removeItem('playerId');
    this.imageUrl = "assets/img/profile.jpg";
    this.nav.setRoot("HomePage");
  }

  isLoggedin() {
    return localStorage.getItem("token") != null;

  }

  isCart() {
    this.Cart = JSON.parse(localStorage.getItem("Cart"));
    this.noOfItemsInCart = this.Cart != null ? this.Cart.length : null;
    return true;
  }
}

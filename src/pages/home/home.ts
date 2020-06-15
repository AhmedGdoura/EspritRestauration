import { Component } from "@angular/core";
import { IonicPage, NavController, LoadingController } from "ionic-angular";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { MenusService } from "../../services/menu.service";

@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  mySlideOptions = {
    initialSlide: 1,
    loop: true,
    autoplay: 2000,
    pager: false
  };
  menu : any =[];
  Cart: any = [];
  noOfItems: any;
  uid;

  public ComingData: Array<any> = [];
  public Categories: Array<any> = [];
  comingData: AngularFireList<any>;
  categories: AngularFireList<any>;

  constructor(
    public navCtrl: NavController,
    public af: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public menuService: MenusService,
  ) {

    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present().then(() => {
      this.comingData = af.list("/coming");
      /* this.categories = af.list("/categories"); */
      this.comingData.valueChanges().subscribe(data => {
        this.ComingData = data;
      });

      this.menuService.getMenus().subscribe((res)=> {
        var order = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
       this.menu=res
      this.menu.sort(function (a, b) {
      return order[a._id] - order[b._id];
      });
      loader.dismiss();
      });
      /* this.categories.snapshotChanges()
        .pipe(
          map(changes =>
            changes.map(c => ({ $key: c.payload.key, ...c.payload.val() }))
          )
        ).subscribe((data: any) => {
          this.Categories = data;
          console.log(this.Categories);
          loader.dismiss();
        }) */

      // .subscribe(data => {
      //   this.Categories = [];
      //   data.forEach(item => {
      //     let temp = item.payload.toJSON();
      //     temp["$key"] = item.payload.key;
      //     this.Categories.push(temp);
      //   });
      //   loader.dismiss();
      // });
    });
  }

  ionViewWillEnter() {
    this.Cart = JSON.parse(localStorage.getItem("Cart"));
    this.noOfItems = this.Cart != null ? this.Cart.length : null;
    this.uid = localStorage.getItem('uid');
    if (this.uid != null) {
      if (localStorage.getItem("playerId")) {
        this.af.object("/users/" + this.uid).update({
          playerId: localStorage.getItem("playerId")
        });
      }
    }
  }

  navigate(item) {
    console.log(item)
    this.navCtrl.push("ProductDetailsPage", { plate: item});
  }

  navcart() {
    this.navCtrl.push("CartPage");
  }
}

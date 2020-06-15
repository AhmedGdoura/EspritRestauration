import { Component } from "@angular/core";
import { IonicPage, NavController, LoadingController } from "ionic-angular";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
//import { map } from "rxjs/operators";
import { MenusService } from "../../services/menu.service";
@IonicPage()
@Component({
  selector: "page-category",
  templateUrl: "category.html"
})
export class CategoryPage {
  noOfItems: any;
  public Categories: Array<any> = [];
  categories: AngularFireList<any>;
  menu: any = [];

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
     /*  this.categories = af.list("/categories");
      this.categories.snapshotChanges()
        .pipe(
          map(changes =>
            changes.map(c => ({ $key: c.payload.key, ...c.payload.val() }))
          )
        ).subscribe((res: any) => {
          this.Categories = res;
        }) */


        this.menuService.getMenus().subscribe((res)=> {
          var order = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
         this.menu=res
        this.menu.sort(function (a, b) {
        return order[a._id] - order[b._id];
        });
        loader.dismiss();
      });

      // .subscribe(data => {
      //   this.Categories = [];
      //   loader.dismiss();
      //   data.forEach(item => {
      //     let temp = item.payload.toJSON();
      //     temp["$key"] = item.payload.key;
      //     this.Categories.push(temp);
      //   });
      // });

    });
  }

  ionViewWillEnter() {
    let cart: Array<any> = JSON.parse(localStorage.getItem("Cart"));
    this.noOfItems = cart != null ? cart.length : null;
  }

  navigate(item) {
    this.navCtrl.push("ProductDetailsPage", { plate: item });
  }

  navcart() {
    this.navCtrl.push("CartPage");
  }
}

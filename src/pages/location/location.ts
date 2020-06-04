import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-location",
  templateUrl: "location.html"
})
export class LocationPage {
  title: string = "My location ";
  lat: number = 36.8992023;
  lng: number = 10.1887374;
  zoom: number = 15;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}
}

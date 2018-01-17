import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-gold-map',
  templateUrl: 'gold-map.html',
})
export class GoldMapPage {
  rotate = true;
  boxRotate = true;
  icon = 'assets/img/icon-phone.png';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GoldMapPage');
  }

  scale(){
    if(this.rotate){
      this.rotate = false;
      this.boxRotate = false;
      this.icon = 'assets/img/icon-phone1.png';
    }else{
      this.rotate = true;
      this.boxRotate = false;
      this.icon = 'assets/img/icon-phone.png';
    }

  }

}

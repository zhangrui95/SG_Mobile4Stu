import {Component, Input} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-group-index',
  templateUrl: 'group-index.html',
})
export class GroupIndexPage {
  @Input()
  s_data :any=new Object();

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupIndexPage');
  }

}

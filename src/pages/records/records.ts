import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-records',
  templateUrl: 'records.html',
})
export class RecordsPage {
  list = [
    {img:'assets/img/t4.png',name:'2008年北京毒奶粉事件',time:'2017-11-11'},
    {img:'assets/img/t2.png',name:'北京毒奶粉事件',time:'2017-12-12'},
    {img:'assets/img/t3.png',name:'2008年北京毒奶粉事件',time:'2017-12-29'}
    ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecordsPage');
  }

}

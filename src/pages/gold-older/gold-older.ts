import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-gold-older',
  templateUrl: 'gold-older.html',
})
export class GoldOlderPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GoldOlderPage');
  }

  issue = '你当前的地点路线？';
  options = [
    {id:'0',option:'A', text:'王陵AA -> 村庄BB -> 绿洲CC'},
    {id:'1',option:'B', text:'村庄BB -> 王陵AA -> 绿洲CC'},
    {id:'2',option:'C', text:'绿洲CC -> 村庄BB -> 王陵AA'}
  ];

}

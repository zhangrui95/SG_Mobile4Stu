import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {UserData} from "../../providers/user-data";
@IonicPage()
@Component({
  selector: 'page-gold-decision',
  templateUrl: 'gold-decision.html',
})
export class GoldDecisionPage {
  issue = '我的决策页面，决策内容为？';
  options = [
    {id:'0',option:'A', text:'决策页面1'},
    {id:'1',option:'B', text:'决策页面2'},
    {id:'2',option:'C', text:'决策页面3'}
  ];


  constructor(public navCtrl: NavController, public navParams: NavParams,public userData: UserData, public http: ProxyHttpService) {

  }

}

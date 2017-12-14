import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UsersPage} from "../users/users";

@IonicPage()
@Component({
  selector: 'page-decision',
  templateUrl: 'decision.html',
})
export class DecisionPage {

  issue = '若你作为辉发乳业（集团）股份有限公司的决策者，关注到网贴后该如何决策？';
  options = [
    {id:'0',option:'A', text:'公开调查帖子内容的真实性'},
    {id:'1',option:'B', text:'私下联系发帖人，删除网帖，控制消息的网络传播渠道'},
    {id:'2',option:'C', text:'公开调查帖子内容的真实性'}
  ]
  Id;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  getForm(item){
    this.Id = item.id;
  }

  getUser(){
    this.navCtrl.push(UsersPage);
  }

  vote(){
    console.log(this.Id);
  }
}

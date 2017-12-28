import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-grouping',
  templateUrl: 'grouping.html',
})
export class GroupingPage {
  groupList;
  list = [
    {name:'地方政府', num:'07'},
    {name:'辉发乳业', num:'11'},
    {name:'三特食品', num:'34'},
    {name:'地方政府', num:'97'},
    {name:'辉发乳业', num:'25'}
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.groupList = this.navParams.get('groupList');
    this.list = this.groupList;
  }

  getJoin(){
    console.log(this.groupList);
  }

}

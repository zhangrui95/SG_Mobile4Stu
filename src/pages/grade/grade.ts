import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UsersPage} from "../users/users";

@IonicPage()
@Component({
  selector: 'page-grade',
  templateUrl: 'grade.html',
})
export class GradePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  getUser(){
    this.navCtrl.push(UsersPage);
  }

}

import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import {Keyboard, NavController, ToastController} from 'ionic-angular';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';

import { TabsPage } from '../tabs-page/tabs-page';
import { SignupPage } from '../signup/signup';


@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: UserOptions = { username: '', password: '' };
  submitted = false;

  constructor(public navCtrl: NavController, public userData: UserData,public keyBoard:Keyboard,public toast:ToastController) {

    this.keyBoard.onClose(this.closeCallback)
  }
  closeCallback() {
    // call what ever functionality you want on keyboard close
    this.toast.create()
    console.log('Closing time');
  }
  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      // this.userData.login(this.login.username);
      this.navCtrl.push(TabsPage);
    }
  }

  onSignup() {
    this.navCtrl.push(SignupPage);
  }
}

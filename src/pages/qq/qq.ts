import { Component } from '@angular/core';
import {
  IonicPage, NavController, NavParams, ActionSheetController, AlertController,
  LoadingController, ToastController
} from 'ionic-angular';
import { PasswordPage } from "../password/password"
import { PhonePage } from '../phone/phone'
import { UpdatePage } from '../update/update'
import { LoginsPage } from '../logins/logins'
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {UserData} from "../../providers/user-data";

@IonicPage()
@Component({
  selector: 'page-qq',
  templateUrl: 'qq.html',
})
export class QQPage {
  name;
  phone;
  userId;
  imagepath;
  avatar = "assets/img/header.png";
  videoimg = "assets/img/video.png";

  isShow=false;
  src='assets/img/juxing-10.png';
  mousedownd() {
    this.isShow = true
    this.src = 'assets/img/yuyin-3.png';
  }

  mouseup() {
    this.isShow = false
    this.src = 'assets/img/juxing-10.png';
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public actionSheetCtrl: ActionSheetController,
              public alertCtrl: AlertController,
              public userData: UserData,
              public http: ProxyHttpService,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController) {
    this.userData.getUsername().then(value => this.name = value)
    this.phone = navParams.get('phone');
    this.userData.getUserID().then(value => this.userId = value)

  }

  goChangePhone() {
    this.navCtrl.push(PhonePage, {userId: this.userId});
  }

  goChangePassword() {
    this.navCtrl.push(PasswordPage, {userId: this.userId});
  }

  goUpdate() {
    this.navCtrl.push(UpdatePage);
  }

  getOut() {
    this.userData.logout();
    this.navCtrl.push(LoginsPage);

  }
}

import { Component } from '@angular/core';
import {IonicApp, IonicPage, Keyboard, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {UsersPage} from "../users/users";
import {ClassroomPage} from "../classroom/classroom";
import {RecordsPage} from "../records/records";
import {SimulationPage} from "../simulation/simulation";

@IonicPage()
@Component({
  selector: 'page-index',
  templateUrl: 'index.html',
})
export class IndexPage {
  name;
  phone;
  userId;
  imagepath;
  private registerBackEvent: Function
  registerBackButton


  exitApp() {

    let activePortal = this.ionicApp._modalPortal.getActive() ||this.ionicApp._toastPortal.getActive() || this.ionicApp._loadingPortal.getActive() || this.ionicApp._overlayPortal.getActive();
    if (activePortal) {
      activePortal.dismiss().catch(() => {});
      activePortal.onDidDismiss(() => {});
      return;
    }
    if(this.keyboard.isOpen()){
      this.keyboard.close()
      return
    }
    if(!this.platform.url().endsWith("logins")&&!this.platform.url().endsWith("index")){
      this.navCtrl.pop()
      return
    }
    if (this.registerBackButton) {
      this.platform.exitApp()
    } else {
      this.registerBackButton = true
      this.toastCtrl.create({
        message: '再按一次退出应用',
        duration: 2000,
        position: 'bottom',
        cssClass: 'toast-black'
      }).present();
      setTimeout(() => this.registerBackButton = false, 2000);//2秒内没有再次点击返回则将触发标志标记为false
    }
  }
  constructor(public ionicApp:IonicApp,public navCtrl: NavController, public navParams: NavParams,   public keyboard:Keyboard,public toastCtrl: ToastController,
              public platform: Platform,) {
    this.registerBackEvent = this.platform.registerBackButtonAction(() => {

      this.exitApp()
    }, 10)
    this.name = navParams.get('name');
    this.phone = navParams.get('phone');
    this.userId = navParams.get('userId');
    this.imagepath = navParams.get('imagepath');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndexPage');
  }

  getUser(){
    this.navCtrl.push(UsersPage, {userId: this.userId, name:this.name, phone:this.phone,imagepath: this.imagepath});
  }

  getClassRoom(){
    this.navCtrl.push(ClassroomPage, {userId: this.userId, name:this.name, phone:this.phone});
  }

  getRecords(){
    this.navCtrl.push(RecordsPage, {userId: this.userId, name:this.name, phone:this.phone});
  }

  getSimulation(){
    this.navCtrl.push(SimulationPage, {userId: this.userId, name:this.name, phone:this.phone});
  }

}

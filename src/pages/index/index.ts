import {Component} from '@angular/core';
import {IonicApp, IonicPage, Keyboard, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {UsersPage} from "../users/users";
import {ClassroomPage} from "../classroom/classroom";
import {RecordsPage} from "../records/records";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";

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

    let activePortal = this.ionicApp._modalPortal.getActive() || this.ionicApp._toastPortal.getActive() || this.ionicApp._loadingPortal.getActive() || this.ionicApp._overlayPortal.getActive();
    if (activePortal) {
      activePortal.dismiss().catch(() => {
      });
      activePortal.onDidDismiss(() => {
      });
      return;
    }
    if (this.keyboard.isOpen()) {
      this.keyboard.close()
      return
    }
    if (!this.platform.url().endsWith("logins") && !this.platform.url().endsWith("index")) {
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

  constructor(public ionicApp: IonicApp, public navCtrl: NavController, public barcodeScanner: BarcodeScanner, public navParams: NavParams, public keyboard: Keyboard, public toastCtrl: ToastController,
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

  getUser() {
    this.navCtrl.push(UsersPage, {userId: this.userId, name: this.name, phone: this.phone, imagepath: this.imagepath});
  }
  showToast(position: string, text: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: position
    });
    toast.present(toast);
  }
  getClassRoom() {
    this.barcodeScanner.scan({resultDisplayDuration:0}).then((barcodeData) => {
      // Success! Barcode data is here
      if(!barcodeData.cancelled){

        if (barcodeData.text.indexOf('4dec1f9e20f86b62335ba913ae29fa0d')!=-1 ) {
          let data=JSON.parse(barcodeData.text)
          this.navCtrl.push(ClassroomPage, {data:data});
        } else{
          this.showToast('bottom',"扫描到的二维码有误，请重新尝试")
        }
      }

    }, (err) => {
      // An error occurred
      console.log(err)
      this.showToast('bottom',"扫描到的二维码有误，请重新尝试")
    });

  }

  getRecords() {
    this.navCtrl.push(RecordsPage, {userId: this.userId, name: this.name, phone: this.phone});
  }

}

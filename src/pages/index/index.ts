import {Component} from '@angular/core';
import {IonicApp, IonicPage, Keyboard, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {UsersPage} from "../users/users";
import {ClassroomPage} from "../classroom/classroom";
import {RecordsPage} from "../records/records";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {SimulationPage} from "../simulation/simulation";
import {UserData} from "../../providers/user-data";
// import {GradePage} from "../grade/grade";
import {StatisticsPage} from "../statistics/statistics";
import {ProxyHttpService} from "../../providers/proxy.http.service";

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
              public platform: Platform, public userData:UserData,
              public http: ProxyHttpService,) {
    this.registerBackEvent = this.platform.registerBackButtonAction(() => {
      this.userData.getUserID().then(value => this.userId=value)
      this.exitApp()
    }, 10)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndexPage');
  }

  getUser() {
    this.navCtrl.push(UsersPage);
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
      this.showToast('bottom',barcodeData.text+"")
      if(!barcodeData.cancelled){
        if (barcodeData.text.indexOf('4dec1f9e20f86b62335ba913ae29fa0d')!=-1 ) {
          let data=JSON.parse(barcodeData.text)
          this.showToast('bottom',data)
          const params = {"cla_id":data.cla_id,"cour_id":data.cour_id,"sim_id":data.sim_id,"u_id":this.userId}
          this.http.addClassPractice(params).subscribe(res => {
            console.log(res)
            if(res['code'] == 0){
              this.navCtrl.push(ClassroomPage, {data:data});
            }else{
              this.showToast('bottom', res['msg']);
            }
          });
        } else{
          this.showToast('bottom',"扫描到的二维码有误，请重新尝试");
        }
      }

    }, (err) => {
      // An error occurred
      console.log(err)
      this.showToast('bottom',"扫描到的二维码有误，请重新尝试")
    });

  }

  getRecords() {
    this.navCtrl.push(RecordsPage);
  }

  getSimulation(){
    this.navCtrl.push(SimulationPage);
  }



  getStatistics(){
    this.navCtrl.push(StatisticsPage);
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {UserData} from "../../providers/user-data";


@IonicPage()
@Component({
  selector: 'page-phone',
  templateUrl: 'phone.html',
})
export class PhonePage {
  oldPhone;
  newPhone;
  // pwd;
  userId;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: ProxyHttpService,
              public toastCtrl: ToastController,
              public userData:UserData,
              public loadingCtrl: LoadingController
  ) {
    this.userData.getUserID().then(value => this.userId=value)
  }
  save(){
    let loading = this.loadingCtrl.create({
      content: '修改中...'
    });
    let pattern = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
    if(this.oldPhone == null||this.newPhone == null){
      this.showToast('bottom','手机号不能为空');
    }else if(!pattern.test(this.newPhone)){
      this.showToast('bottom','新手机号输入不正确');
    }else{
      const params = {phone:this.oldPhone, newPhone:this.newPhone,userid:this.userId.toString()}
      this.http.updatePhone(params).subscribe(res => {
        if(res['code'] == 0){
          loading.dismiss();
          this.showToast('bottom',res['msg']);
        }else{
          loading.dismiss();
          this.showToast('bottom',res['msg']);
        }
      });
    }

  }

  showToast(position: string, text: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: position
    });

    toast.present(toast);
  }

}

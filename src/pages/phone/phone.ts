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
  Password;
  verificationCode;
  // pwd;
  Imgsrc = 'assets/img/xmm.png';
  showEye = false;
  type = 'password';
  userId;
  name;
  pattern = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
  verifyCode: any = {
    verifyCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  }
  noClick = false;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: ProxyHttpService,
              public toastCtrl: ToastController,
              public userData:UserData,
              public loadingCtrl: LoadingController
  ) {
    this.userData.getUserID().then(value => this.userId=value)
    this.userData.getUsername().then(value => this.name=value)
  }
  save(){
    let loading = this.loadingCtrl.create({
      content: '修改中...'
    });
    if(this.oldPhone == null||this.newPhone == null){
      this.showToast('bottom','手机号不能为空');
    }else if(!this.pattern.test(this.newPhone)){
      this.showToast('bottom','新手机号输入不正确');
    }else{
      const params = {phone:this.oldPhone,UserName:this.name, newPhone:this.newPhone,userid:this.userId.toString(),passWord:this.Password,VCode:this.verificationCode}
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

  settime() {
    if (this.verifyCode.countdown == 1) {
      this.verifyCode.countdown = 60;
      this.verifyCode.verifyCodeTips = "获取验证码";
      this.verifyCode.disable = true;
      this.noClick = false;
      return;
    } else {
      this.verifyCode.countdown--;
    }

    this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + ")";
    setTimeout(() => {
      this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + ")";
      this.settime();
    }, 1000);
  }
  countDown(){
    if(this.verifyCode.disable){
      if(this.oldPhone == null||this.newPhone == null){
        this.showToast('bottom','手机号不能为空');
      }else if(!this.pattern.test(this.newPhone)){
        this.showToast('bottom','新手机号输入不正确');
      }else{
        if(this.noClick){
          this.showToast('bottom', '不可重复获取');
        }else{
          this.noClick = true;
          const params = {phone:this.oldPhone,UserName:this.name,newPhone:this.newPhone,userid:this.userId.toString(),passWord:this.Password,VCode:''}
          this.http.updatePhone(params).subscribe(res => {
            if(res['code'] == 0){
              this.settime();
              this.verifyCode.disable = false;
              this.showToast('bottom',res['msg']);
            }else{
              this.showToast('bottom',res['msg']);
              this.verifyCode.disable = true;
              this.noClick = false;
            }
          });
        }
      }
    }
  }
  showText(){
    if(!this.showEye){
      this.Imgsrc = 'assets/img/eye-no.png';
      this.showEye = true;
      this.type = 'text';
    }else{
      this.Imgsrc = 'assets/img/xmm.png';
      this.showEye = false;
      this.type = 'password';
    }
  }

}

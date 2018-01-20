import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import {IonicPage, LoadingController, NavController, ToastController} from 'ionic-angular';
import { findPassword } from '../../interfaces/user-options';
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {LoginsPage} from "../logins/logins";
import {UserData} from "../../providers/user-data";

@IonicPage()
@Component({
  selector: 'page-find-password',
  templateUrl: 'find-password.html',
})
export class FindPasswordPage {
  name;
  userId;
  find: findPassword = { phone: '', password: '' , verificationCode: ''};
  submitted = false;
  Imgsrc = 'assets/img/xmm.png';
  showEye = false;
  type = 'password';
  verifyCode: any = {
    verifyCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  }
  noClick = false;

  constructor( public navCtrl: NavController,
               public http: ProxyHttpService,
               public userData:UserData,
               public toastCtrl: ToastController,
               public loadingCtrl: LoadingController) {
      this.userData.getUsername().then(value => this.name=value);
      this.userData.getUserID().then(value => this.userId=value);
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
        if(this.find.phone == ''){
          this.showToast('bottom', '手机号不能为空');
        }else{
          if(this.noClick){
            this.showToast('bottom', '不可重复获取');
          }else{
            this.noClick = true;
            const params = {Phone:this.find.phone,LoginPwd:this.find.password,VCode:''};
            console.log(params)
            this.http.initPass(params).subscribe(res => {
              if(res['code'] == 0){
                this.settime();
                this.verifyCode.disable = false;
              }else{
                this.showToast('bottom', res['msg']);
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

  showToast(position: string, text: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: position
    });
    toast.present(toast);
  }

  onFind(form: NgForm) {
    this.submitted = true;
    let loading = this.loadingCtrl.create({
      content: '提交中...'
    });
    if (form.valid) {
      const params = {UserName:this.name,Phone:this.find.phone,LoginPwd:this.find.password,VCode:this.find.verificationCode};
      this.http.initPass(params).subscribe(res => {
        if(res['code'] == 0){
          loading.dismiss();
          this.showToast('bottom',res['msg']);
          this.goLogin();
        }else{
          loading.dismiss();
          this.showToast('bottom',res['msg']);
        }
      });
    }
  }

  goLogin(){
    this.navCtrl.push(LoginsPage);
  }
}

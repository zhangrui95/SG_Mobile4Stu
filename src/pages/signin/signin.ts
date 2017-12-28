import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import {IonicPage, LoadingController, NavController, ToastController} from 'ionic-angular';

import { UserSign } from '../../interfaces/user-options';
import { LoginsPage } from "../logins/logins";
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {UserData} from "../../providers/user-data";


@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  login: UserSign = { username: '', password: '' , RealName: '', phone: '', verificationCode: ''};
  submitted = false;
  Imgsrc = 'assets/img/xmm.png';
  showEye = false;
  type = 'password';
  verifyCode: any = {
    verifyCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  }

  constructor( public navCtrl: NavController,
               public http: ProxyHttpService,
               public userData:UserData,
               public toastCtrl: ToastController,
               public loadingCtrl: LoadingController) { }

  onLogin(form: NgForm) {
    this.submitted = true;
    let loading = this.loadingCtrl.create({
      content: '注册中...'
    });
    if (form.valid) {
      loading.present();
      const params = {LoginName:this.login.username, LoginPwd:this.login.password, RealName:this.login.RealName, Phone:this.login.phone, VCode:this.login.verificationCode}
      this.http.register(params).subscribe(res => {
        if(res['code'] == 0){
          loading.dismiss();
          this.goLogin(this.login.username);
          this.showToast('bottom',res['msg']);
        }else{
          loading.dismiss();
          this.showToast('bottom',res['msg']);
        }
      });

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

  settime() {
    if (this.verifyCode.countdown == 1) {
      this.verifyCode.countdown = 60;
      this.verifyCode.verifyCodeTips = "获取验证码";
      this.verifyCode.disable = true;
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
      if(this.login.phone == ''){
        this.showToast('bottom', '手机号不能为空');
      }else{
        const params = {LoginName:this.login.username, LoginPwd:this.login.password, RealName:this.login.RealName, Phone:this.login.phone, VCode:''}
        this.http.register(params).subscribe(res => {
          console.log(res)
          this.settime();
          this.verifyCode.disable = false;
        });
      }
    }
  }

  goLogin(name:string){
    this.navCtrl.push(LoginsPage,{userName:name});
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

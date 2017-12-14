import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import {IonicPage, LoadingController, NavController, ToastController} from 'ionic-angular';
import { findPassword } from '../../interfaces/user-options';
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {LoginsPage} from "../logins/logins";

@IonicPage()
@Component({
  selector: 'page-find-password',
  templateUrl: 'find-password.html',
})
export class FindPasswordPage {


  find: findPassword = { phone: '', password: '' , password1: '', verificationCode: ''};
  submitted = false;
  Imgsrc = 'assets/img/eye.png';
  showEye = false;
  type = 'password';
  verifyCode: any = {
    verifyCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  }

  constructor( public navCtrl: NavController,
               public http: ProxyHttpService,
               public toastCtrl: ToastController,
               public loadingCtrl: LoadingController) { }

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
      this.settime();
      this.verifyCode.disable = false;
    }
  }

  showText(){
    if(!this.showEye){
      this.Imgsrc = 'assets/img/eye-no.png';
      this.showEye = true;
      this.type = 'text';
    }else{
      this.Imgsrc = 'assets/img/eye.png';
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
    if (form.valid) {

    }
  }

  goLogin(){
    this.navCtrl.push(LoginsPage);
  }
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {UserData} from "../../providers/user-data";
import {UsersPage} from "../users/users";

@IonicPage()
@Component({
  selector: 'page-password',
  templateUrl: 'password.html',
})
export class PasswordPage {
  oldpwd;
  newpwd;
  newpwds;
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
    if(this.oldpwd==null||this.newpwd==null||this.newpwds==null){
      this.showToast('bottom', '密码不能为空');
    }else{
      if(this.newpwd === this.newpwds){
        const params = {userid:this.userId.toString(),password:this.oldpwd,newPass:this.newpwd}
        this.http.updatePass(params).subscribe(res => {
          if(res['code'] == 0){
            loading.dismiss();
            this.showToast('bottom',res['msg']);
            this.navCtrl.push(UsersPage);
          }else{
            loading.dismiss();
            this.showToast('bottom',res['msg']);
          }
        });
      } else {
        this.showToast('bottom', '两次密码输入不一致，请重新输入！');
      }
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

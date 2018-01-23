import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import { Keyboard, LoadingController, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {UserOptions} from '../../interfaces/user-options';
import {SigninPage} from "../signin/signin";
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {IndexPage} from "../index/index";
import {UserData} from "../../providers/user-data";
import {FindPasswordPage} from "../find-password/find-password";
import {ServerSocket} from "../../providers/ws.service";

@Component({
  selector: 'page-logins',
  templateUrl: 'logins.html',
})
export class LoginsPage {
  private registerBackEvent: Function
  registerBackButton
  login: UserOptions = {username: '', password: ''};
  submitted = false;
  Imgsrc = 'assets/img/xmm.png';
  showEye = false;
  type = 'password';
  exitApp() {
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

  constructor(public navCtrl: NavController,
              public userData:UserData,
              public http: ProxyHttpService,
              public toastCtrl: ToastController,
              public platform: Platform,
              public navParams: NavParams,
              public keyboard:Keyboard,
              public ws :ServerSocket,
              public loadingCtrl: LoadingController) {

    this.registerBackEvent = this.platform.registerBackButtonAction(() => {

      this.exitApp()
    }, 10)

  }
  ionViewDidLoad() {
    if(this.navParams.get('userName')){
      this.login.username=this.navParams.get('userName')
    }else{
      this.userData.getLoginName().then(value => this.login.username=value)
    }

  }




  onLogin(form: NgForm) {
    this.submitted = true;
    let loading = this.loadingCtrl.create({
      content: '登录中...'
    });
    if (form.valid) {
      loading.present();
      const params = {LoginName: this.login.username, LoginPwd: this.login.password}
      this.http.login(params).subscribe(res => {
        if (res['code'] == 0) {
          loading.dismiss();
          this.navCtrl.push(IndexPage, {
            userid: '',
            name: res['username'],
            phone: res['phone'],
            token:res['token'],
            userId: res['userId'],
            imagepath: res['imagepath']
          });
          let ImagePath = this.http.getBaseurl() + res['imagepath'];
          this.userData.login(res['username'],res['token'],res['userId'],ImagePath,res['phone'], this.login.username)
        } else {
          loading.dismiss();
          this.showToast('bottom', res['msg']);
        }
      });
    }
  }

  onSignup() {
    this.navCtrl.push(SigninPage);
  }

  goFindPassword() {
    this.navCtrl.push(FindPasswordPage);
  }

  showToast(position: string, text: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: position
    });

    toast.present(toast);
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

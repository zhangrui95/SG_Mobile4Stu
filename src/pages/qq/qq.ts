import {Component} from '@angular/core';
import {
  IonicPage, NavController, NavParams, ToastController
} from 'ionic-angular';
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {UserData} from "../../providers/user-data";
import {Subscription} from "rxjs/Subscription";
import {ServerSocket} from "../../providers/ws.service";
import {DomSanitizer} from "@angular/platform-browser";

@IonicPage()
@Component({
  selector: 'page-qq',
  templateUrl: 'qq.html',
})
export class QQPage {
  items = [];
  param: any;
  isShow = false;
  datas: any;
  data_list: any;
  value: '';
  name;
  phone;
  userId;
  imagepath;
  avatar = "assets/img/header.png";
  videoimg = "assets/img/video.png";

  src = 'assets/img/juxing-10.png';

  mousedownd() {
    this.isShow = true
    this.src = 'assets/img/yuyin-3.png';
  }

  mouseup() {
    this.isShow = false
    this.src = 'assets/img/juxing-10.png';
  }

  private socketSubscription: Subscription

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userData: UserData,
              public http: ProxyHttpService,
              public toastCtrl: ToastController,
              public ws: ServerSocket,
              public sanitizer: DomSanitizer) {
    this.userData.getUsername().then(value => this.name = value)
    this.phone = navParams.get('phone');
    this.userData.getUserID().then(value => this.userId = value)

    this.ws.connect();
    this.getScenesById();
    this.getAnswerOfStuList();
  }

  getScenesById() {
    this.param = {
      n_id: 3
    }
    this.http.getScenesById(this.param).subscribe(res => {
      // for (var i =0;i<JSON.parse(res['list'][0]['s_data'])['componentList'].length;i++){
      //   JSON.parse(res['list'][0]['s_data'])['componentList'][''].ImagePath=this.sanitizer.bypassSecurityTrustResourceUrl(this.http.BASE_URL+res['list'][i].ImagePath);
      // }
      this.data_list = JSON.parse(res['list'][0]['s_data'])['componentList']
      if (this.data_list[0]['fillData'] != null) {

        this.data_list[0]['fillData']['fillImg'] = this.sanitizer.bypassSecurityTrustResourceUrl(this.http.BASE_URL + this.datas[0]['fillData']['fillImg']);
      }
      this.datas = this.data_list
      // this.items=JSON.parse(res['list'][0]['s_data'])['componentList']
    });
  }

  getAnswerOfStuList() {
    this.param = {
      n_id: 1,
      g_id: 2,
      sim_id: 18
    }
    this.http.getAnswerOfStuList(this.param).subscribe(res => {

      for (var i = 0; i < res['list'].length; i++) {
        res['list'][i].ImagePath = this.sanitizer.bypassSecurityTrustResourceUrl(this.http.BASE_URL + res['list'][i].ImagePath);
      }

      this.items = res['list']

    });

    // this.loading = false;
  }

  send() {
    this.param = {
      sim_id: 18,
      g_id: 2,
      u_id: this.userId,
      answer: this.value,
      n_id: 1
    };
    console.log('received message from server123: ', 123);

    this.http.addStuAnswer(this.param).subscribe(res => {
      console.log('------addanswer------')
      console.log(res)
      // console.log('received message from server666: ', res['code']);
      // this.value='';
      // if (res['code'] == 0) {
      //
      // }

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BaidutbPage');
  }

  ionViewDidEnter() {
    if (this.ws.messages) {
      // setInterval(()=>{
      //   this.getAnswerOfStuList();
      // },2000);
      this.socketSubscription = this.ws.messages.subscribe((message: string) => {
        console.log('received message from server11111:' + message);
        if (JSON.parse(message)['action'] != null) {
          if (JSON.parse(message)['action'] == 'phone_scene_answers_update') {
            this.value = '';
            this.items = JSON.parse(message)['list']
          }
        }
        // const JSONComponentList = JSON.parse(message)['list'][0]['s_data'];
        // this.componentList = JSON.parse(JSONComponentList).componentList;
      })
    }
  }

  ionViewDidLeave() {
    if (this.socketSubscription)
      this.socketSubscription.unsubscribe();
  }

  // goChangePhone() {
  //   this.navCtrl.push(PhonePage, {userId: this.userId});
  // }
  //
  // goChangePassword() {
  //   this.navCtrl.push(PasswordPage, {userId: this.userId});
  // }
  //
  // goUpdate() {
  //   this.navCtrl.push(UpdatePage);
  // }
  //
  // getOut() {
  //   this.userData.logout();
  //   this.navCtrl.push(LoginsPage);
  //
  // }
}

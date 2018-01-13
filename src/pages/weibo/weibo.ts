import {Component, Input} from '@angular/core';
import {
  IonicPage, NavController, NavParams, ToastController
} from 'ionic-angular';
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {UserData} from "../../providers/user-data";
import {ServerSocket} from "../../providers/ws.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Subscription} from "rxjs/Subscription";

@IonicPage()
@Component({
  selector: 'page-weibo',
  templateUrl: 'weibo.html',
})
export class WeiBoPage {
  items = [];
  param: any;
  datas: any;
  data_list: any;
  name;
  phone;
  userId;
  value: '';
  imagepath;
  avatar = "assets/img/header.png";
  videoimg = "assets/img/video.png";

  isShow = false;
  src = 'assets/img/juxing-10.png';
  @Input()
  s_data=new Object()
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
      this.data_list = JSON.parse(res['list'][0]['s_data'])['componentList']
      this.data_list[0].name = "SG_weibo"

      this.data_list[0]['data']['fillData'].title = '事件名称'
      this.data_list[0]['data']['fillData'].fillName = '大神';
      this.data_list[0]['data']['fillData'].fillImg = this.src;
      // this.src1 = this.sanitizer.bypassSecurityTrustResourceUrl(this.http.BASE_URL + this.src1);

      this.data_list[0]['data']['fillData'].content = '贴吧圣诞舞蹈大会开始征集了！贴吧圣诞舞蹈大会开始征集了！贴吧圣诞舞蹈大会开始征集了！贴吧圣诞舞蹈大会开始征集了'
      // if (this.data_list[0]['fillData'] != null) {
      //   this.data_list[0]['fillData']['fillImg'] = this.sanitizer.bypassSecurityTrustResourceUrl(this.http.BASE_URL + this.datas[0]['fillData']['fillImg']);
      // }
      // else{
      //   console.log('-----------------------------------------------')
      //   // this.data_list[0]['fillData']['title'] ='事件名称'
      // }
      this.datas = this.data_list
    });
  }

  getAnswerOfStuList() {
    this.param = {
      n_id: 1,
      g_id: 2,
      sim_id: 18
    }
    this.http.getAnswerOfStuList(this.param).subscribe(res => {
      console.log('received message from server333: ', res['list']);

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


  // send(){
  //   this.items.push({tx_img: 'assets/img/header.png', name: '莎萨', floor: '第6楼', time: '今天 10:10', nr_src: '', nr: '测试测试测试测试'})
  // }
}

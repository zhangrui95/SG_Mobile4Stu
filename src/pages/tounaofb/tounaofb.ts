///<reference path="../../../node_modules/ionic-angular/tap-click/tap-click.d.ts"/>
import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {DomSanitizer} from "@angular/platform-browser";
import {Subscription} from "rxjs/Subscription";
import {ServerSocket} from "../../providers/ws.service";
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {UserData} from "../../providers/user-data";

/**
 * Generated class for the BaidutbPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tounaofb',
  templateUrl: 'tounaofb.html',
})

export class TounaofbPage {
  gender;
  items = [];
  param: any;
  name: '';
  isShow = false;
  datas: any;
  value: '';
  data_list: any;
  userId;
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
              public ws: ServerSocket,
              public http: ProxyHttpService,
              public sanitizer: DomSanitizer) {
    this.ws.connect();
    this.userData.getUserID().then(value => this.userId = value)
    this.getScenesById();
    this.getAnswerOfStuList();
  }

  getScenesById() {
    this.param = {
      n_id: 3
    }
    this.http.getScenesById(this.param).subscribe(res => {
      this.data_list = JSON.parse(res['list'][0]['s_data'])['componentList']
      this.data_list[0].name = "brain"

      this.data_list[0]['data']['fillData'].title = '事件名称'
      this.data_list[0]['data']['fillData'].fillName = '大神';
      this.data_list[0]['data']['fillData'].fillImg = 'assets/img/img1.png';
      // this.src1 = this.sanitizer.bypassSecurityTrustResourceUrl(this.http.BASE_URL + this.src1);

      this.data_list[0]['data']['fillData'].content = '事件详情事件详情事件详情事件详情事件详情事件详情事件详情事件详情事件详情事件详情事件详情事件详情事件详情事件详情事件详情'
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
}

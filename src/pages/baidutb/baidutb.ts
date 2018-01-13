///<reference path="../../../node_modules/ionic-angular/tap-click/tap-click.d.ts"/>
import {Component, Input, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Subscription} from "rxjs/Subscription";
import {ServerSocket} from "../../providers/ws.service";
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {DomSanitizer} from "@angular/platform-browser";
import {UserData} from "../../providers/user-data";

/**
 * Generated class for the BaidutbPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-baidutb',
  templateUrl: 'baidutb.html',
})


export class BaidutbPage implements OnInit{
  gender;

  items ;
  param: any;
  title: '';
  src1: any
  isShow = false;
  datas: any;
  data_list: any;
  value: '';
  src = 'assets/img/juxing-10.png';
  userId;
  n_id;
  g_id;
  content;
  sim_id;

  @Input()
  s_data:any=new Object()

  ngOnInit() {
    console.log("===============grouping====================>")
    console.log(this.s_data.s_data.componentList[0].data.fillData)
    // JSON.parse()
    this.items=this.s_data.s_data.componentList[0].data.fillData;
    this.title=this.items.title;
    this.content=this.items.content;
    this.n_id=this.s_data.n_id;
    this.g_id=this.s_data.g_id;
  }

  mousedownd() {
    this.isShow = true
    this.src = 'assets/img/yuyin-3.png';
  }

  mouseup() {
    this.isShow = false
    this.src = 'assets/img/juxing-10.png';
  }

  // ngOnInit() {
  //   this.getData();
  // }
  private socketSubscription: Subscription
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userData: UserData,
              public ws: ServerSocket,
              public http: ProxyHttpService,
              public sanitizer: DomSanitizer) {
    this.ws.connect()
    this.userData.getUserID().then(value => this.userId = value)
    // this.getScenesById();
    this.userData.getSimId().then(value=>{
      this.sim_id=value
    })
    this.getAnswerOfStuList();
  }


  getAnswerOfStuList() {

    this.param = {
      n_id: this.n_id,
      g_id: this.g_id,
      sim_id: this.sim_id
    };
    this.http.getAnswerOfStuList(this.param).subscribe(res => {

      for (var i = 0; i < res['list'].length; i++) {
        res['list'][i].ImagePath = this.sanitizer.bypassSecurityTrustResourceUrl(this.http.BASE_URL + res['list'][i].ImagePath);
      }

      this.items = res['list']

    });
  }

  send() {
    this.param = {
      sim_id: this.sim_id,
      g_id:  this.g_id,
      u_id: this.userId,
      answer: this.value,
      n_id: this.n_id
    };
    console.log('------addanswer------')
    console.log( JSON.stringify(this.param));

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

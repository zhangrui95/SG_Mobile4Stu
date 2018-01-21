import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {DomSanitizer} from "@angular/platform-browser";
import {Subscription} from "rxjs/Subscription";
import {ServerSocket} from "../../providers/ws.service";
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {UserData} from "../../providers/user-data";
import {DesertService} from "../../providers/desert.service";
const ITEM_TENT = 101;
const ITEM_WATER = 102;
const ITEM_FOOD = 103;
const ITEM_COMPASS = 104;
const ITEM_GOLD = 105;
const ITEM_MONEY = 106;
const PLACE_START = 1101;
const PLACE_DESERT = 1102;
const PLACE_OASIS = 1103;
const PLACE_VILLIGE = 1104;
const PLACE_TOMBS = 1105;
const PLACE_END = 1106;

const WEATHER_SUNNY = 11101
const WEATHER_HOT = 11102
const WEATHER_SANDSTORM = 11103
const WEATHER_HOT_SANDSTORM = 11104
@IonicPage()
@Component({
  selector: 'page-gold-tounaofb',
  templateUrl: 'gold-tounaofb.html',
})
export class GoldTounaofbPage {

  @ViewChild('ioncontent')
  ioncontent

  gender;
  items = [];
  param: any;
  name: '';
  isShow = false;
  datas: any;
  inputvalue;
  data_list: any;
  userId;
  content;
  sim_id;
  g_id
  n_id
  s_data
  title;
  bjPopShow = false;
  lrPopShow = false;
  lrClickPopShow = false;
  mapShow = false;
  fzPopShow = false;
  btmMore = true;
  ImgBg = 'assets/img/bj1.png';
  type = 0;
  tqList = [{name:'沙尘暴',Img:'assets/img/tq3.png'},{name:'高温',Img:'assets/img/tq2.png'}]
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
              public sanitizer: DomSanitizer,
              public desertService:DesertService,
              public toastCtrl: ToastController) {
    this.ws.connect()
    this.userData.getUserID().then(value => this.userId = value)
    this.n_id=this.navParams.data.n_id
    this.g_id=this.navParams.data.g_id
    this.s_data=this.navParams.data.s_data
    // this.sim_id=this.navParams.data.sim_id
    this.userData.getSimId().then(res=>{
      this.sim_id=res;
    })
    this.getAnswerOfStuList();
  }
  showToast(position: string, text: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: position
    });

    toast.present(toast);
  }
  getAnswerOfStuList() {
    this.param = {
      n_id: this.n_id,
      g_id: this.g_id,
      sim_id: this.sim_id
    };

    this.http.getAnswerOfStuList(this.param).subscribe(res => {
      this.items = res['list']

    });
  }

  getFullPath(path){
    return this.http.getBaseurl()+path
  }


  send() {
    this.param = {
      sim_id: this.sim_id,
      g_id:  this.g_id,
      u_id: this.userId,
      answer: this.inputvalue,
      n_id: this.n_id
    };

    if (this.inputvalue != '') {
      this.http.addStuAnswer(this.param).subscribe(res => {
        console.log(res)
        this.inputvalue = '';
        this.showSuccess('bottom', '评论成功');
      });
    }
  }

  showSuccess(position: string, text: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: position
    });

    toast.present(toast);
  }
  TYPE_TRADE
  TYPE_ASK
  TYPE_PACKAGE
  TYPE_MAP
  TYPE_USE
  TYPE_THROW
  userAction(type){
    switch (type){

    }
    this.currentStatus=this.desertService.getCurrState()
  }

  currentStatus;
  common
  result
  ionViewDidLoad() {

    // JSON.parse()
    this.result=JSON.parse(this.s_data[0].s_data)
    this.common=this.result['componentList'][0].data.fillData;

    this.title=this.common.title;
    this.content=this.common.content;

    let params={sim_id:this.sim_id,n_id:this.n_id,g_id:this.g_id}
    this.http.getGoldStatus(params).subscribe(res=>{
      console.log(res['listGDK'])
      this.desertService.setCurrState(res['listGDK'])
      this.currentStatus=this.desertService.getCurrState()
      this.getImgBg();

    })

    // this.title='范德萨的发生非法违法文文';
    // this.content='范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文';

    if (this.ws.messages) {

      this.socketSubscription = this.ws.messages.subscribe(message => {
        let action=JSON.parse(message)['action'];
        let msgs = JSON.parse(message)['msg'];
        if (action != null) {
          if (action == 'phone_scene_answers_update') {
            let item = this.items.concat(JSON.parse(message)['list'])
            this.items=item
            setTimeout(()=>{

              this.ioncontent.scrollToBottom(500);
            },1000)

          }else if (action === "phone_group") {
            this.userData.setAction(action);
          }else if(action === "phone_call"){
            this.showToast('bottom', msgs);
          }else if (action === "exercises_end") {
            this.showToast('bottom', '本次演练终止');
          }
        }

      })
    }
  }
  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad BaidutbPage');
  // }

  ionViewDidLeave() {
    if (this.socketSubscription)
      this.socketSubscription.unsubscribe();
  }
  bjPop(){
    this.bjPopShow = true;
    this.btmMore = false;
  }
  bjPopHide(){
    this.bjPopShow = false;
    this.lrPopShow = false;
    this.lrClickPopShow = false;
    this.mapShow = false;
    this.fzPopShow = false;
    this.btmMore = true;
  }
  lrPop(){
    this.lrPopShow = true;
    this.btmMore = false;
  }
  ShowDaAn(){
    this.lrClickPopShow = true;
    this.lrPopShow = false;
    this.btmMore = false;
  }
  MapShow(){
    this.mapShow = true;
    this.btmMore = false;
  }
  fzPop(){
    this.fzPopShow = true;
    this.btmMore = false;
  }
  getImgBg(){
    console.log(this.type);
    if(this.currentStatus.place == PLACE_START){
      this.ImgBg = 'assets/img/bj1.png';
    }else if(this.currentStatus.place == PLACE_OASIS){
      this.ImgBg = 'assets/img/bj2.png';
    }else if(this.currentStatus.place == PLACE_VILLIGE){
      this.ImgBg = 'assets/img/bj3.png';
    }else if(this.currentStatus.place == PLACE_DESERT){
      this.ImgBg = 'assets/img/bj4.png';
    }else if(this.currentStatus.place == PLACE_TOMBS){
      this.ImgBg = 'assets/img/bj5.png';
    }
  }
}

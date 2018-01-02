import { Component, ElementRef, ViewChild } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {GroupingPage} from "../grouping/grouping";
import {DecisionPage} from "../decision/decision";
import {TounaofbPage} from "../tounaofb/tounaofb";
import {DanmuPage} from "../danmu/danmu";
import {BaidutbPage} from "../baidutb/baidutb";
import {WeiBoPage} from "../weibo/weibo";
import {QQPage} from "../qq/qq";
import {ServerSocket} from "../../providers/ws.service";
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {UserData} from "../../providers/user-data";


@IonicPage()
@Component({
  selector: 'page-classroom',
  templateUrl: 'classroom.html',
})
export class ClassroomPage {
  @ViewChild('scrollBox') private myScrollContainer: ElementRef;
  items = [];
  userId;
  showBtn = true;
  GroupNews = false;
  allocation = false;
  groOfStu;
  sim_id;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl:ToastController,
              public http: ProxyHttpService,
              public userData:UserData,
              public ws :ServerSocket
              ) {
    // this.sim_id = this.navParams.get('data').sim_id;
    this.userData.getUserID().then(value => this.userId=value);
    this.ws.connect();
  }
  messagesSubscription;
  showToast(position: string, text: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: position
    });
    toast.present(toast);
  }
  ionViewDidEnter() {
    this.getProcessOfStu();
    setTimeout(()=>{
        this.getPushFreeGroListForPhone();
      },2000);
    this.messagesSubscription=this.ws.messages.subscribe(msg=>{
      if(msg !== null){
        let action = JSON.parse(msg)['action'];
        if(action !== "undefined" ){
          if(action === "phone_process_update"){
            this.getProcessOfStu();
            this.scrollToBottom();
          }else if(action === "phone_group"){
            this.getProcessOfStu();
            this.allocation = true;
          }
        }
      }
    });
  }
  ionViewDidLeave(){
    this.messagesSubscription.unsubscribe()
  }
  getPushFreeGroListForPhone(){
    const params = {'sim_id':18,"GroupId":[{"id":"2",img:'assets/img/img1.png',text:'这是什么组',"type":"fixed","limit":"999"},{"id":"3",img:'assets/img/img1.png',text:'你好',"type":"fixed","limit":"123"},{"id":"4",img:'assets/img/img1.png',text:'胜多负少',"type":"fixed","limit":"200"},{"id":"5",img:'assets/img/img1.png',text:'少放点撒地方',"type":"fixed","limit":"123"},{"id":"6",img:'assets/img/img1.png',text:'佛挡杀佛地方是',"type":"fixed","limit":"123"}]}
    this.http.getPushFreeGroListForPhone(params).subscribe(res => {
      console.log(res)
    });
  }
  getProcessOfStu(){
    const params = {sim_id:18, u_id:this.userId};
    this.http.getProcessOfStu(params).subscribe(res => {
      this.items = res['list'];
      this.groOfStu = res['groOfStu'];
      if(res['groOfStu'] === ''){
        this.GroupNews = false;
        this.allocation = true;
      }else{
        this.GroupNews = true;
        this.allocation = false;
      }
    });
  }

  goGrouping(){
    this.navCtrl.push(GroupingPage,{sim_id: "18"});
  }

  goPage(type){
    console.log(type)
    if(type == '1'){
      this.navCtrl.push(DecisionPage)
    }
    if(type == '3'){
      this.navCtrl.push(TounaofbPage)
    }
    if(type == '4'){
      this.navCtrl.push(BaidutbPage)
    }
    if(type == '5'){
      this.navCtrl.push(DanmuPage)
    }
    if(type == '6'){
      this.navCtrl.push(WeiBoPage)
    }
    if(type == '7'){
      this.navCtrl.push(QQPage)
    }
  }
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}

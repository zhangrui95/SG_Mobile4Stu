import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {GroupingPage} from "../grouping/grouping";
import {DecisionPage} from "../decision/decision";
import {TounaofbPage} from "../tounaofb/tounaofb";
import {DanmuPage} from "../danmu/danmu";
import {BaidutbPage} from "../baidutb/baidutb";
import {WeiBoPage} from "../weibo/weibo";
import {QQPage} from "../qq/qq";

@IonicPage()
@Component({
  selector: 'page-classroom',
  templateUrl: 'classroom.html',
})
export class ClassroomPage {
  items = [
    {name:'事件起因',type: '0'},
    {name:'第一次决策',type:'1'},
    {name:'第一次场景推演',type:'2'},
    {name:'第一次头脑风暴',type:'3'},
    {name:'百度贴吧',type:'4'},
    {name:'弹幕',type:'5'},
    {name:'新浪微博',type:'6'},
    {name:'QQ',type:'7'},
    {name:'第二次决策',type:'1'}
    ]
  constructor(public navCtrl: NavController, public navParams: NavParams,public toastCtrl:ToastController) {
  }
  showToast(position: string, text: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: position
    });
    toast.present(toast);
  }
  ionViewDidLoad() {

  }

  goGrouping(){
    this.navCtrl.push(GroupingPage);
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
}

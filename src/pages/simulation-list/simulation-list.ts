import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {GroupingPage} from "../grouping/grouping";
import {DecisionPage} from "../decision/decision";

@IonicPage()
@Component({
  selector: 'page-simulation-list',
  templateUrl: 'simulation-list.html',
})
export class SimulationListPage {
  items = [{name:'事件起因',type: '0'},{name:'第一次决策',type:'1'},{name:'第一次场景推演',type:'2'},{name:'第一次头脑风暴',type:'3'},{name:'第二次决策',type:'1'}]
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
  goGrouping(){
    this.navCtrl.push(GroupingPage);
  }

  goPage(type){
    if(type == '1'){
      this.navCtrl.push(DecisionPage)
    }
  }
}

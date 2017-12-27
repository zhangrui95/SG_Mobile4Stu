import { Component, ElementRef, ViewChild } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {DecisionPage} from "../decision/decision";
import {UsersPage} from "../users/users";
import {GroupingPage} from "../grouping/grouping";


@IonicPage()
@Component({
  selector: 'page-records-list',
  templateUrl: 'records-list.html',
})
export class RecordsListPage {
  @ViewChild('scrollBox') private myScrollContainer: ElementRef;
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

  getUser(){
    this.navCtrl.push(UsersPage);
  }

  goPage(type){
    if(type == '1'){
      this.navCtrl.push(DecisionPage)
    }
  }

  goGrouping(){
    this.navCtrl.push(GroupingPage);
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}

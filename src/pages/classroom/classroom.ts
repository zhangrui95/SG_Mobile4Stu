import { Component, ElementRef, ViewChild } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {GroupingPage} from "../grouping/grouping";
import {ServerSocket} from "../../providers/ws.service";
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {UserData} from "../../providers/user-data";
import {SceneListPage} from "../scene-list/scene-list";


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
  indexNs = [];
  action;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl:ToastController,
              public http: ProxyHttpService,
              public userData:UserData,
              public ws :ServerSocket
              ) {
    this.sim_id = this.navParams.get('sim_id');
    this.userData.getUserID().then(value => this.userId=value);
    this.ws.connect();
    this.userData.getAction().then(value => this.action=value)
    if(this.action === "phone_group"){
      this.getProcessOfStu();
      this.allocation = true;
    }
  }
  messagesSubscription;
  ionViewDidEnter() {
    this.getProcessOfStu();
    // setTimeout(()=>{
    //     this.getPushFreeGroListForPhone();
    //   },1000);
    this.messagesSubscription=this.ws.messages.subscribe(msg=>{
      if(msg !== null){
        let action = JSON.parse(msg)['action'];
        let msgs = JSON.parse(msg)['msg'];
        console.log('action',action);
        if(action !== "undefined" ){
          if(action === "phone_process_update"){
            this.getProcessOfStu();
            this.scrollToBottom();
          }else if(action === "phone_group"){
            this.getProcessOfStu();
            this.allocation = true;
            this.userData.setAction(action);
          }else if(action === "phone_call"){
            this.showToast('bottom', msgs);
          }
        }
      }
    });
  }
  ionViewDidLeave(){
    this.messagesSubscription.unsubscribe()
  }
  // getPushFreeGroListForPhone(){
  //   const params = {'sim_id':this.sim_id}
  //   this.http.getPushFreeGroListForPhone(params).subscribe(res => {
  //     console.log(res)
  //   });
  // }
  getProcessOfStu(){
    const params = {sim_id:this.sim_id, u_id:this.userId};
    this.http.getProcessOfStu(params).subscribe(res => {
      // for(let i in res['list']){
      //   res['list'][0].ns = '';
      //   res['list'][i].ns = [{"n_id":"1.1","n_name":"sdfsdfs"},{"n_id":"1.2","n_name":"sdfsdfd"}];
      // }
      this.items = res['list'];
      console.log(res);
      for(let n in this.items){
        if(res['list'][n].ns === ''){
          this.indexNs.push(false);
        }else{
          this.indexNs.push(true);
        }
      }
      this.groOfStu = res['groOfStu'];
      if(res['groOfStu'] === ''){
        this.GroupNews = false;
      }else{
        this.GroupNews = true;
        this.allocation = false;
      }
    });
  }

  goGrouping(){
    this.navCtrl.push(GroupingPage,{sim_id: this.sim_id});
  }

  goPage(n_id){
    console.log('n_id:'+n_id)
      this.navCtrl.push(SceneListPage,{n_id: n_id})
  }
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  showToast(position: string, text: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: position
    });

    toast.present(toast);
  }

}

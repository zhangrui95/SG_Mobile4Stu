import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {UserData} from "../../providers/user-data";
import {ServerSocket} from "../../providers/ws.service";

@IonicPage()
@Component({
  selector: 'page-grouping',
  templateUrl: 'grouping.html',
})
export class GroupingPage {
  groupList;
  userId;
  list = [];
  totalStu = [];
  index;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: ProxyHttpService,
              public userData:UserData,
              public toastCtrl: ToastController,
              public ws :ServerSocket
              ) {
    this.groupList = this.navParams.get('groupList');
    this.list = this.groupList;
    this.userData.getUserID().then(value => this.userId=value);
    this.ws.connect();
    for (let i in this.groupList){
      let groupStu = this.groupList[i].totalStu;
      this.totalStu.push(groupStu);
    }
  }
  messagesSubscription;
  ionViewDidEnter() {
    this.messagesSubscription=this.ws.messages.subscribe(msg=>{
      if(msg !== null){
        let action = JSON.parse(msg)['action'];
        let totalStu = JSON.parse(msg)['totalStu'];
        let idx = this.index;
        if(action === 'phone_insert_group'){
          // console.log('idx',idx)
          this.totalStu[idx] = totalStu;
        }
      }
    })
  }
  ionViewDidLeave(){
    this.messagesSubscription.unsubscribe();
  }
  getJoin(item, i){
    const params = {sim_id:18, u_id:this.userId, g_id:item.id, g_name:item.text, g_img:item.img, limit:item.limit};
    this.http.addfreeGroupOfStu(params).subscribe(res => {
        console.log(res)
        this.index = i;
      this.messagesSubscription=this.ws.messages.subscribe(msg=>{
        if(msg !== null){
          let action = JSON.parse(msg)['action'];
          let totalStu = JSON.parse(msg)['totalStu'];
          if(action === 'phone_insert_group'){
            console.log(totalStu)
          }
        }
      })
    });
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

import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {UserData} from "../../providers/user-data";
import {ServerSocket} from "../../providers/ws.service";

@IonicPage()
@Component({
  selector: 'page-grouping',
  templateUrl: 'grouping.html',
})
export class GroupingPage {
  userId;
  list = [];
  index;
  sim_id;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: ProxyHttpService,
              public userData:UserData,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              public ws :ServerSocket
              ) {
    this.userData.getSimId().then(value =>  this.sim_id=value);
    this.userData.getUserID().then(value => this.userId=value);
    this.ws.connect();
  }
  messagesSubscription;
  ionViewDidEnter() {
    // setTimeout(()=>{
    //   this.getPushFreeGroListForPhone();
    // },2000);
    this.getGroupsList();
    this.messagesSubscription = this.ws.messages.subscribe(msg=>{
      if(msg !== null){
        let action = JSON.parse(msg)['action'];
        console.log(msg)
        if(action === 'phone_insert_group'){
          this.getGroupsList();
        }
      }
    })
  }
  // getPushFreeGroListForPhone(){
  //   const params = {'sim_id':18}
  //   this.http.getPushFreeGroListForPhone(params).subscribe(res => {
  //     console.log(res)
  //   });
  // }
  ionViewDidLeave(){
    this.messagesSubscription.unsubscribe();
  }
  getGroupsList(){
    const params = {sim_id: this.sim_id}
    this.http.getGroupsList(params).subscribe(res => {
      console.log(res)
      this.list = res['listGro'];
    });
  }

  getJoin(item){
    let confirm = this.alertCtrl.create({
      title: '确定加入该分组?',
      buttons: [
        {
          text: '取消',
          handler: () => {
          }
        },
        {
          text: '确定',
          handler: () => {
            const params = {sim_id:this.sim_id, u_id:this.userId, g_id:item.g_id, limit: item.g_limit};
            console.log(params)
            this.http.addfreeGroupOfStu(params).subscribe(res => {
              console.log(res)
              if(res['code'] == 0){
                this.showToast('bottom', res['msg']);
                  // window.history.back();
                this.navCtrl.pop()
              }else{
                this.showToast('bottom', res['msg']);
              }
            });
          }
        }
      ]
    });
    confirm.present();
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

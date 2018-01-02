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
    this.sim_id = this.navParams.get('sim_id');
    this.userData.getUserID().then(value => this.userId=value);
    this.ws.connect();
  }
  messagesSubscription;
  ionViewDidEnter() {
    setTimeout(()=>{
      this.getPushFreeGroListForPhone();
    },2000);
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
  getPushFreeGroListForPhone(){
    const params = {'sim_id':18,"GroupId":[{"id":"2",img:'assets/img/img1.png',text:'这是什么组',"type":"fixed","limit":"999"},{"id":"3",img:'assets/img/img1.png',text:'你好',"type":"fixed","limit":"123"},{"id":"4",img:'assets/img/img1.png',text:'胜多负少',"type":"fixed","limit":"200"},{"id":"5",img:'assets/img/img1.png',text:'少放点撒地方',"type":"fixed","limit":"123"},{"id":"6",img:'assets/img/img1.png',text:'佛挡杀佛地方是',"type":"fixed","limit":"123"}]}
    this.http.getPushFreeGroListForPhone(params).subscribe(res => {
      console.log(res)
    });
  }
  ionViewDidLeave(){
    this.messagesSubscription.unsubscribe();
  }
  getGroupsList(){
    const params = {sim_id: this.sim_id}
    console.log(this.sim_id)
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
            const params = {sim_id:18, u_id:this.userId, g_id:item.g_id, limit: item.g_limit};
            console.log(params)
            this.http.addfreeGroupOfStu(params).subscribe(res => {
              console.log(res)
              if(res['code'] == 0){
                this.showToast('bottom', res['msg']);
                window.history.back();
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

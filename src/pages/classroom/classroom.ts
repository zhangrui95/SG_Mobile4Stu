import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {GroupingPage} from "../grouping/grouping";
import {ServerSocket} from "../../providers/ws.service";
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {UserData} from "../../providers/user-data";
import {DecisionPage} from "../decision/decision";
import {WeiBoPage} from "../weibo/weibo";
import {DanmuPage} from "../danmu/danmu";
import {TounaofbPage} from "../tounaofb/tounaofb";
import {BaidutbPage} from "../baidutb/baidutb";
import {QQPage} from "../qq/qq";
import {DefaultPage} from "../default/default";
import {GoldWeatherPage} from "../gold-weather/gold-weather";
import {GoldTounaofbPage} from "../gold-tounaofb/gold-tounaofb";


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
  g_id = "-1"
  group_u = false;

  action;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public http: ProxyHttpService,
              public userData: UserData,
              public ws: ServerSocket) {

    this.ws.connect();

  }

  messagesSubscription;
  simType
  ionViewDidEnter() {
    this.userData.getIsDead().then(v => {
      this.userData.getIsSuccess().then(e => {
          if(v||e){
            this.showAlwaysToast('bottom','演练结束，请等待结算')
          }
      })
    })

    this.userData.getAction().then(value => {
      this.action=value
      if (this.action === "phone_group") {
        this.getProcessOfStu();
        this.allocation = true;
      }
    })
    this.userData.getSimType().then(value => {
      this.simType=value
    })
    this.userData.getSimId().then(value => {
      this.sim_id = value;
      this.userData.getUserID().then(value => {
        this.userId = value;
        this.getProcessOfStu();
      });
    });


    // setTimeout(()=>{
    //     this.getPushFreeGroListForPhone();
    //   },1000);
    this.messagesSubscription = this.ws.messages.subscribe(msg => {
      console.log('+++++++++++++++++++++++++++++++++++++++++');
      console.log(msg);
      //[{"action":"phone_process_upadte","n_name":"开始","n_id":"1111"}] {"action":"phone_process_upadte"}
      if (msg !== null) {

        let action = JSON.parse(msg)['action'];
        let msgs = JSON.parse(msg)['msg'];
        console.log(JSON.parse(msg)['action']);
        console.log('action', action);
        if (action !== "undefined") {
          if(action=='phone_Death'){
            if(JSON.parse(msg)['datas']['type']=='dead'){
              this.userData.setIsDead(true)
            }else if(JSON.parse(msg)['datas']['type']=='success'){
              this.userData.setIsSuccess(true)
            }

          }
          if (action === "phone_process_update") {
            this.getProcessOfStu();
            this.scrollToBottom();
          } else if (action === "phone_group") {
            if(this.sim_id==JSON.parse(msg)['sim_id']){
              this.getProcessOfStu();
              this.allocation = true;
              this.userData.setAction(action);
            }

          } else if (action === "phone_call") {
            this.showToast('bottom', msgs);
          }else if (action === "exercises_end") {
            this.showToast('bottom', '本次演练终止');
          }
        }
      }
    });
  }

  ionViewDidLeave() {
    this.messagesSubscription.unsubscribe()
  }

  // getPushFreeGroListForPhone(){
  //   const params = {'sim_id':this.sim_id}
  //   this.http.getPushFreeGroListForPhone(params).subscribe(res => {
  //     console.log(res)
  //   });
  // }

  getProcessOfStu() {
    this.userData.getIsDead().then(v=>{
      this.userData.getIsSuccess().then(e=>{
        if(!v&&!e){
          const params = {sim_id: this.sim_id, u_id: this.userId};
          console.log("*-*-*-*-*-*-*-*-*-*");
          console.log(JSON.stringify(params));
          this.http.getProcessOfStu(params).subscribe(res => {
            // for(let i in res['list']){
            //   res['list'][0].ns = '';
            //   res['list'][i].ns = [{"n_id":"1.1","n_name":"sdfsdfs"},{"n_id":"1.2","n_name":"sdfsdfd"}];
            // }
            let count=1;
            this.items = res['list'];
            if(this.items.length>count){

             this.userData.setCurrentDays( Math.ceil((this.items.length-count)/2))
            }
            console.log("*-*-*-*-*-*-*-*-*-*" + JSON.stringify(res));
            console.log(JSON.stringify(res));
            for (let n in this.items) {
              if (res['list'][n].ns === '') {
                this.indexNs.push(false);
              } else {
                this.indexNs.push(true);
              }
            }
            this.groOfStu = res['groOfStu'];
            if (res['groOfStu'] === '') {
              this.GroupNews = false;
            } else {
              if(res['groOfStu'].u_position == 1){
                this.group_u = true;
              }
              this.userData.setUposition(res['groOfStu'].u_position);
              this.userData.setAction('')
              this.g_id = this.groOfStu.g_id
              this.GroupNews = true;
              this.allocation = false;
            }
          });
        }
      })
    })

  }

  action_name = "";
  getFullPath(path){
    return this.http.getBaseurl()+path
  }
  getScenesById(nid) {
    let param = {
      n_id: nid
    }
    let name = 'default'
    this.http.getScenesById(param).subscribe(res => {
      let s_data = res['list'];
      let data_list = JSON.parse(res['list'][0]['s_data'])['componentList']
      for (let component of data_list) {
        if (component.name == "SG_tieba" || component.name == "SG_bullet" || component.name == "SG_weibo" || component.name == "SG_brain" || component.name == "SG_select" || component.name == "SG_QQ") {
          name = component.name
        }
      }
      console.log(this.g_id)
      switch (name) {
        case "SG_tieba":
          this.navCtrl.push(BaidutbPage, {n_id: nid, g_id: this.g_id, s_data: s_data, sim_id: this.sim_id})
          break;
        case "SG_bullet":
          this.navCtrl.push(DanmuPage, {n_id: nid, g_id: this.g_id, s_data: s_data, sim_id: this.sim_id})
          break;
        case "SG_weibo":
          this.navCtrl.push(WeiBoPage, {n_id: nid, g_id: this.g_id, s_data: s_data, sim_id: this.sim_id})
          break;
        case "SG_brain":
          if(this.simType=='gold'){

            if(this.items.length>1){
              let i=this.items[this.items.length-1]
              this.navCtrl.push(GoldTounaofbPage, {name_position:i.n_name,n_id: nid, g_id: this.g_id, s_data: s_data, sim_id: this.sim_id, group_u: this.group_u,lastnid: i.n_id})

            }

          }else{

            this.navCtrl.push(TounaofbPage, {n_id: nid, g_id: this.g_id, s_data: s_data, sim_id: this.sim_id})

          }


          break;
        case "SG_select":
          if(this.items.length>1){
            let i=this.items[this.items.length-1]
            this.navCtrl.push(DecisionPage, {n_id: nid, g_id: this.g_id, s_data: s_data, sim_id: this.sim_id,group_u:this.group_u,lastnid: i.n_id})

          }



          break;
        case "SG_QQ":
          this.navCtrl.push(QQPage, {n_id: nid, g_id: this.g_id, s_data: s_data, sim_id: this.sim_id})
          break;
        case "default":

          if(this.simType=='gold'){
            this.navCtrl.push(GoldWeatherPage, {n_id: nid, g_id: this.g_id, s_data: s_data, sim_id: this.sim_id})
          }else{
            this.navCtrl.push(DefaultPage, {n_id: nid, g_id: this.g_id, s_data: s_data, sim_id: this.sim_id})
          }

          break;
      }
    });

  }

  goGrouping() {
    this.navCtrl.push(GroupingPage, {sim_id: this.sim_id});
  }

  goPage(n_id) {

    this.getScenesById(n_id)

  }


  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch
      (err) {
    }
  }

  showToast(position: string, text: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: position
    });

    toast.present(toast);
  }
  showAlwaysToast(position: string, text: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 99999000,
      position: position
    });

    toast.present(toast);
  }
}

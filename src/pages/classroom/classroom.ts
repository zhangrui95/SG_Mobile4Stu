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
import {GoldTounaofbPage} from "../gold-tounaofb/gold-tounaofb";
import {Vibration} from "@ionic-native/vibration";
import {DesertService} from "../../providers/desert.service";

const PLACE_END = '矿山';
const WEATHER_SANDSTORM = 11103
const WEATHER_HOT_SANDSTORM = 11104

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
  isComeback = true
  action;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public http: ProxyHttpService,
              public userData: UserData,
              public vibration: Vibration,
              public desert: DesertService,
              public ws: ServerSocket) {
    this.userData.getIsLeader().then(v => {
      this.group_u = v;
    })

  }


  messagesSubscription;
  simType

  ionViewDidEnter() {
    this.isComeback = true;
    this.polling()
    this.ws.connect();
    this.userData.getIsDead().then(v => {
      this.userData.getIsSuccess().then(e => {
        if (v || e) {
          // this.showAlwaysToast('bottom', '演练结束，请等待结算')
        }
      })
    })

    this.userData.getAction().then(value => {
      this.action = value
      if (this.action === "phone_group") {
        this.getProcessOfStu();
        this.allocation = true;
      }
    })
    this.userData.getSimType().then(value => {
      this.simType = value
    })
    this.userData.getSimId().then(value => {
      this.sim_id = value;
      this.userData.getUserID().then(value => {
        this.userId = value;
        this.getProcessOfStu();
      });
    });

    if (this.ws.messages) {
      this.registeReciever()
    }

  }

  isVib

  registeReciever() {

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
          if (action == 'phone_Death') {
            this.vibration.vibrate(1000);

            if (JSON.parse(msg)['datas']['type'] == 'dead') {
              this.userData.setIsDead(true)
            } else if (JSON.parse(msg)['datas']['type'] == 'success') {
              this.userData.setIsSuccess(true)
            }

          }
          if (action === "phone_process_update") {
            if (!this.isVib) {
              this.isVib = true
              // this.vibration.vibrate(1000);
              // setTimeout(() => {
              //   this.isVib = false
              //
              // }, 5000)
            }


            this.getProcessOfStu();
            this.scrollToBottom();
          } else if (action === "phone_group") {
            if (this.sim_id == JSON.parse(msg)['sim_id']) {
              this.vibration.vibrate(1000);
              // this.getProcessOfStu();
              // this.allocation = true;
              this.userData.setAction(action);
            }
          } else if (action === "phone_call") {
            this.vibration.vibrate(1000);
            this.showToast('bottom', msgs);
          } else if (action === "exercises_end") {


            if (this.sim_id == JSON.parse(msg)['sim_id']) {
              this.vibration.vibrate(1000);
              this.showToast('bottom', '本次演练终止');
            }
          }
        }
      }
    });
  }

  ionViewDidLeave() {
    if (this.messagesSubscription)
      this.messagesSubscription.unsubscribe()


    clearTimeout(this.timer)

  }

  // getPushFreeGroListForPhone(){
  //   const params = {'sim_id':this.sim_id}
  //   this.http.getPushFreeGroListForPhone(params).subscribe(res => {
  //     console.log(res)
  //   });
  // }
  refresh() {


    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe()
    }
    setTimeout(() => {
      this.ws.connect()
      this.registeReciever();
      this.getProcessOfStu()
    }, 1000)


  }


  timer;

  polling() {
    this.getProcessOfStu()
  }

  isGrouping = false;

  getProcessOfStu() {

    this.userData.getIsDead().then(v => {
      this.userData.getIsSuccess().then(e => {
        if (!v && !e) {
          const params = {sim_id: this.sim_id, u_id: this.userId};
          console.log("*-*-*-*-*-*-*-*-*-*");
          console.log(JSON.stringify(params));
          this.http.getProcessOfStu(params).subscribe(res => {

            if (this.timer) {
              clearTimeout(this.timer)
            }
            this.timer = setTimeout(() => {
              this.polling()
            }, 3000)
            // this.registeReciever()
            // for(let i in res['list']){
            //   res['list'][0].ns = '';
            //   res['list'][i].ns = [{"n_id":"1.1","n_name":"sdfsdfs"},{"n_id":"1.2","n_name":"sdfsdfd"}];
            // }


            const count = this.items.length

            this.items = res['list'];

            if(this.simType=='gold'){
              if (this.items.length > this.preCount) {
                this.desert.setDays(Math.ceil((this.items.length - this.preCount) / 2))
              }
            }



            if (this.items) {
              if (this.items.length > count) {
                this.vibration.vibrate(1000);
                if (this.simType == 'gold' && this.group_u) {
                  this.consume()
                }

              }

            }
            this.isComeback = false;
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
              if (res['freeGro'] == '1') {
                this.isGrouping = true
              }

            } else {
              this.isGrouping = false
              if (res['groOfStu'].u_position == 1) {
                this.group_u = true;
                this.userData.setIsLeader(this.group_u)
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

  preCount = 2
  currNode;

  consume() {
    if (this.isComeback) {
      return
    }

    if ((this.items.length - this.preCount) % 2 == 1) {
      return
    }
    if (this.items.length > (this.preCount + 1)) {

      let currN;
      for (let i = this.items.length - 1; i >= 0; i--) {

        if (this.items[i].n_name.indexOf('.') == -1) {
          currN = this.items[i]
          this.currNode = this.items[i]
          break;
        }
      }
      let params = {sim_id: this.sim_id, n_id: currN.n_id, g_id: this.g_id}
      this.http.getGoldStatus(params).subscribe(res => {
        console.log(res)

        if (currN.n_name.indexOf('-') != -1) {
          let arr = currN.n_name.split('-')
          if (res['listGDK'].length > 0) {
            this.desert.setCurrState(JSON.parse(res['listGDK'][0]['current_status']), arr[0], arr[1].split('.')[0])
          }
          if (this.desert.getCurrState().isSuccess) {
            this.showAlwaysToast('bottom', '演练结束，请等待结算')
          }
          if (this.desert.getCurrState().isDead) {
            this.showAlwaysToast('bottom', '演练结束，请等待结算')
          }
          let digging = 0;
          if (this.desert.currState.place == PLACE_END) {
            //若在结束位置 次日得一单位金
            if (this.desert.digging()) {
              digging = 1
            } else {
              digging = 2
            }
          }

          switch (this.desert.getWeather()) {
            case WEATHER_HOT_SANDSTORM:
              if (!this.desert.getCurrState().useTent && !this.desert.getCurrState().useCompass) {
                this.desert.setLostStatus()
                this.userData.setIsStay(true)
              }
              break
            case WEATHER_SANDSTORM:
              if (!this.desert.getCurrState().useTent && !this.desert.getCurrState().useCompass) {
                this.desert.setLostStatus()
                this.userData.setIsStay(true)
              }
              break
          }

          //todo consume
          let result = this.desert.consume(this.desert.getWeather(), this.desert.getCurrState().useTent);
          if (digging == 0) {
            this.showToast('bottom', '消耗水:' + this.desert.reduce.water + '消耗食物:' + this.desert.reduce.food)
          } else if (digging == 1) {
            this.showToast('bottom', '消耗水:' + this.desert.reduce.water + '消耗食物:' + this.desert.reduce.food + '，获得1袋金子')
          } else if (digging == 2) {
            this.showToast('bottom', '消耗水:' + this.desert.reduce.water + '消耗食物:' + this.desert.reduce.food + '负重已满，无法获得金子')
          }

          if (!result.isSuccess) {
            this.goDead()
            this.desert.getCurrState().isDead = true
            this.showToast('bottom', result.msg)
          }
          this.userData.setSimData('simdata', this.desert.getCurrState())
          let pas = {
            current_status: this.desert.getCurrState(),
            gdkstate: "0",
            money: '0',
            sim_id: this.sim_id,
            n_id: currN.n_id,
            g_id: this.g_id
          }
          this.http.updateRankingData(pas).subscribe(res => {
            console.log(res)
          })
        }
      })
    }
  }

  goDead() {
    this.userData.setIsDead(true)
    let params = {
      g_id: this.g_id,
      sim_id: this.sim_id,
      datas: {
        type: 'dead',
        n_id: this.currNode.n_id,
        g_id: this.g_id
      }

    }
    this.http.getPushDeathNoticeByGro(params).subscribe(res => {
      console.log(res)
    })
  }


  action_name = "";

  getFullPath(path) {
    return this.http.getBaseurl() + path
  }

  itemClicked = false

  getScenesById(nid, index ?) {

    if (this.itemClicked) {
      return
    }
    this.itemClicked = true
    let count = 2;

    if (index > count) {

      this.userData.setCurrentDays(Math.ceil((index - count) / 2) + 1)
    }
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
      this.itemClicked = false
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
          if (this.simType == 'gold') {

            if (this.items.length > 1) {
              let i = this.items[index]
              let isHistory = false
              if (index < (this.items.length - 2)) {
                isHistory = true
                this.showToast("bottom", '请前往下个步骤')
                return
              }
              this.navCtrl.push(GoldTounaofbPage, {
                isHistory: isHistory,
                name_position: i.n_name,
                n_id: nid,
                g_id: this.g_id,
                s_data: s_data,
                sim_id: this.sim_id,
                group_u: this.group_u,
                lastnid: i.n_id
              })

            }

          } else {

            this.navCtrl.push(TounaofbPage, {n_id: nid, g_id: this.g_id, s_data: s_data, sim_id: this.sim_id})

          }


          break;
        case "SG_select":
          if (this.items.length > 1) {
            let i = this.items[this.items.length - 1]
            this.navCtrl.push(DecisionPage, {
              n_id: nid,
              g_id: this.g_id,
              s_data: s_data,
              sim_id: this.sim_id,
              group_u: this.group_u,
              lastnid: i.n_id
            })

          }


          break;
        case "SG_QQ":
          this.navCtrl.push(QQPage, {n_id: nid, g_id: this.g_id, s_data: s_data, sim_id: this.sim_id})
          break;
        case "default":

          this.navCtrl.push(DefaultPage, {n_id: nid, g_id: this.g_id, s_data: s_data, sim_id: this.sim_id})

          break;
      }
    });

  }

  goGrouping() {
    this.navCtrl.push(GroupingPage, {sim_id: this.sim_id});
  }

  goPage(n_id, index ?) {

    this.getScenesById(n_id, index)

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
      duration: 5000,
      position: position
    });

    toast.present(toast);
  }
}

import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {DomSanitizer} from "@angular/platform-browser";
import {Subscription} from "rxjs/Subscription";
import {ServerSocket} from "../../providers/ws.service";
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {UserData} from "../../providers/user-data";
import {DesertService} from "../../providers/desert.service";
import {Vibration} from "@ionic-native/vibration";

const ITEM_TENT = 101;
const ITEM_WATER = 102;
const ITEM_FOOD = 103;
const ITEM_COMPASS = 104;
const ITEM_GOLD = 105;
const PLACE_START = '营地';
const PLACE_DESERT = '沙漠';
const PLACE_OASIS = '绿洲';
const PLACE_VILLIGE = '村庄';
const PLACE_TOMBS = '王陵';
const PLACE_END = '矿山';
const STATUS_GET_LOST = 1111101
const STATUS_CAN_DIG_IN_MOUNTAIN = 1111103
const WEATHER_SUNNY = 11101
const WEATHER_HOT = 11102
const WEATHER_SANDSTORM = 11103
const WEATHER_HOT_SANDSTORM = 11104

@IonicPage()
@Component({
  selector: 'page-gold-tounaofb',
  templateUrl: 'gold-tounaofb.html',
})
export class GoldTounaofbPage {

  @ViewChild('ioncontent')
  ioncontent

  gender;
  items = [];
  param: any;
  name: '';
  isShow = false;
  datas: any;
  inputvalue;
  data_list: any;
  userId;
  content;
  sim_id;
  g_id
  n_id
  s_data
  title;
  bjPopShow = false;
  lrPopShow = false;
  lrClickPopShow = false;
  mapShow = false;
  fzPopShow = false;
  btmMore = true;
  ImgBg = 'assets/img/bj1.png';
  type = 0;
  tqList = []
  src = 'assets/img/juxing-10.png';
  weather;
  lost;
  lostDuration
  group_u;
  sendBtn = true;
  loadShow =  false;

  refreshData() {


    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe()
    }
    setTimeout(() => {
      this.ws.connect()
      this.registeReciever();
      this.getAnswerOfStuList()
      this.userData.getCurrentDays().then(v => {
        console.log(v)
        let params = {sim_id: this.sim_id, n_id: this.n_id, g_id: this.g_id, day: this.currDay}
        this.http.getGoldStatus(params).subscribe(res => {
          console.log(res['listGDK'])
          if (this.name_position.indexOf('-') != -1) {
            let arr = this.name_position.split('-')
            if (res['listGDK'].length > 0) {
              this.desertService.setCurrState(JSON.parse(res['listGDK'][0]['current_status']), arr[0], arr[1].split('.')[0])
            } else {
              this.desertService.setCurrState({
                position: '1',
                place: '营地',
                money: 900,
                weight: 900,
                food: 0,
                days: 1,
                water: 0,
                tent: 0,
                compass: 0,
                gold: 0,
                useTent: false,
                useCompass: false,
                asked: false,
                isSuccess: false,
                isDead: false,
                status: [],
                events: []
              }, arr[0], arr[1].split('.')[0])
            }

          }
          this.messages = this.desertService.getMessagesFromOlder()
          this.desertService.updateStatus()

          this.setGoods();
          this.getImgBg();
          this.setWeather()
          this.isLost();
          this.userData.getIsSuccess().then(v => {
            {
              this.userData.getIsDead().then(e => {
                {

                  if (!v && !e) {
                    if (this.desertService.getCurrState().place == PLACE_START && this.desertService.getCurrState().days > 1) {
                      //若在开始位置且天数>1 判断是否结算
                      let f = confirm("是否出售所有黄金并等待结算？");
                      if (f) {
                        //todo 推送当前组成员 通知结束
                        this.goSuccess()
                        this.desertService.getCurrState().isSuccess = true
                        let params = {
                          sim_id: this.sim_id,
                          n_id: '-1'
                        };
                        this.http.getDataForRanking(params).subscribe(res => {
                          console.log(res)
                          let count = +res['totalRanking']
                          count = count + 1
                          let money = this.desertService.getCurrState().money;
                          switch (count) {
                            case 1:
                              money = money + (this.desertService.getCurrState().gold * 50 * 100)
                              break;
                            case 2:
                              money = money + (this.desertService.getCurrState().gold * 50 * 90)
                              break;
                            case 3:
                              money = money + (this.desertService.getCurrState().gold * 50 * 85)
                              break;
                            case 4:
                              money = money + (this.desertService.getCurrState().gold * 50 * 80)
                              break;
                            default:
                              money = money + (this.desertService.getCurrState().gold * 50 * 75)
                              break;


                          }
                          let p = {
                            sim_id: this.sim_id,
                            g_id: this.g_id,
                            n_id: this.n_id,
                            current_status: this.desertService.getCurrState(),
                            money: money + '',
                            answer: ''
                          }
                          console.log(p)
                          this.http.addGDKAnswer(p).subscribe(res => {
                            if (res['code'] == 0) {
                              this.navCtrl.pop();
                            } else {
                              this.showToast('bottom', res['msg']);
                            }
                            console.log('------addanswer------')
                            console.log(res)
                            // console.log('received message from server666: ', res['code']);
                            // this.value='';
                            // if (res['code'] == 0) {
                            //
                            // }
                          }, error => {
                            console.log(error)
                            this.navCtrl.pop();
                          });

                        })
                      }
                    }

                  }
                }
              })


            }
          })
          if (this.desertService.getCurrState().place == PLACE_TOMBS) {
            //若在王陵 获得随机事件
            if (this.group_u) {
              this.userData.getAlready(this.sim_id + this.n_id + this.desertService.getCurrState().days).then(res => {
                if (!res) {
                  let result = this.desertService.trigRandomEvent()
                  this.showToast('bottom', result.msg)
                  this.userData.setAlready(this.sim_id + this.n_id + this.desertService.getCurrState().days, true)
                } else {

                }

              })

            }
          }

        })

      })

    }, 1000)


  }


  registeReciever() {

    this.socketSubscription = this.ws.messages.subscribe(message => {
      let action = JSON.parse(message)['action'];
      let msgs = JSON.parse(message)['msg'];
      if (action != null) {
        if (action == 'phone_scene_answers_update') {
          let item = this.items.concat(JSON.parse(message)['list'])
          this.items = item
          setTimeout(() => {

            this.ioncontent.scrollToBottom(500);
          }, 1000)

        } else if (action === "phone_group") {
          this.userData.setAction(action);
        }

        if (action == 'phone_Death') {
          this.vibration.vibrate(1000);
          if (JSON.parse(message)['datas']['type'] == 'dead') {
            this.userData.setIsDead(true)
          } else if (JSON.parse(message)['datas']['type'] == 'success') {
            this.userData.setIsSuccess(true)
          }
          this.navCtrl.pop()
        }
        if (action === "phone_call") {
          this.vibration.vibrate(1000);
          this.showToast('bottom', msgs);
        } else if (action === "exercises_end") {
          if (this.sim_id == JSON.parse(message)['sim_id']) {
            this.showToast('bottom', '本次演练终止');
          }
        }

      }

    })
  }

  setWeather() {
    this.weather = this.desertService.getWeather()
    switch (this.weather) {
      case WEATHER_HOT_SANDSTORM:
        this.tqList = [{name: '沙暴', Img: 'assets/img/tq3.png'}, {name: '高温', Img: 'assets/img/tq2.png'}]
        break
      case WEATHER_HOT:
        this.tqList = [{name: '高温', Img: 'assets/img/tq2.png'}]
        break
      case WEATHER_SANDSTORM:
        this.tqList = [{name: '沙暴', Img: 'assets/img/tq3.png'}]
        break
      case WEATHER_SUNNY:
        this.tqList = [{name: '晴', Img: 'assets/img/tq1.png'}]
        break
    }
  }

  isLost() {
    this.lost = this.desertService.isGetLost()
    if (this.lost) {
      if (this.desertService.getCurrState().status) {
        for (let statu of  this.desertService.getCurrState().status) {
          if (statu.status_type == STATUS_GET_LOST) {

            this.lostDuration = statu.status_duration
            this.stay = true
          }
        }
      }


    }
  }

  mousedownd() {
    this.isShow = true
    this.src = 'assets/img/yuyin-3.png';
  }

  mouseup() {
    this.isShow = false
    this.src = 'assets/img/juxing-10.png';
  }

  private socketSubscription: Subscription

  canDigInMountain() {

    for (let statu of this.desertService.getCurrState().status) {
      if (statu.status_type == STATUS_CAN_DIG_IN_MOUNTAIN) {
        return true
      }
    }
    return false
  }

  currDay

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userData: UserData,
              public ws: ServerSocket,
              public vibration: Vibration,
              public http: ProxyHttpService,
              public sanitizer: DomSanitizer,
              public desertService: DesertService,
              public toastCtrl: ToastController) {
    this.ws.connect()
    this.userData.getUserID().then(value => this.userId = value)
    this.n_id = this.navParams.data.n_id
    this.g_id = this.navParams.data.g_id
    this.currDay = this.navParams.data.day
    this.s_data = this.navParams.data.s_data
    this.isHistory = this.navParams.data.isHistory
    this.name_position = this.navParams.data.name_position
    // this.sim_id=this.navParams.data.sim_id

    this.group_u = this.navParams.data.group_u

    this.userData.getSimId().then(value => {
      this.sim_id = value
      this.getAnswerOfStuList();
    })
  }

  getPlace() {
    switch (this.desertService.getCurrState().place) {
      case PLACE_START:
        return '营地'
      case PLACE_DESERT:
        return '沙漠'
      case PLACE_TOMBS:
        return '王陵'
      case PLACE_OASIS:
        return '绿洲'
      case PLACE_END:
        return '矿山'
      case PLACE_VILLIGE:
        return '村庄'
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

  getAnswerOfStuList() {
    this.param = {
      n_id: this.n_id,
      g_id: this.g_id,
      sim_id: this.sim_id
    };

    this.http.getAnswerOfStuList(this.param).subscribe(res => {
      this.items = res['list']
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        clearTimeout(this.timer)
        this.polling()
      }, 5000)
    });
  }

  getFullPath(path) {
    return this.http.getBaseurl() + path
  }


  send() {
    if (this.sendBtn) {
      this.sendBtn = false;
      this.param = {
        sim_id: this.sim_id,
        g_id: this.g_id,
        u_id: this.userId,
        answer: this.inputvalue,
        n_id: this.n_id
      };
      if (this.inputvalue != '') {
        this.http.addStuAnswer(this.param).subscribe(res => {
          console.log(res)
          this.inputvalue = '';
          this.sendBtn = true;
          this.showSuccess('bottom', '评论成功');
        }, error2 => {
          console.log(error2)
          this.sendBtn = true;
          this.showSuccess('bottom', '评论失败');
        });
      } else {
        this.sendBtn = true;
        this.showSuccess('bottom', '评论不能为空');
      }
    }
  }

  showSuccess(position: string, text: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: position
    });

    toast.present(toast);
  }

  goods = [];

  setGoods() {
    switch (this.desertService.getCurrState().place) {
      case PLACE_START:
        this.goods = [
          {
            type: ITEM_WATER,
            name: '水',
            num: 0,
            remain: this.desertService.getCurrState().water,
            weight: this.getPriceAndWeight(ITEM_WATER).weight,
            price: this.getPriceAndWeight(ITEM_WATER).price,
            image: 'assets/img/dj1.png'
          },
          {
            type: ITEM_FOOD,
            name: '食物',
            num: 0,
            remain: this.desertService.getCurrState().food,
            weight: this.getPriceAndWeight(ITEM_FOOD).weight,
            price: this.getPriceAndWeight(ITEM_FOOD).price,
            image: 'assets/img/dj2.png'
          }
          ,
          {
            type: ITEM_COMPASS,
            name: '指南针',
            num: 0,
            remain: this.desertService.getCurrState().compass,
            weight: this.getPriceAndWeight(ITEM_COMPASS).weight,
            price: this.getPriceAndWeight(ITEM_COMPASS).price,
            image: 'assets/img/dj4.png'
          }
          ,
          {
            type: ITEM_TENT,
            name: '帐篷',
            num: 0,
            remain: this.desertService.getCurrState().tent,
            weight: this.getPriceAndWeight(ITEM_TENT).weight,
            price: this.getPriceAndWeight(ITEM_TENT).price,
            image: 'assets/img/dj3.png'
          }
        ]
        break
      case PLACE_OASIS:
        this.goods = [
          {
            type: ITEM_WATER,
            name: '水',
            num: 0,
            remain: this.desertService.getCurrState().water,
            weight: this.getPriceAndWeight(ITEM_WATER).weight,
            price: this.getPriceAndWeight(ITEM_WATER).price,
            image: ''
          }

        ]
        break
      case PLACE_VILLIGE:
        this.goods = [
          {
            type: ITEM_WATER,
            name: '水',
            num: 0,
            remain: this.desertService.getCurrState().water,
            weight: this.getPriceAndWeight(ITEM_WATER).weight,
            price: this.getPriceAndWeight(ITEM_WATER).price,
            image: ''
          },
          {
            type: ITEM_FOOD,
            name: '食物',
            num: 0,
            remain: this.desertService.getCurrState().food,
            weight: this.getPriceAndWeight(ITEM_FOOD).weight,
            price: this.getPriceAndWeight(ITEM_FOOD).price,
            image: ''
          }
        ]
        break
      case PLACE_END:
        this.goods = [
          {
            type: ITEM_WATER,
            name: '水',
            num: 0,
            remain: this.desertService.getCurrState().water,
            weight: this.getPriceAndWeight(ITEM_WATER).weight,
            price: this.getPriceAndWeight(ITEM_WATER).price,
            image: ''
          }
        ]
        break
    }
  }

  TYPE_TRADE
  TYPE_ASK
  TYPE_PACKAGE
  TYPE_MAP
  TYPE_USE
  TYPE_THROW
  messages = []

  goodPlus(item) {

    item.num++
  }

  goodReduce(item) {
    if (item.num == 0) {
      return
    }
    item.num--

  }

  useCompass = false;
  useTent = false;

  userAction(type, item?, count?) {

    if (!this.group_u) {
      this.showToast('bottom', "只有领队可以执行")
      return
    }
    switch (type) {
      case 'trade':
        let result = this.desertService.trade(this.goods);

        if (!result.isSuccess) {
          this.showToast('bottom', result.msg)
          break;
        } else {
          for (let good of this.goods) {
            good.num = 0
            switch (good.type) {
              case ITEM_WATER:
                good.remain = this.desertService.getCurrState().water
                break;
              case ITEM_COMPASS:
                good.remain = this.desertService.getCurrState().compass
                break;
              case ITEM_FOOD:
                good.remain = this.desertService.getCurrState().food
                break;
              case ITEM_TENT:
                good.remain = this.desertService.getCurrState().tent
                break;
            }
          }
          this.showToast('bottom', '交易成功')
        }


        break;
      case 'use':
        let limType
        if (item == 'compass') {
          limType = ITEM_COMPASS
          if (this.desertService.useItem(limType)) {
            this.showToast('bottom', '使用成功')
            this.useCompass = true;

          } else {
            this.showToast('bottom', '使用失败')
          }
        } else if (item == 'tent') {
          limType = ITEM_TENT
          if (this.desertService.useItem(limType)) {
            this.showToast('bottom', '使用成功')
            this.useTent = true;
          } else {
            this.showToast('bottom', '使用失败')
          }
        }

        break
      case 'throw':
        if (item == 'food') {
          limType = ITEM_FOOD
        } else if (item == 'water') {
          limType = ITEM_WATER
        }
        else if (item == 'gold') {
          limType = ITEM_GOLD
        }
        else if (item == 'tent') {
          limType = ITEM_TENT
        }
        else if (item == 'compass') {
          limType = ITEM_COMPASS
        }


        if (this.desertService.throwItem(limType, count).isSuccess) {
          this.showToast('bottom', '丢弃成功')
        } else {
          this.showToast('bottom', '丢弃失败')
        }
        break


    }

    for (let good of this.goods) {

      switch (good.type) {
        case ITEM_FOOD:
          good.remain = this.desertService.getCurrState().food
          break;
        case ITEM_WATER:
          good.remain = this.desertService.getCurrState().water
          break;
        case ITEM_COMPASS:
          good.remain = this.desertService.getCurrState().compass
          break;
        case ITEM_TENT:
          good.remain = this.desertService.getCurrState().tent
          break;

      }

    }
  }


  common
  result
  name_position
  already
  stay = false

  ionViewDidLoad() {
    this.userData.setIsStay(false)
    this.userData.getSimId().then(res => {
      this.sim_id = res;


      this.userData.getAlready(this.sim_id + this.n_id + this.desertService.currState.days).then(res => {
        console.log(res)
        this.already = res
      });
      // JSON.parse()
      this.result = JSON.parse(this.s_data[0].s_data)
      this.common = this.result['componentList'][0].data.fillData;

      this.title = this.common.title;
      this.content = this.common.content;

      let params = {sim_id: this.sim_id, n_id: this.n_id, g_id: this.g_id, day: this.currDay}
      this.userData.getCurrentDays().then(v => {
        console.log(v)
        this.http.getGoldStatus(params).subscribe(res => {
          console.log(res['listGDK'])
          if (this.name_position.indexOf('-') != -1) {
            let arr = this.name_position.split('-')
            if (res['listGDK'].length > 0) {
              this.desertService.setCurrState(JSON.parse(res['listGDK'][0]['current_status']), arr[0], arr[1].split('.')[0])
            } else {
              this.desertService.setCurrState({
                position: '1',
                place: '营地',
                money: 900,
                weight: 900,
                food: 0,
                days: 1,
                water: 0,
                tent: 0,
                compass: 0,
                gold: 0,
                useTent: false,
                useCompass: false,
                asked: false,
                isSuccess: false,
                isDead: false,
                status: [],
                events: []
              }, arr[0], arr[1].split('.')[0])
            }

          }
          this.messages = this.desertService.getMessagesFromOlder()
          this.desertService.updateStatus()

          this.setGoods();
          this.getImgBg();
          this.setWeather()
          this.isLost();
          this.userData.getIsSuccess().then(v => {
            {
              this.userData.getIsDead().then(e => {
                {

                  if (!v && !e) {
                    if (this.desertService.getCurrState().place == PLACE_START && this.desertService.getCurrState().days > 1) {
                      //若在开始位置且天数>1 判断是否结算
                      let f = confirm("是否出售所有黄金并等待结算？");
                      if (f) {
                        //todo 推送当前组成员 通知结束
                        this.goSuccess()
                        this.desertService.getCurrState().isSuccess = true
                        let params = {
                          sim_id: this.sim_id,
                          n_id: '-1'
                        };
                        this.http.getDataForRanking(params).subscribe(res => {
                          console.log(res)
                          let count = +res['totalRanking']
                          count = count + 1
                          let money = this.desertService.getCurrState().money;
                          switch (count) {
                            case 1:
                              money = money + (this.desertService.getCurrState().gold * 50 * 100)
                              break;
                            case 2:
                              money = money + (this.desertService.getCurrState().gold * 50 * 90)
                              break;
                            case 3:
                              money = money + (this.desertService.getCurrState().gold * 50 * 85)
                              break;
                            case 4:
                              money = money + (this.desertService.getCurrState().gold * 50 * 80)
                              break;
                            default:
                              money = money + (this.desertService.getCurrState().gold * 50 * 75)
                              break;


                          }
                          let p = {
                            sim_id: this.sim_id,
                            g_id: this.g_id,
                            n_id: this.n_id,
                            current_status: this.desertService.getCurrState(),
                            money: money + '',
                            answer: ''
                          }
                          console.log(p)
                          this.http.addGDKAnswer(p).subscribe(res => {
                            if (res['code'] == 0) {
                              this.navCtrl.pop();
                            } else {
                              this.showToast('bottom', res['msg']);
                            }
                            console.log('------addanswer------')
                            console.log(res)
                            // console.log('received message from server666: ', res['code']);
                            // this.value='';
                            // if (res['code'] == 0) {
                            //
                            // }
                          }, error => {
                            console.log(error)
                            this.navCtrl.pop();
                          });

                        })
                      }
                    }

                  }
                }
              })


            }
          })
          if (this.desertService.getCurrState().place == PLACE_TOMBS) {
            //若在王陵 获得随机事件
            if (this.group_u) {
              this.userData.getAlready(this.sim_id + this.n_id + this.desertService.getCurrState().days).then(res => {
                if (!res) {
                  let result = this.desertService.trigRandomEvent()
                  this.showToast('bottom', result.msg)
                  this.userData.setAlready(this.sim_id + this.n_id + this.desertService.getCurrState().days, true)
                } else {

                }

              })

            }
          }

        })

      })


    })
    this.registeReciever();
  }

  isHistory
  askItems
  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad BaidutbPage');
  // }

  timer;

  polling() {
    this.getAnswerOfStuList()

  }

  ionViewWillLeave() {
    clearTimeout(this.timer)
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe()
    }


    if (this.isHistory) {
      return
    }
    if (!this.group_u) {
      return
    }
    this.userData.setIsStay(this.stay)
    this.desertService.getCurrState().useCompass = this.useCompass
    this.desertService.getCurrState().useTent = this.useTent
    let pas = {
      current_status: this.desertService.getCurrState(),
      gdkstate: "0",
      money: '0',
      sim_id: this.sim_id,
      n_id: this.n_id,
      g_id: this.g_id,
      day: this.currDay
    }

    this.http.updateRankingData(pas).subscribe(res => {
      console.log(res)
    })
    // this.userData.setSimData('simdata', this.currentStatus);
  }

  goSuccess() {
    this.userData.setIsSuccess(true)
    let params = {
      g_id: this.g_id,
      sim_id: this.sim_id,
      datas: {
        type: 'success',
        n_id: this.n_id,
        g_id: this.g_id
      }

    }
    this.desertService.getCurrState().isSuccess = true
    this.http.getPushDeathNoticeByGro(params).subscribe(res => {
      console.log(res)
    })
  }

  ionViewDidLeave() {
    clearTimeout(this.timer)
    if (this.socketSubscription)
      this.socketSubscription.unsubscribe();
  }

  bjPop() {
    this.bjPopShow = true;
    this.btmMore = false;
  }

  bjPopHide() {
    this.bjPopShow = false;
    this.lrPopShow = false;
    this.lrClickPopShow = false;
    this.mapShow = false;
    this.fzPopShow = false;
    this.btmMore = true;
  }

  lrPop() {
    this.lrPopShow = true;
    this.btmMore = false;
    this.askItems = this.desertService.getMessagesFromOlder()

  }

  getPriceAndWeight(type) {


    return this.desertService.getUnitWeightAndUnitPrice(type, this.desertService.getCurrState().place)
  }

  answer

  ShowDaAn(i) {
    if (this.already) {
      this.showToast('bottom', "今天已经回答过了，请明天再来")
      this.stay = true
      return
    }
    if (!this.group_u) {
      this.showToast('bottom', "我只回答领队的问题")
      return
    }
    this.stay = true
    this.already = true
    this.answer = this.desertService.getAnswer(i)
    this.lrClickPopShow = true;
    this.lrPopShow = false;
    this.btmMore = false;
    this.desertService.getCurrState().asked = true;

    this.userData.setAlready(this.sim_id + this.n_id + this.desertService.getCurrState().days, true)


  }

  mapsrc

  MapShow() {
    this.mapsrc = 'assets/img/' + this.desertService.currState.position + '.png'
    this.mapShow = true;
    this.btmMore = false;
  }

  fzPop() {
    this.fzPopShow = true;
    this.btmMore = false;
  }

  getImgBg() {
    console.log(this.type);
    if (this.desertService.currState.place == PLACE_START) {
      this.ImgBg = 'assets/img/bj1.png';
    } else if (this.desertService.currState.place == PLACE_OASIS) {
      this.ImgBg = 'assets/img/bj2.png';
    } else if (this.desertService.currState.place == PLACE_VILLIGE) {
      this.ImgBg = 'assets/img/bj3.png';
    } else if (this.desertService.currState.place == PLACE_DESERT) {
      this.ImgBg = 'assets/img/bj4.png';
    } else if (this.desertService.currState.place == PLACE_TOMBS) {
      this.ImgBg = 'assets/img/bj5.png';
    } else if (this.desertService.currState.place == PLACE_END) {
      this.ImgBg = 'assets/img/bj66.png';
    }
  }

  back() {
    this.navCtrl.pop();
  }

  getSx() {
    this.refreshData()
  }

}

import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {UsersPage} from "../users/users";
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {UserData} from "../../providers/user-data";
import {DesertService} from "../../providers/desert.service";

@IonicPage()
@Component({
  selector: 'page-decision',
  templateUrl: 'decision.html',
})
export class DecisionPage {
  items = [];
  param: any;
  name: '';
  isShow = false;
  datas: any;
  userId;
  sim_id;
  g_id
  n_id
  s_data
  select
  title
  result
  lastnid
  common
  common_data
  data_list: any;
  // data_list: any;
  // issue = '若你作为辉发乳业（集团）股份有限公司的决策者，关注到网贴后该如何决策？';
  options = [
    {option: 'A'},
    {option: 'B'},
    {option: 'C'},
    {option: 'D'},
    {option: 'E'},
    {option: 'F'},
    {option: 'G'},
    {option: 'H'},
    {option: 'I'},
    {option: 'J'},
    {option: 'K'},
    {option: 'L'},

  ]
  selectvalue;
  group_u
  simType
  u_id;
  simData;
  btnShow = true;
  stay
  btnClick = true;

  isShowBtn() {
    if (this.simType == 'gold') {
      return this.group_u
    } else {
      return true
    }
  }

  constructor(public desert:DesertService,public navCtrl: NavController, public navParams: NavParams, public userData: UserData, public http: ProxyHttpService, public toastCtrl: ToastController,) {
    this.userData.getUserID().then(value => this.userId = value)
    this.n_id = this.navParams.data.n_id;
    this.g_id = this.navParams.data.g_id;
    this.s_data = this.navParams.data.s_data;
    this.result = JSON.parse(this.s_data[0].s_data);
    this.common = this.result['componentList'][0].data.selectData;

    this.title = this.result['componentList'][0].data.text;
    this.sim_id = this.navParams.data.sim_id
    this.group_u = this.navParams.data.group_u
    this.simData = this.navParams.data.simData
    this.userData.getSimType().then(res => {
      this.simType = res;
      if (this.simType == 'gold') {
        this.userData.getIsStay().then(v => {
          this.stay = v;
          if (v) {
            let a = new Array
            a.push(this.common[0])
            this.common = a;
          }

        })
      }

    })
    this.sim_id = this.navParams.data.sim_id;
    for (let i in this.common) {
      this.common[i].Checked = false;
    }

    this.userData.getUserID().then(value => {
      this.userData.getCurrentDays().then(v=>{
        this.u_id = value
        let param = {sim_id: this.sim_id, n_id: this.n_id, u_id: this.u_id,day:v+''}
        this.http.getAnswerByUId(param).subscribe(res => {
          console.log(res);
          if (res['answer'] == -1) {
            this.btnShow = true;
          } else {
            this.common[res['answer']].Checked = true;
            this.btnShow = false;
          }
        })
      })

    })
    // this.getAnswerOfStuList();
  }

  getForm(item) {
    this.selectvalue = item.toString();
  }

  getUser() {
    this.navCtrl.push(UsersPage);
  }

  // getAnswerOfStuList() {
  //
  //   this.param = {
  //     n_id: this.n_id,
  //     g_id: this.g_id,
  //     sim_id: this.sim_id
  //   };
  //
  //   this.http.getAnswerOfStuList(this.param).subscribe(res => {
  //     console.log(res)
  //     this.items = res['list']
  //   });
  // }

  send() {
    if (this.btnClick) {
      this.btnClick = false;
      if (!this.selectvalue) {
        this.showToast('bottom', '请选择答案')
        return;
      }
      this.userData.getSimData('simdata').then(res => {
        this.param = {
          sim_id: this.sim_id,
          g_id: this.g_id,
          u_id: this.userId,
          answer: this.selectvalue,
          current_status: res,
          n_id: this.n_id,
          day:this.desert.currState.days+'',
          money: '0'
        };
        if (this.selectvalue != '') {
          if (this.simType == 'gold') {
            this.http.addGDKAnswer(this.param).subscribe(res => {
              if (res['code'] == 0) {
                this.btnClick = true;
                this.navCtrl.pop();
              } else {
                this.showToast('bottom', res['msg']);
                this.btnClick = true;
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
          } else {
            this.http.addStuAnswer(this.param).subscribe(res => {
              if (res['code'] == 0) {
                this.btnClick = true;
                this.navCtrl.pop();
              } else {
                this.btnClick = true;
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
              this.btnClick = true;
            });
          }

        }
      })
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
}

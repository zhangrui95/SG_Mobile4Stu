import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {UsersPage} from "../users/users";
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {UserData} from "../../providers/user-data";

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
    {option: 'G'}
  ]
  selectvalue;
  group_u
  simType
  u_id;
  simData;
  btnShow = true;
  stay
  constructor(public navCtrl: NavController, public navParams: NavParams,public userData: UserData, public http: ProxyHttpService,public toastCtrl: ToastController,) {
    this.userData.getUserID().then(value => this.userId = value)
    this.n_id=this.navParams.data.n_id;
    this.g_id=this.navParams.data.g_id;
    this.s_data = this.navParams.data.s_data;
    this.result = JSON.parse(this.s_data[0].s_data);
    this.common = this.result['componentList'][0].data.selectData;

    this.title = this.result['componentList'][0].data.text;
    this.sim_id = this.navParams.data.sim_id
    this.group_u = this.navParams.data.group_u
    this.simData = this.navParams.data.simData
    this.userData.getSimType().then(res => {
      this.simType = res;
    })
    this.sim_id=this.navParams.data.sim_id;
    for(let i in this.common){
      this.common[i].Checked = false;
    }
    this.userData.getIsStay().then(v=>{
      this.stay=v;
      let a =new Array
      a.push(this.common[0])
      this.common=a;
    })
    this.userData.getUserID().then(value => {
      this.u_id = value
      let param = {sim_id:this.sim_id,n_id:this.n_id,u_id:this.u_id}
      this.http.getAnswerByUId(param).subscribe(res => {
        console.log(res);
        if(res['answer'] == -1){
          this.btnShow = true;
        }else{
          this.common[res['answer']].Checked = true;
          this.btnShow = false;
        }
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

    let simD=this.userData.getSimData('simdata'+this.n_id)

    this.param = {
      sim_id: this.sim_id,
      g_id: this.g_id,
      u_id: this.userId,
      answer: this.selectvalue,
      current_status: simD,
      n_id: this.n_id,
      money: ''
    };


    if (this.selectvalue != '') {
      if (this.simType == 'gold') {
        this.http.addGDKAnswer(this.param).subscribe(res => {
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
      } else {
        this.http.addStuAnswer(this.param).subscribe(res => {
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
      }

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

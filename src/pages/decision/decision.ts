import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
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
  common
  common_data
  data_list: any;
  // data_list: any;
  // issue = '若你作为辉发乳业（集团）股份有限公司的决策者，关注到网贴后该如何决策？';
  options = [
    {option:'A'},
    {option:'B'},
    {option:'C'},
    {option:'D'},
    {option:'E'},
    {option:'F'},
    {option:'G'}
  ]
  selectvalue;

  constructor(public navCtrl: NavController, public navParams: NavParams,public userData: UserData, public http: ProxyHttpService) {
    this.n_id=this.navParams.data.n_id
    this.g_id=this.navParams.data.g_id
    this.s_data = this.navParams.data.s_data

    this.result = JSON.parse(this.s_data[0].s_data)
    this.common = this.result['componentList'][0].data.selectData;

    this.title = this.result['componentList'][0].data.text;
    this.sim_id=this.navParams.data.sim_id
  }

  getForm(item) {
    this.selectvalue = item.toString();
  }

  getUser() {
    this.navCtrl.push(UsersPage);
  }

  // vote() {
  //   console.log(this.Id);
  // }


  send() {
    this.param = {
      sim_id: this.sim_id,
      g_id:  this.g_id,
      u_id: this.userId,
      answer: this.selectvalue,
      n_id: this.n_id
    };
    if (this.selectvalue != '') {
      this.http.addStuAnswer(this.param).subscribe(res => {
        console.log('------addanswer------')
        console.log(res)
        // console.log('received message from server666: ', res['code']);
        // this.value='';
        // if (res['code'] == 0) {
        //
        // }
      });
    }
  }
}

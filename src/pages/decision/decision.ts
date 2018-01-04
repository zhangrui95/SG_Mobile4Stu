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
  data_list: any;
  // data_list: any;
  // issue = '若你作为辉发乳业（集团）股份有限公司的决策者，关注到网贴后该如何决策？';
  // options = [
  //   {id:'0',option:'A', text:'公开调查帖子内容的真实性'},
  //   {id:'1',option:'B', text:'私下联系发帖人，删除网帖，控制消息的网络传播渠道'},
  //   {id:'2',option:'C', text:'公开调查帖子内容的真实性'}
  // ]
  value;

  constructor(public navCtrl: NavController, public navParams: NavParams,public userData: UserData, public http: ProxyHttpService) {
    this.getScenesById();
  }

  getForm(item) {
    this.value = item.toString();
  }

  getUser() {
    this.navCtrl.push(UsersPage);
  }

  // vote() {
  //   console.log(this.Id);
  // }

  getScenesById() {
    this.param = {
      n_id: 3
    }
    this.http.getScenesById(this.param).subscribe(res => {
      this.data_list = JSON.parse(res['list'][0]['s_data'])['componentList']
      this.data_list[0].name = "select"

      this.data_list[0]['data'].text = '若你作为辉发乳业（集团）股份有限公司的决策者，关注到网贴后该如何决策？'
      this.data_list[0]['data']['selectData'] = [
        // {id: '0', option: 'A', text: '公开调查帖子内容的真实性'},
        // {id: '1', option: 'B', text: '私下联系发帖人，删除网帖，控制消息的网络传播渠道'},
        // {id: '2', option: 'C', text: '公开调查帖子内容的真实性'}
        'A.公开调查帖子内容的真实性',
        'B.私下联系发帖人，删除网帖，控制消息的网络传播渠道',
        'C.公开调查帖子内容的真实性'
      ]
      this.datas = this.data_list
    });
  }

  send () {
    this.param = {
      sim_id: 18,
      g_id: 2,
      u_id: this.userId,
      answer: this.value,
      n_id: 1
    };
    console.log(this.value)
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

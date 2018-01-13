import {Component} from '@angular/core';
import {
  IonicPage, NavController, NavParams
} from 'ionic-angular';
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {ServerSocket} from "../../providers/ws.service";


@IonicPage()
@Component({
  selector: 'page-scene-list',
  templateUrl: 'scene-list.html',
})
export class SceneListPage {
  items = [];
  param: any;
  isShow = false;
  datas: any;
  data_list: any;
  value: '';
  src = 'assets/img/juxing-10.png';
  userId;
  name='default';
  n_id;
  g_id;
  s_data;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: ProxyHttpService,
  public ws:ServerSocket) {
    this.n_id = this.navParams.get('n_id');
    this.g_id = this.navParams.get('g_id');
    this.getScenesById();
    this.ws.connect()
  }
  socketSubscription
  ionViewDidLoad() {
    if (this.ws.messages) {
      // setInterval(()=>{
      //   this.getAnswerOfStuList();
      // },2000);
      this.socketSubscription = this.ws.messages.subscribe((message: string) => {
        console.log('received message from server11111:' + message);
        if (JSON.parse(message)['action'] != null) {
          if (JSON.parse(message)['action'] == 'phone_scene_answers_update') {
            this.value = '';
            this.items = JSON.parse(message)['list']
          }
        }
        // const JSONComponentList = JSON.parse(message)['list'][0]['s_data'];
        // this.componentList = JSON.parse(JSONComponentList).componentList;
      })
    }
  }
  getScenesById() {
    this.param = {
      n_id: this.n_id
    }
    this.http.getScenesById(this.param).subscribe(res => {
      this.s_data = res['list'];
      this.data_list = JSON.parse(res['list'][0]['s_data'])['componentList']
      for (let component of this.data_list) {
        if (component.name == "SG_tieba" || component.name == "SG_bullet" || component.name == "SG_weibo" || component.name == "SG_brain" || component.name == "SG_select" || component.name == "SG_qq") {
          console.log(component.name)
         this.name = component.name
        }
      }
    });
  }
}

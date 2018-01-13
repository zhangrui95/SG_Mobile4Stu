import {Component} from '@angular/core';
import {
  IonicPage, NavController, NavParams
} from 'ionic-angular';
import {ProxyHttpService} from "../../providers/proxy.http.service";


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
  name;
  n_id;
  s_data;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: ProxyHttpService) {
    this.n_id = this.navParams.get('n_id');
    this.getScenesById();
  }

  getScenesById() {
    this.param = {
      n_id: this.n_id
    }
    this.http.getScenesById(this.param).subscribe(res => {
      console.log('list:' + res['list'][0]['s_data'])
      this.s_data = res['list'][0]['s_data'];
      this.data_list = JSON.parse(res['list'][0]['s_data'])['componentList']
      for (let component of this.data_list) {
        if (component.name == "SG_tieba" || component.name == "SG_bullet" || component.name == "SG_weibo" || component.name == "SG_brain" || component.name == "SG_select" || component.name == "SG_qq") {
          this.name = component.name
        }
      }


      this.name = this.data_list.name;

      // this.data_list.name = "SG_tieba"
      // this.data_list[0]['data']['fillData'].title = '事件名称'
      // this.data_list[0]['data']['fillData'].fillName = '大神';
      // this.data_list[0]['data']['fillData'].fillImg = this.src;
      // this.data_list[0]['data']['fillData'].content = '事件详情事件详情事件详情事件详情事件详情事件详情事件详情事件详情事件详情事件详情事件详情事件详情事件详情事件详情事件详情'

      // this.datas = this.data_list
      // console.log(this.datas[0].name)
    });
  }
}

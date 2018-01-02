import { Component } from '@angular/core';
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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: ProxyHttpService
  ) {
    this.getScenesById();
  }

  getScenesById() {
    this.param = {
      n_id: 3
    }
    this.http.getScenesById(this.param).subscribe(res => {
      console.log('list:'+res['list'][0]['s_data'])

      this.data_list = JSON.parse(res['list'][0]['s_data'])['componentList'][0]
      this.data_list.name = "tieba"
      // this.data_list[0]['data']['fillData'].title = '事件名称'
      // this.data_list[0]['data']['fillData'].fillName = '大神';
      // this.data_list[0]['data']['fillData'].fillImg = this.src;
      // this.data_list[0]['data']['fillData'].content = '事件详情事件详情事件详情事件详情事件详情事件详情事件详情事件详情事件详情事件详情事件详情事件详情事件详情事件详情事件详情'
     this.name=this.data_list.name
      // this.datas = this.data_list
      // console.log(this.datas[0].name)
    });
  }
}

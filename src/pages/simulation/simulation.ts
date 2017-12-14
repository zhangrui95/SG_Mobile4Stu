import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SimulationListPage} from "../simulation-list/simulation-list";
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {UserData} from "../../providers/user-data";

@IonicPage()
@Component({
  selector: 'page-simulation',
  templateUrl: 'simulation.html',
})
export class SimulationPage {
  userId;
  noDate;
  list = [];
  spinner1: boolean = true;
  hasmore = true;
  pageNo = 1;
  local = 'http://192.168.0.52:8080/files/ProjectImg/';

  constructor(public navCtrl: NavController,
              public http: ProxyHttpService,
              public userData:UserData,
              public navParams: NavParams) {
    this.userData.getUserID().then(value => this.userId=value)
  }
  ionViewWillEnter(){
    const params = {u_id: this.userId}
    this.http.getSimulationList(params).subscribe(res => {
      this.list = res['list'];
      this.pageNo += 1;
      this.spinner1 = false;
    });
  }
  doInfinite(infiniteScroll) {
    if (this.hasmore == false) {
      infiniteScroll.complete();
      return;
    }
    console.log('this.pageNo',this.pageNo)
    const params = {u_id: this.userId}
    this.http.getSimulationList(params).subscribe(res => {
      if (res['list'].length  > 0) {
        this.list = this.list.concat(res['list']);
        this.pageNo += 1;
      } else {
        this.hasmore = false;
        console.log("没有数据啦！");
      }
      infiniteScroll.complete();
    });
  }
  getList(){
    this.navCtrl.push(SimulationListPage);
  }

}

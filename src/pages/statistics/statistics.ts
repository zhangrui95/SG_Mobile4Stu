///<reference path="../../../node_modules/ionic-angular/tap-click/tap-click.d.ts"/>
import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {UserData} from "../../providers/user-data";
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {DetailsPage} from "../details/details";
import {CommentPage} from "../comment/comment";

/**
 * Generated class for the BaidutbPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html',
})


export class StatisticsPage {
  Flags: string = "1";
  datas = [];
  url;
  // datas1 = [];
  // datas_all = [];

  userId: string = "";
  param: any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userData: UserData,
              public http: ProxyHttpService) {
    this.userData.getUserID().then(value => this.userId = value)
    this.getList();
  }

  goDetails(data:any) {
    this.navCtrl.push(DetailsPage, {Id: data.id.toString(),Name:data.p_name});
  }
  goComment(data:any) {
    this.navCtrl.push(CommentPage, {Id: data.id.toString(),Name:data.p_name});
  }

  getList() {
    this.param = {
      userId: 80,
      Flag: this.Flags == 'all' ? '' : this.Flags
    }
    this.http.getappExercisesList(this.param).subscribe(res => {
      this.datas = res['List'];
      this.url=this.http.BASE_URL+"/";
    });

    // this.data_list[0]['fillData']['fillImg'] = this.sanitizer.bypassSecurityTrustResourceUrl(this.http.BASE_URL + this.datas[0]['fillData']['fillImg']);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatisticsPage');
  }
}

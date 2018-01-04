///<reference path="../../../node_modules/ionic-angular/tap-click/tap-click.d.ts"/>
import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ProxyHttpService} from "../../providers/proxy.http.service";

/**
 * Generated class for the BaidutbPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})


export class DetailsPage {
  datas = [];
  userId: string = "";
  param: any;
  name;
url;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: ProxyHttpService) {
    this.name=navParams.data.Name
    this.getappExercisesInfo();
  }


  getappExercisesInfo() {
    this.param = {
      Id: this.navParams.data.Id
    }
    console.log('id:'+this.param.Id)
    this.http.getappExercisesInfo(this.param).subscribe(res => {
      this.datas = res['List']
      this.url=this.http.BASE_URL+"/";
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatisticsPage');
  }
}

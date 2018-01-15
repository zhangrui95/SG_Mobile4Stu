///<reference path="../../../node_modules/ionic-angular/tap-click/tap-click.d.ts"/>
// import {Component, ViewChild} from '@angular/core';
import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Subscription} from "rxjs/Subscription";
import {ServerSocket} from "../../providers/ws.service";
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {DomSanitizer} from "@angular/platform-browser";
import {UserData} from "../../providers/user-data";

/**
 * Generated class for the BaidutbPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-baidutb',
  templateUrl: 'baidutb.html',
})


// export class BaidutbPage {
//   @ViewChild('ioncontent')
//   ioncontent
//   items;
// export class BaidutbPage{
export class BaidutbPage {
  @ViewChild('ioncontent')
  ioncontent
  items;

  // @ViewChild('topBox') topBox: ElementRef;
  // @ViewChild('list') list: ElementRef;
  // @ViewChild('show') show: ElementRef;
  // @ViewChild('hide') hide: ElementRef;
  // @ViewChild('nr') nr: ElementRef;
  // @ViewChild('show_hide') show_hide: ElementRef;
  // @ViewChild('hr_hid') hr_hid: ElementRef;

  param: any;
  title;
  isShow = false;
  data_list: any;
  inputvalue;
  src = 'assets/img/juxing-10.png';
  userId;

  content;
  sim_id;
  g_id
  n_id
  s_data


  mousedownd() {
    this.isShow = true
    this.src = 'assets/img/yuyin-3.png';
  }

  mouseup() {
    this.isShow = false
    this.src = 'assets/img/juxing-10.png';
  }

  // ngOnInit() {
  //   this.getData();
  // }
  private socketSubscription: Subscription

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userData: UserData,
              public ws: ServerSocket,
              public http: ProxyHttpService,
              public sanitizer: DomSanitizer) {
    this.ws.connect()
    this.userData.getUserID().then(value => this.userId = value)
    this.n_id = this.navParams.data.n_id
    this.g_id = this.navParams.data.g_id
    console.log(this.g_id)
    this.s_data = this.navParams.data.s_data
    this.sim_id = this.navParams.data.sim_id
    this.getAnswerOfStuList();

  }


  getAnswerOfStuList() {

    this.param = {
      n_id: this.n_id,
      g_id: this.g_id,
      sim_id: this.sim_id
    };

    this.http.getAnswerOfStuList(this.param).subscribe(res => {

      for (var i = 0; i < res['list'].length; i++) {
        let url=res['list'][i].ImagePath;
        if(url==''||url.length==0){
          res['list'][i].ImagePath = "assets/img/header.png";
        }else{
          res['list'][i].ImagePath=this.sanitizer.bypassSecurityTrustResourceUrl(this.http.getBaseurl() + url);
        }
      }
      this.items = res['list']


      setTimeout(() => {

        this.ioncontent.scrollToBottom(500);
      }, 1000)
    });
  }

  send() {
    this.param = {
      sim_id: this.sim_id,
      g_id: this.g_id,
      u_id: this.userId,
      answer: this.inputvalue,
      n_id: this.n_id
    };
    console.log('g_id:' + this.param.g_id + 'sim_id:' + this.param.sim_id + 'n_id:' + this.param.n_id)
    if (this.inputvalue != '') {
      this.http.addStuAnswer(this.param).subscribe(res => {
        console.log(res)
        this.inputvalue = '';
      });
    }
  }

  common
  result

  ionViewDidLoad() {
    // JSON.parse()

    this.result = JSON.parse(this.s_data[0].s_data)
    this.common = this.result['componentList'][0].data.fillData;

    this.title = this.common.title;
    this.content = this.common.content;

    // this.title='范德萨的发生非法违法文文';
    // this.content='范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文';

    if (this.ws.messages) {

      this.socketSubscription = this.ws.messages.subscribe(message => {
        let action = JSON.parse(message)['action'];
        if (action != null) {
          if (action == 'phone_scene_answers_update') {

            this.items = JSON.parse(message)['list']
            setTimeout(() => {

              this.ioncontent.scrollToBottom(500);
            }, 1000)


          } else if (action === "phone_group") {
            this.userData.setAction(action);
          }
        }

      })
    }
  }


  ionViewDidLeave() {
    if (this.socketSubscription)
      this.socketSubscription.unsubscribe();
  }
}

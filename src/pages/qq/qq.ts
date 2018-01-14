import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {
  IonicPage, NavController, NavParams
} from 'ionic-angular';
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {UserData} from "../../providers/user-data";
import {Subscription} from "rxjs/Subscription";
import {ServerSocket} from "../../providers/ws.service";
import {DomSanitizer} from "@angular/platform-browser";

@IonicPage()
@Component({
  selector: 'page-qq',
  templateUrl: 'qq.html',
})
export class QQPage implements  AfterViewInit{
  @ViewChild('topBox') topBox: ElementRef;
  @ViewChild('list') list: ElementRef;
  @ViewChild('show') show: ElementRef;
  @ViewChild('hide') hide: ElementRef;
  @ViewChild('nr') nr: ElementRef;
  @ViewChild('show_hide') show_hide: ElementRef;
  @ViewChild('hr_hid') hr_hid: ElementRef;
  items ;
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
    // this.getScenesById();
    this.n_id=this.navParams.data.n_id
    this.g_id=this.navParams.data.g_id
    this.s_data=this.navParams.data.s_data
    this.sim_id=this.navParams.data.sim_id
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
        res['list'][i].ImagePath = this.sanitizer.bypassSecurityTrustResourceUrl(this.http.BASE_URL + res['list'][i].ImagePath);
      }
      this.items = res['list']

    });
  }

  send() {
    this.param = {
      sim_id: this.sim_id,
      g_id:  this.g_id,
      u_id: this.userId,
      answer: this.inputvalue,
      n_id: this.n_id
    };


    this.http.addStuAnswer(this.param).subscribe(res => {
      console.log(res)
      this.inputvalue = '';


    });
  }
  common
  result
  ionViewDidLoad() {
    // JSON.parse()

    this.result=JSON.parse(this.s_data[0].s_data)
    this.common=this.result['componentList'][0].data.fillData;

    this.title=this.common.title;
    this.content=this.common.content;

    // this.title='范德萨的发生非法违法文文';
    // this.content='范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文';

    if (this.ws.messages) {

      this.socketSubscription = this.ws.messages.subscribe(message => {
        if (JSON.parse(message)['action'] != null) {
          if (JSON.parse(message)['action'] == 'phone_scene_answers_update') {

            this.items = JSON.parse(message)['list']
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

  ngAfterViewInit() {
    this.p_height();
  }

  p_height(){
    const height = this.topBox.nativeElement.offsetHeight;
    this.list.nativeElement.style.marginTop = height + 'px';
    // this.list.nativeElement.parentElement.style.marginTop = height + 'px';
    // this.list.nativeElement.parentElement.style.marginBottom = '65px';
  }

  show_div(){
    this.hide.nativeElement.style.display = 'block';
    this.show.nativeElement.style.display = 'none';
    this.nr.nativeElement.style.display = 'block';
    this.p_height();
  }
  hide_div(){
    this.show.nativeElement.style.display = 'block';
    this.hide.nativeElement.style.display = 'none';
    this.nr.nativeElement.style.display = '-webkit-box';
    this.p_height();
  }
}

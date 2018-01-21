import { Component, ViewChild} from '@angular/core';
import {
  IonicPage, NavController, NavParams, ToastController
} from 'ionic-angular';
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {UserData} from "../../providers/user-data";
import {ServerSocket} from "../../providers/ws.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Subscription} from "rxjs/Subscription";

@IonicPage()
@Component({
  selector: 'page-weibo',
  templateUrl: 'weibo.html',
})
export class WeiBoPage{

  @ViewChild('ioncontent')
  ioncontent
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
              public sanitizer: DomSanitizer,
              public toastCtrl: ToastController) {
    this.ws.connect()
    this.userData.getUserID().then(value => this.userId = value)
    // this.getScenesById();
    this.n_id=this.navParams.data.n_id
    this.g_id=this.navParams.data.g_id
    this.s_data=this.navParams.data.s_data
    this.sim_id=this.navParams.data.sim_id
    this.getAnswerOfStuList();
  }
  showToast(position: string, text: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: position
    });

    toast.present(toast);
  }

  getAnswerOfStuList() {

    this.param = {
      n_id: this.n_id,
      g_id: this.g_id,
      sim_id: this.sim_id
    };

    this.http.getAnswerOfStuList(this.param).subscribe(res => {
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

    if (this.inputvalue != '') {
      this.http.addStuAnswer(this.param).subscribe(res => {
        console.log(res)
        this.inputvalue = '';
        this.showSuccess('bottom', '评论成功');

      },error2 => {
        console.log(error2)
        this.inputvalue = '';

      });
    }
  }

  showSuccess(position: string, text: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: position
    });

    toast.present(toast);
  }

  getFullPath(path){
    return this.http.getBaseurl()+path
  }

  common
  result
  ionViewDidLoad() {
    // JSON.parse()

    this.result=JSON.parse(this.s_data[0].s_data)
    this.common=this.result['componentList'][0].data.fillData;

    this.title=this.common.fillName;
    this.content=this.common.content;

    // this.title='范德萨的发生非法违法文文';
    // this.content='范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文范德萨的发生非法违法文文';

    if (this.ws.messages) {

      this.socketSubscription = this.ws.messages.subscribe(message => {
        if (JSON.parse(message)['action'] != null) {
          let action=JSON.parse(message)['action'];
          let msgs = JSON.parse(message)['msg'];
          if (action != null) {
            if (action == 'phone_scene_answers_update') {
              if(this.n_id!=JSON.parse(message)['list'][0].n_id){
                return ;
              }
              let item = this.items.concat(JSON.parse(message)['list'])
              this.items=item

              setTimeout(()=>{

                this.ioncontent.scrollToBottom(500);
              },1000)


            }else if (action === "phone_group") {
              this.userData.setAction(action);
            } else if(action === "phone_call"){
              this.showToast('bottom', msgs);
            }else if (action === "exercises_end") {
              this.showToast('bottom', '本次演练终止');
            }
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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ServerSocket} from "../../providers/ws.service";
import {Subscription} from "rxjs/Subscription";
import {ProxyHttpService} from "../../providers/proxy.http.service";
import {PhotoViewer} from "@ionic-native/photo-viewer";


@IonicPage()
@Component({
  selector: 'page-default',
  templateUrl: 'default.html',
})
export class DefaultPage implements OnInit, OnDestroy {
  datas;
  n_id;
  g_id;
  name;
src;
  title;
  content;
  txt_length;
  s_data;
  sim_id;

  result
  common

  private socketSubscription: Subscription
  showPhoto(){
    this.photoViewer.show(this.src)
  }
  ngOnInit(): void {
    // console.log(this.s_data.s_data.componentList)
    // this.datas = this.s_data.s_data.componentList;
    this.ws.connect();
    this.intervalTimer = setInterval(() => {
      if (!this.ws.messages) {
        this.ws.connect();

      }
      if (this.ws.messages && !this.messagesSubscription) {
        this.registeReciever()
      }

    }, 5000)
    if (this.ws.messages && !this.messagesSubscription) {
      this.registeReciever()
    }

// this.name='img'
//     this.title = 'jdsiajdoi';
//     this.content = '一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十';


    let txtValues = new Array();
    let title;
    let content;

    this.result = JSON.parse(this.s_data[0].s_data)
    this.common = this.result['componentList'];
    for (let com of  this.common ) {
      let name = com.name;

      if (name == 'txt') {
        txtValues.push(com.data.text)

      }
      else {
        this.name=name;
        this.src=this.getFullpath(com.data.src);
      }

    }
    if (txtValues.length == 2) {
      if (txtValues[0].length >txtValues[1].length) {
        title = txtValues[1]
        content = txtValues[0]
      } else {
        content = txtValues[1]
        title = txtValues[0]
      }

    }

    this.title=title;
    this.content=content;
  }

  intervalTimer
  messagesSubscription;
  getFullpath(path){
    return  this.http.getBaseurl()+path
  }
  registeReciever() {
    console.log(this.ws.messages)
    this.ws.messages.subscribe(res => {
      console.log("2$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
      console.log(res)
      //{"action":"push_content_start","content":"11111"}
    })
  }
  // getFullPath(path){
  //   return this.http.getBaseurl()+path
  // }
  ngOnDestroy() {
    if (this.socketSubscription)
      this.socketSubscription.unsubscribe();
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: ServerSocket,
              public http: ProxyHttpService,private photoViewer: PhotoViewer) {
    this.n_id=this.navParams.data.n_id
    this.g_id=this.navParams.data.g_id
    this.s_data=this.navParams.data.s_data
    this.sim_id=this.navParams.data.sim_id

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupIndexPage');
  }

  // ionViewDidEnter() {
  //   if (this.ws.messages) {
  //     this.socketSubscription = this.ws.messages.subscribe((message: string) => {
  //       console.log('received message from server11111:' + message);
  //       if (JSON.parse(message)['action'] != null) {
  //         if (JSON.parse(message)['action'] == 'phone_scene_answers_update') {
  //           this.items = JSON.parse(message)['list']
  //         }
  //       }
  //     })
  //   }
  // }

  // ionViewDidLeave() {
  //   if (this.socketSubscription)
  //     this.socketSubscription.unsubscribe();
  // }
}

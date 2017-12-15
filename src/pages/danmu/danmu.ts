///<reference path="../../../node_modules/ionic-angular/tap-click/tap-click.d.ts"/>
import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the BaidutbPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-danmu',
  templateUrl: 'danmu.html',
})

export class DanmuPage {
  gender;
  items = [
    {
      tx_img: 'assets/img/header.png',
      name: '张三',
      floor: '第5楼',
      time: '今天 10:20',
      nr_src: '',
      nr: '测试测试测试测试测试测试测试测试测试测试测试'
    },
    {tx_img: 'assets/img/header.png', name: '李四', floor: '第4楼', time: '今天 10:10', nr_src: '', nr: '测试测试测试测试'},
    {tx_img: 'assets/img/header.png', name: '王萨吉', floor: '第3楼', time: '今天 10:00', nr_src: '', nr: '测试测试测试测试'},
    {tx_img: 'assets/img/header.png', name: '尚雯', floor: '第2楼', time: '今天 9:40', nr_src: '', nr: '测试测试测试测试测试测试测试测试'},
    {tx_img: 'assets/img/header.png', name: '老王', floor: '第1楼', time: '今天 9:20', nr_src: '', nr: '测试测试测试测试测试测试测试'}
  ]
  isShow=false;
  src='assets/img/juxing-10.png';
  mousedownd() {
    this.isShow = true
    this.src = 'assets/img/yuyin-3.png';
  }

  mouseup() {
    this.isShow = false
    this.src = 'assets/img/juxing-10.png';
  }
  send(){
    this.items.push({tx_img: 'assets/img/header.png', name: '莎萨', floor: '第6楼', time: '今天 10:10', nr_src: '', nr: '测试测试测试测试'})
  }
  constructor(public navCtrl: NavController,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TounaofbPage');
  }

}

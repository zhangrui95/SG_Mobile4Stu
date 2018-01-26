import {Injectable} from '@angular/core';


import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import {HttpClient} from "@angular/common/http";
import {UserData} from "./user-data";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';


const ITEM_TENT = 101;
const ITEM_WATER = 102;
const ITEM_FOOD = 103;
const ITEM_COMPASS = 104;
const ITEM_GOLD = 105;
const ITEM_MONEY = 106;
const PLACE_START = '营地';
const PLACE_DESERT = '沙漠';
const PLACE_OASIS = '绿洲';
const PLACE_VILLIGE = '村庄';
const PLACE_TOMBS = '王陵';
const PLACE_END = '矿山';

const WEATHER_SUNNY = 11101
const WEATHER_HOT = 11102
const WEATHER_SANDSTORM = 11103
const WEATHER_HOT_SANDSTORM = 11104

const EVENT_TRADE = 111101
const EVENT_TRADE_Villige = 111102
const EVENT_WATER_FREE = 111103
const EVENT_ASK = 111104
const EVENT_RANDOM_IN_TOMBS = 111105
const EVENT_DIGGING = 111106
const STATUS_GET_LOST = 1111101
const STATUS_CAN_DIG_IN_MOUNTAIN = 1111103

const totalDays = 18
const moneyOfGoldPerUnit = [100 * 50, 90 * 50, 85 * 50, 80 * 50, 75 * 50, 75 * 50, 75 * 50, 75 * 50, 75 * 50, 75 * 50, 75 * 50, 75 * 50, 75 * 50, 75 * 50, 75 * 50, 75 * 50]
const totalMoney = 900//金钱
const totalWeight = 900 //总负重
const foodUnitPrice = 10;//食物单价
const waterUnitPrice = 25;//水单价
const goldUnitPrice = 5000//25天金价
const tentUnitPrice = 150;//帐篷单价
const compassUnitPrice = 100;//指南针单价
const foodUnitWeight = 20;//食物单位负重
const waterUnitWeight = 20;//水单位负重
const goldUnitWeight = 50;//金单位负重
const tentUnitWeight = 20;//帐篷单位负重
const compassUnitWeight = 10;//指南针单位负重
const goldDiggedPerDay = 1;//每天挖掘金数
const lostKeepDays = 2;//迷路持续天数
const hotWaterConsumeRatio = 3;//炎热天气水消耗比率
const sandstormWaterConsumeRatio = 2;//沙尘天气水消耗比率
const hotsandstormWaterConsumeRatio = 4;//炎热沙尘天气水消耗比率
const getLostWaterRatio = 2;//迷路水消耗比率

const hotFoodConsumeRatio = 1;//炎热天气食物消耗比率
const sandstormFoodConsumeRatio = 5;//沙尘天气食物消耗比率
const hotsandstormFoodConsumeRatio = 5;//炎热沙尘天气食物消耗比率
const getLostFoodRatio = 2;//迷路食物消耗比率

const villigeFoodTradeRatio = 2; //村庄食物交易比率
const villigeWaterTradeRatio = 2;//村庄水交易比率

const baseFoodConsumePerDay = 1;//食物每天消耗基准
const baseWaterConsumePerDay = 1;//水每天消耗基准

const moneyNotEnough = '现金不足，无法交易';
const weightNotEnough = '负重已满，无法获取额外资源和道具';
const foodNotEnough = '食物消耗光了';
const waterNotEnough = '水消耗光了';
const tentNotEnough = '帐篷不够了';
const compassNotEnough = '指南针不够了';
const goldNotEnough = '金子不够了'

@Injectable()
export class DesertService {
  public getUnitWeightAndUnitPrice(type, place) {
    let price = 0
    let weight = 0;
    switch (type) {
      case ITEM_WATER:
        weight = waterUnitWeight
        switch (place) {
          case PLACE_START:
            price = waterUnitPrice
            break;
          case PLACE_VILLIGE:
            price = waterUnitPrice * villigeWaterTradeRatio
            break;
          case PLACE_OASIS:
            price = 0
            break;
          case PLACE_END:
            price = 0
            break;
        }
        break
      case ITEM_FOOD:
        weight = foodUnitWeight
        switch (place) {
          case PLACE_START:
            price = foodUnitPrice
            break;
          case PLACE_VILLIGE:
            price = foodUnitPrice * villigeFoodTradeRatio
            break;
        }
        break

      case ITEM_COMPASS:
        weight = compassUnitWeight
        price = compassUnitPrice
        break
      case ITEM_TENT:
        weight = tentUnitWeight
        price = tentUnitPrice
        break

    }
    return {weight: weight, price: price}
  }

  public setPlace(position){
    let index=+position;
    this.currState.place=this.places[index-1]
  }

  public getPlace(name) {



    if (name.indexOf("村庄") != -1) {
      this.currState.place = PLACE_VILLIGE
    }
    if (name.indexOf("营地") != -1) {
      this.currState.place = PLACE_START
    }
    if (name.indexOf("王陵") != -1) {
      this.currState.place = PLACE_TOMBS
    }
    if (name.indexOf("矿山") != -1) {
      this.currState.place = PLACE_END
    }
    if (name.indexOf("沙漠") != -1) {
      this.currState.place = PLACE_DESERT
    }
    if (name.indexOf("绿洲") != -1) {
      this.currState.place = PLACE_OASIS
    }
  }

  public getWeather() {

    switch (this.currState.place) {
      case PLACE_VILLIGE:
        return this.weathers[this.currState.days - 1].village
      case PLACE_START:

        return this.weathers[this.currState.days - 1].base
      case PLACE_OASIS:
        return this.weathers[this.currState.days - 1].oasis
      case PLACE_TOMBS:
        return this.weathers[this.currState.days - 1].tombs

      case PLACE_DESERT:

        return this.weathers[this.currState.days - 1].desert

      case PLACE_END:

        return this.weathers[this.currState.days - 1].mountain


    }

  }

  public weathers = [
    {
      desert: WEATHER_SUNNY,
      village: WEATHER_SUNNY,
      oasis: WEATHER_SUNNY,
      tombs: WEATHER_HOT,
      mountain: WEATHER_SUNNY,
      base: WEATHER_SUNNY
    }, {
      desert: WEATHER_HOT,
      village: WEATHER_SUNNY,
      oasis: WEATHER_SUNNY,
      tombs: WEATHER_SANDSTORM,
      mountain: WEATHER_SUNNY,
      base: WEATHER_SUNNY
    }
    , {
      desert: WEATHER_SUNNY,
      village: WEATHER_SUNNY,
      oasis: WEATHER_SUNNY,
      tombs: WEATHER_SUNNY,
      mountain: WEATHER_HOT,
      base: WEATHER_SUNNY
    }
    , {
      desert: WEATHER_HOT_SANDSTORM,
      village: WEATHER_SUNNY,
      oasis: WEATHER_SUNNY,
      tombs: WEATHER_SUNNY,
      mountain: WEATHER_SUNNY,
      base: WEATHER_SUNNY
    }
    , {
      desert: WEATHER_SUNNY,
      village: WEATHER_SUNNY,
      oasis: WEATHER_SUNNY,
      tombs: WEATHER_HOT,
      mountain: WEATHER_SUNNY,
      base: WEATHER_SUNNY
    }
    , {
      desert: WEATHER_SUNNY,
      village: WEATHER_SUNNY,
      oasis: WEATHER_SUNNY,
      tombs: WEATHER_SANDSTORM,
      mountain: WEATHER_HOT,
      base: WEATHER_SUNNY
    }, {
      desert: WEATHER_SUNNY,
      village: WEATHER_SUNNY,
      oasis: WEATHER_SUNNY,
      tombs: WEATHER_SUNNY,
      mountain: WEATHER_SUNNY,
      base: WEATHER_SUNNY
    }
    , {
      desert: WEATHER_HOT,
      village: WEATHER_SUNNY,
      oasis: WEATHER_SUNNY,
      tombs: WEATHER_SUNNY,
      mountain: WEATHER_SUNNY,
      base: WEATHER_SUNNY
    }
    , {
      desert: WEATHER_SUNNY,
      village: WEATHER_SUNNY,
      oasis: WEATHER_SUNNY,
      tombs: WEATHER_HOT,
      mountain: WEATHER_HOT,
      base: WEATHER_SUNNY
    }
    , {
      desert: WEATHER_HOT,
      village: WEATHER_SUNNY,
      oasis: WEATHER_SUNNY,
      tombs: WEATHER_SANDSTORM,
      mountain: WEATHER_SUNNY,
      base: WEATHER_SUNNY
    }
    , {
      desert: WEATHER_SUNNY,
      village: WEATHER_SUNNY,
      oasis: WEATHER_SUNNY,
      tombs: WEATHER_SUNNY,
      mountain: WEATHER_SUNNY,
      base: WEATHER_SUNNY
    }

    , {
      desert: WEATHER_SUNNY,
      village: WEATHER_SUNNY,
      oasis: WEATHER_SUNNY,
      tombs: WEATHER_SUNNY,
      mountain: WEATHER_HOT,
      base: WEATHER_SUNNY
    }
    , {
      desert: WEATHER_SUNNY,
      village: WEATHER_SUNNY,
      oasis: WEATHER_SUNNY,
      tombs: WEATHER_HOT,
      mountain: WEATHER_SUNNY,
      base: WEATHER_SUNNY
    }
    , {
      desert: WEATHER_SANDSTORM,
      village: WEATHER_SUNNY,
      oasis: WEATHER_SUNNY,
      tombs: WEATHER_SANDSTORM,
      mountain: WEATHER_SUNNY,
      base: WEATHER_SUNNY
    }
    , {
      desert: WEATHER_SUNNY,
      village: WEATHER_SUNNY,
      oasis: WEATHER_SUNNY,
      tombs: WEATHER_SUNNY,
      mountain: WEATHER_HOT,
      base: WEATHER_SUNNY
    }

    , {
      desert: WEATHER_HOT_SANDSTORM,
      village: WEATHER_SUNNY,
      oasis: WEATHER_SUNNY,
      tombs: WEATHER_SUNNY,
      mountain: WEATHER_SUNNY,
      base: WEATHER_SUNNY
    }

    , {
      desert: WEATHER_SUNNY,
      village: WEATHER_SUNNY,
      oasis: WEATHER_SUNNY,
      tombs: WEATHER_HOT,
      mountain: WEATHER_SUNNY,
      base: WEATHER_SUNNY
    }

    , {
      desert: WEATHER_SANDSTORM,
      village: WEATHER_SUNNY,
      oasis: WEATHER_SUNNY,
      tombs: WEATHER_SANDSTORM,
      mountain: WEATHER_HOT,
      base: WEATHER_SUNNY
    }

  ]


  public places = [
   '营地','沙漠','村庄','沙漠','沙漠','沙漠','沙漠','村庄','沙漠'
    ,'沙漠','沙漠','绿洲','沙漠','村庄','绿洲','王陵','沙漠'
    ,'沙漠','沙漠','沙漠','沙漠','村庄','沙漠','沙漠','矿山'
  ]

  public events =
    [
      {
        position: '1',
        place: PLACE_START,
        events: [
          {
            e_name: '营地交易',
            type: EVENT_TRADE
          }, {
            e_name: '询问老人',
            type: EVENT_ASK
          }
        ]
      }, {
      position: '3',
      place: PLACE_VILLIGE,
      events: [
        {
          e_name: '村庄交易',
          type: EVENT_TRADE_Villige
        }
      ]
    }, {
      position: '8',
      place: PLACE_VILLIGE,
      events: [
        {
          e_name: '村庄交易',
          type: EVENT_TRADE_Villige
        }
      ]
    }, {
      position: '14',
      place: PLACE_VILLIGE,
      events: [
        {
          e_name: '村庄交易',
          type: EVENT_TRADE_Villige
        }
      ]
    }, {
      position: '22',
      place: PLACE_VILLIGE,
      events: [
        {
          e_name: '村庄交易',
          type: EVENT_TRADE_Villige
        }
      ]
    }, {
      position: '12',
      place: PLACE_OASIS,
      events: [
        {
          e_name: '绿洲水源',
          type: EVENT_WATER_FREE
        }
      ]
    }, {
      position: '15',
      place: PLACE_OASIS,
      events: [
        {
          e_name: '绿洲水源',
          type: EVENT_WATER_FREE
        }
      ]
    }, {
      position: '16',
      place: PLACE_TOMBS,
      events: [
        {
          e_name: '王陵随机事件',
          type: EVENT_RANDOM_IN_TOMBS
        }
      ]
    }, {
      position: '25',
      place: PLACE_END,
      events: [
        {
          e_name: '大山掘金',
          type: EVENT_DIGGING
        }
      ]
    }
    ]


  public messagesFromOlder = [
    {title: '王陵天气', message: '王陵里的天气是相隔2天就会有2天高温或者沙尘暴的天气。', status: null},
    {title: '大山天气', message: '大山里的天气是相隔2天就会有1天的高温。', status: null},
    {title: '沙漠天气', message: '沙漠里高温或沙尘暴天气会出现在双数的日子里。', status: null},
    {title: '大山的秘密', message: '在大山中有秘密的水源', status: {status_type: STATUS_CAN_DIG_IN_MOUNTAIN, status_duration: -1}}

  ]

  public eventInTombs = [
    {item: ITEM_FOOD, add: true, num: 2},
    {item: ITEM_FOOD, add: true, num: 3},
    {item: ITEM_FOOD, add: false, num: 2},
    {item: ITEM_FOOD, add: false, num: 3},
    {item: ITEM_WATER, add: true, num: 3},
    {item: ITEM_WATER, add: true, num: 3},
    {item: ITEM_WATER, add: false, num: 4},
    {item: ITEM_WATER, add: false, num: 5},
    {item: ITEM_GOLD, add: true, num: 1},
    {item: ITEM_MONEY, add: true, num: 100},
    {item: ITEM_COMPASS, add: true, num: 1}

  ]

  public getRandomEventInTombs() {
    let index = Math.floor(Math.random() * this.eventInTombs.length)
    return this.eventInTombs[index]
  }

  public trigRandomEvent() {
    let isSuccess = true;
    let msg = '';
    let addOrReduce = '';
    let unit = '';
    let type = '';
    let event = this.getRandomEventInTombs()
    if (event.add) {
      addOrReduce = '增加'
    } else {
      addOrReduce = '减少'
    }
    switch (event.item) {
      case ITEM_FOOD:
        unit = '份'
        type = '食物'
        if (event.add) {
          if (this.currState.weight >= (event.num * foodUnitWeight)) {
            this.currState.weight = this.currState.weight - (event.num * foodUnitWeight);
            this.currState.food = this.currState.food + event.num
            msg = type + addOrReduce + event.num + unit
            isSuccess = true;
          } else {
            msg = weightNotEnough
            isSuccess = false;
          }
        } else {
          if (this.currState.food < event.num) {
            this.currState.food = 0;
            isSuccess = false;
            msg = foodNotEnough
            // this.goDead(this.currState.position)

          } else {
            this.currState.food = this.currState.food - event.num
            this.currState.weight = this.currState.weight + (event.num * foodUnitWeight)
            msg = type + addOrReduce + event.num + unit
            isSuccess = true;
          }
        }
        break;
      case ITEM_WATER:
        unit = '份'
        type = '水'
        if (event.add) {
          if (this.currState.weight >= (event.num * waterUnitWeight)) {
            this.currState.weight = this.currState.weight - (event.num * waterUnitWeight);
            this.currState.water = this.currState.water + event.num
            msg = type + addOrReduce + event.num + unit
            isSuccess = true;
          } else {
            msg = weightNotEnough
            isSuccess = false;
          }
        } else {
          if (this.currState.water < event.num) {
            this.currState.water = 0
            isSuccess = false;
            msg = waterNotEnough
            // this.goDead(this.currState.position)

          } else {
            this.currState.water = this.currState.water - event.num
            this.currState.weight = this.currState.weight + (event.num * waterUnitWeight)
            msg = type + addOrReduce + event.num + unit
            isSuccess = true;
          }
        }
        break;
      case ITEM_COMPASS:
        unit = '个'
        type = '指南针'
        if (event.add) {
          if (this.currState.weight >= (event.num * compassUnitWeight)) {
            this.currState.weight = this.currState.weight - (event.num * compassUnitWeight);
            this.currState.compass = this.currState.compass + event.num
            msg = type + addOrReduce + event.num + unit
            isSuccess = true;
          } else {
            msg = weightNotEnough
            isSuccess = false;
          }
        } else {
          if (this.currState.compass < event.num) {
            this.currState.compass = 0
            isSuccess = false;
          } else {
            this.currState.compass = this.currState.compass - event.num
            this.currState.weight = this.currState.weight + (event.num * compassUnitWeight)
            msg = type + addOrReduce + event.num + unit
            isSuccess = true;
          }
        }
        break;
      case ITEM_GOLD:
        unit = '袋'
        type = '金子'
        if (event.add) {
          if (this.currState.weight >= (event.num * goldUnitWeight)) {
            this.currState.weight = this.currState.weight - (event.num * goldUnitWeight);
            this.currState.gold = this.currState.gold + event.num
            msg = type + addOrReduce + event.num + unit
            isSuccess = true;
          } else {
            msg = weightNotEnough;
            isSuccess = false;
          }
        } else {
          if (this.currState.gold < event.num) {
            this.currState.gold = 0
            isSuccess = false;

          } else {
            this.currState.gold = this.currState.gold - event.num
            this.currState.weight = this.currState.weight + (event.num * goldUnitWeight)
            msg = type + addOrReduce + event.num + unit
            isSuccess = true;
          }
        }
        break;
      case ITEM_MONEY:
        unit = '元'
        type = '现金'
        if (event.add) {
          this.currState.money = this.currState.money + event.num
          msg = type + addOrReduce + event.num + unit
          isSuccess = true;
        } else {
          if (this.currState.money < event.num) {
            this.currState.money = 0
            isSuccess = false;
          } else {
            this.currState.money = this.currState.money - event.num
            msg = type + addOrReduce + event.num + unit
            isSuccess = true;
          }
        }
        break;
    }
    return {isSuccess: isSuccess, msg: '王陵事件:'+msg}
  }

  public setCurrState(state, name, pos) {
    console.log(name)
    if (state) {
      this.currState = state;
    }
    this.currState.position = pos
    this.setPlace(pos)
  }

  public getCurrState() {
    return this.currState
  }

  public currState = {
    position: '1',
    place: PLACE_START,
    money: totalMoney,
    weight: totalWeight,
    food: 0,
    days: 1,
    water: 0,
    tent: 0,
    compass: 0,
    gold: 0,
    useTent:false,
    useCompass:false,
    asked: false,
    isSuccess: false,
    isDead: false,
    status: [],
    events: [
    ]
  };
  public reduce = {food: 0, water: 0};

  //events
  public trade(arr) {
    let isSuccess = false;
    let msg = "";
    let tempMoney = this.currState.money
    let tempWeight = this.currState.weight

    for (let a of arr) {
      let count = a.num
      let price = a.price
      let weight = a.weight;
      tempMoney = tempMoney - (price * count);
      tempWeight = tempWeight - (weight * count);

    }
    if (tempMoney >= 0 && tempWeight >= 0) {
      this.currState.money = tempMoney
      this.currState.weight = tempWeight
      for (let a of arr) {
        let count = a.num
        switch (a.type) {
          case ITEM_COMPASS:
            this.currState.compass = this.currState.compass + count;
            a.remain=this.currState.compass
            break
          case
          ITEM_FOOD:
            this.currState.food = this.currState.food + count;
            a.remain=this.currState.food
            break
          case ITEM_WATER:

            this.currState.water = this.currState.water + count;
            a.remain=this.currState.water
            break
          case ITEM_TENT:

            this.currState.tent = this.currState.tent + count;
            a.remain=this.currState.tent
            break
        }
        a.num=0
      }
    } else if (tempMoney < 0) {
      isSuccess = false;
      msg = moneyNotEnough
    } else if (tempWeight < 0) {
      isSuccess = false;
      msg = weightNotEnough
    }

    return {
      isSuccess: isSuccess
      ,
      msg: msg
    };
  }


  public waterfree(count) {
    let isSuccess = false
    let msg = '';
    let tempWeight = this.currState.weight - (waterUnitWeight * count);
    if (tempWeight > 0) {
      this.currState.water = this.currState.water + count;
      this.currState.weight = tempWeight
      isSuccess = true
    } else if (tempWeight <= 0) {
      isSuccess = false;
      msg = weightNotEnough

    }
    return {isSuccess: isSuccess, msg: msg};
  }


  public isGetLost() {

    for (let statu of this.currState.status) {

      if (statu.status_type == STATUS_GET_LOST) {
        if (statu.status_duration > 0) {
          return true;
        }
      }
    }
    return false;
  }



  public isAlive(flag) {
    return flag
  }


  public consume(type, useTent ?) {
    let isSuccess = true;
    let msg = ''
    let tempWater;
    let tempFood;
    let tempWaterRatio = 1;
    let tempFoodRatio = 1;
    switch (type) {
      case WEATHER_HOT:

        tempWaterRatio = hotWaterConsumeRatio
        tempFoodRatio = hotFoodConsumeRatio
        break;
      case WEATHER_SUNNY:
        tempWaterRatio = 1
        tempFoodRatio = 1
        break;
      case WEATHER_HOT_SANDSTORM:
        if (!useTent) {
          tempWaterRatio = hotsandstormWaterConsumeRatio
          tempFoodRatio = hotsandstormFoodConsumeRatio
        }

        break;
      case WEATHER_SANDSTORM:
        if (!useTent) {
          tempWaterRatio = sandstormWaterConsumeRatio
          tempFoodRatio = sandstormFoodConsumeRatio
        }

        break;
    }
    let reduceFood = baseFoodConsumePerDay * tempFoodRatio
    let reduceWater = baseWaterConsumePerDay * tempWaterRatio

    if (this.isGetLost()) {
      reduceWater = reduceWater * getLostWaterRatio
      reduceFood = reduceFood * getLostFoodRatio
    }
    this.reduce.water = reduceWater;
    this.reduce.food = reduceFood;
    tempFood = this.currState.food - reduceFood;
    tempWater = this.currState.water - reduceWater;


    if (tempFood <= 0) {
      this.currState.food = 0
      this.currState.weight = this.currState.weight + ((reduceFood - this.currState.food) * foodUnitWeight)
      isSuccess = false;
      msg = foodNotEnough
    }
    if (tempWater <= 0) {
      this.currState.water = 0
      this.currState.weight = this.currState.weight + ((reduceWater - this.currState.water) * waterUnitWeight)
      isSuccess = false;
      msg = waterNotEnough
    }
    this.currState.water = tempWater;
    this.currState.food = tempFood;
    this.currState.weight = this.currState.weight + (reduceFood * foodUnitWeight)
    this.currState.weight = this.currState.weight + (reduceWater * waterUnitWeight)


    return {isSuccess: isSuccess, msg: msg}
  }


  public useItem(item) {
    switch (item) {
      case ITEM_TENT:
        if (this.currState.tent > 0) {
          this.currState.tent--
          this.currState.weight = this.currState.weight + tentUnitWeight
          return true;
        } else {
          return false
        }
      case ITEM_COMPASS:
        if (this.currState.compass > 0) {
          this.currState.compass--
          this.currState.weight = this.currState.weight + compassUnitWeight
          return true;
        } else {
          return false
        }

    }
  }


  public digging() {
    let tempWeight = this.currState.weight - (goldDiggedPerDay * goldUnitWeight)
    if (tempWeight > 0) {
      this.currState.gold = this.currState.gold + goldDiggedPerDay;
      this.currState.weight = tempWeight
    }
  }


  public throwItem(item, count) {
    let isSuccess = true;
    let msg = "";
    switch (item) {
      case ITEM_COMPASS:
        if (this.currState.compass >= count) {
          this.currState.weight = this.currState.weight + (compassUnitWeight * count)
          this.currState.compass = this.currState.compass - count
        } else {
          msg = compassNotEnough
          isSuccess = false
        }
        break;
      case ITEM_TENT:
        if (this.currState.tent >= count) {
          this.currState.weight = this.currState.weight + (tentUnitWeight * count)
          this.currState.tent = this.currState.tent - count
        } else {
          msg = tentNotEnough
          isSuccess = false
        }
        break;
      case ITEM_FOOD:
        if (this.currState.food >= count) {
          this.currState.weight = this.currState.weight + (foodUnitWeight * count)
          this.currState.food = this.currState.food - count
        } else {
          msg = foodNotEnough
          isSuccess = false
        }
        break;
      case ITEM_WATER:
        if (this.currState.water >= count) {
          this.currState.weight = this.currState.weight + (waterUnitWeight * count)
          this.currState.water = this.currState.water - count
        } else {
          msg = waterNotEnough
          isSuccess = false
        }
        break;
      case ITEM_GOLD:
        if (this.currState.gold >= count) {
          this.currState.weight = this.currState.weight + (goldUnitWeight * count)
          this.currState.gold = this.currState.gold - count
        } else {
          msg = goldNotEnough
          isSuccess = false
        }
        break;
    }
    return {isSuccess: isSuccess, msg: msg};

  }


  public getMessagesFromOlder() {
    return this.messagesFromOlder;
  }


  public getAnswer(i) {
    let item = this.messagesFromOlder[i]
    if (item.status&&item.status.status_type == STATUS_CAN_DIG_IN_MOUNTAIN) {
      this.currState.status.push(item.status)
      for (let e of this.events) {
        if (e.place == PLACE_END) {
          e.events.push({
            e_name: '神秘水源',
            type: EVENT_WATER_FREE
          })
        }
      }
    }
    return item.message

  }


  public setStatus(statu, durations) {
    this.currState.status.push({status_type: statu, status_duration: durations})
  }
  setDays(days){
    this.currState.days=days
  }

  public setLostStatus() {
    let flag = false;
    for (let statu of this.currState.status) {
      if (statu.status_type == STATUS_GET_LOST) {
        statu.status_duration = lostKeepDays
        flag = true
      }
    }
    if (!flag) {
      this.setStatus(STATUS_GET_LOST, lostKeepDays)
    }

  }

  goSuccess() {
    this.currState.money = this.currState.money + this.currState.gold * goldUnitPrice[this.currState.days - 1]
    //todo 跳转到成功界面

  }

  goDead(position) {
    if (position == 'A1') {
      this.goSuccess();
    } else {
      //todo 跳转到死亡界面
    }
  }


  public updateEvent() {
    for (let event of this.events) {
      if (event.position == this.currState.position) {
        this.currState.events = event.events
      }
    }
  }


  public updateStatus() {
    for (let statu of this.currState.status) {
      if (statu.status_duration > 0) {
        statu.status_duration--
      }

    }
  }


  public onNext(state) {

    this.currState = state;

    this.updateEvent();
    this.updateStatus();

    if (this.currState.days == totalDays) {
      this.goDead(this.currState.position)
      return
    }
    if (this.currState.position == 'A1') {
      //todo confirm 欢迎回来，是否出售所有金子并结束本次游戏？
      return
    }
    if (!this.isAlive(this.consume(this.weathers[this.currState.days - 1]).isSuccess)) {
      this.goDead(this.currState.position)
      return
    }


  }

  getEventByCurrPos() {

    for (let event of this.events) {
      if (event.position == this.currState.position) {
        this.currState.events = event.events
      }
    }
  }



  getResult() {
    //todo 根据先后返回的结果 计算金价
    console.log(moneyOfGoldPerUnit)
  }

  constructor(public http: HttpClient, public userData: UserData) {

  }


}

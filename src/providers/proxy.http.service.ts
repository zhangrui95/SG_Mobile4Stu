import { Injectable } from '@angular/core';



import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import {HttpClient, HttpParams} from "@angular/common/http";
import {UserData} from "./user-data";


@Injectable()
export class ProxyHttpService {

  public static IP_PORT="http://192.168.0.52:8080";
  public static PROJECT_PACKAGE="/VisualizationMgt"
  public BASE_URL=ProxyHttpService.IP_PORT+ProxyHttpService.PROJECT_PACKAGE
  constructor(public http: HttpClient,public userData:UserData) {

  }





updateRankingData(params){
  return this._post("/phoneAppController/updateRankingData.do",params)
}
  login(params){
    return this._post("/userstu/login.do",params)
  }

  updatePhone(params){
    return this._post("/userstu/updatePhone.do",params)
  }

  updatePass(params){
    return this._post("/userstu/updatePass.do",params)
  }

  getVersionByType(params){
    return this._post("/version/getVersionByType.do",params)
  }

  register(params){
    return this._post("/userstu/register.do",params)
  }

  updateHeadPic(params){
    return this._post("/userstu/updateHeadPic.do",params)
  }

  getSimulationList(params){
    return this._get("/phoneAppController/getSimulationList.do",params)
  }

  initPass(params){
    return this._post("/userstu/initPass.do",params)
  }

  getProcessOfStu(params){
    return this._get("/phoneAppController/getProcessOfStu.do",params)
  }

  getPushFreeGroListForPhone(params){
    return this._post("/tabletController/getPushFreeGroListForPhone.do",params)
  }

  addfreeGroupOfStu(params){
    return this._post("/phoneAppController/addfreeGroupOfStu.do",params)
  }

  getScenesById(params){
    return this._get("/phoneAppController/getScenesById.do",params)
  }
  getAnswerOfStuList(params){
    return this._post("/phoneAppController/getAnswerOfStuList.do",params)
  }


  getPushDeathNoticeByGro(params){
    return this._post("/phoneAppController/getPushDeathNoticeByGro.do",params)
  }


  getDataForRanking(params){
    return this._get("/phoneAppController/getDataForRanking.do",params)
  }

  addStuAnswer(params){
    return this._post("/phoneAppController/addStuAnswer.do",params)
  }
  getappExercisesList(params){
    return this._get("/statistical/appExercisesList.do",params)
  }
  getappExercisesInfo(params){
    return this._post("/statistical/appExercisesInfo.do",params)
  }
  addGDKAnswer(params){
    return this._post("/phoneAppController/addGDKAnswer.do",params)
  }


  getGroupsList(params){
    return this._get("/phoneAppController/getGroupsList.do",params)
  }
  getGoldStatus(params){
    return this._get("/phoneAppController/getGDKDataByNId.do",params)
  }

  getIsExistEndCour(params){
    return this._get("/phoneAppController/getIsExistEndCour.do",params)
  }

  addClassPractice(params){
    return this._post("/phoneAppController/addClassPractice.do",params)
  }
  getAnswerByUId(params){
    return this._get("/phoneAppController/getAnswerByUId.do",params)
  }



  getBaseurl(){
    return ProxyHttpService.IP_PORT;
  }


  _post(url,params?:any){
    console.log(this.BASE_URL + url)
    params.deviceType="phone"
    params.token=this.userData.userToken;
    console.log(JSON.stringify(params))

    return this.http.post(this.BASE_URL + url, JSON.stringify(params))
  }

  _get(url, params?: HttpParams) {
    var p = new HttpParams();
    for (let key in params) {
      p = p.append(key, params[key])
    }
    p = p.append("deviceType", "phone");
    p = p.append("token", this.userData.userToken)
    return this.http.get(this.BASE_URL + url, {params: p})

  }
}

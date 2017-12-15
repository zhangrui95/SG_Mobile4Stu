import { Injectable } from '@angular/core';



import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import {HttpClient, HttpParams} from "@angular/common/http";


@Injectable()
export class ProxyHttpService {

  public static IP_PORT="http://192.168.0.52:8080";
  public static PROJECT_PACKAGE="/VisualizationMgt"
  public BASE_URL=ProxyHttpService.IP_PORT+ProxyHttpService.PROJECT_PACKAGE
  constructor(public http: HttpClient) {

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


  _post(url,params?:any){
    return this.http.post(this.BASE_URL+url,JSON.stringify(params))
  }
  _get(url,params?:HttpParams){
    return this.http.get(this.BASE_URL+url,{params:params})
  }
}

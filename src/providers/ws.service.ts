import {Injectable} from '@angular/core'
import {QueueingSubject} from 'queueing-subject'
import {Observable} from 'rxjs/Observable'
import websocketConnect from 'rxjs-websockets'
import 'rxjs/add/operator/share'
import {UserData} from "./user-data";
import "rxjs/add/operator/retryWhen";
import "rxjs/add/operator/delay";

@Injectable()
export class ServerSocket {
  constructor(public userData: UserData) {

  }

  private inputStream: QueueingSubject<string>
  public messages: Observable<string>

  // constructor(private token :TokenService){}
  public connect() {
    if (this.messages)
      return

    // Using share() causes a single websocket to be created when the first
    // observer subscribes. This socket is shared with subsequent observers
    // and closed when the observer count falls to zero.
    if (this.userData.userToken) {
      this.messages = websocketConnect(
        'ws://192.168.0.52:8080/VisualizationMgt/websocket.do?token=' + this.userData.userToken + "&type=phone",
        this.inputStream = new QueueingSubject<string>()
      ,[]).messages.retryWhen(errors => errors.delay(1000)).share()

    }
  }

  public send(message: string): void {
    // If the websocket is not connected then the QueueingSubject will ensure
    // that messages are queued and delivered when the websocket reconnects.
    // A regular Subject can be used to discard messages sent when the websocket
    // is disconnected.
    this.inputStream.next(message)
  }
}

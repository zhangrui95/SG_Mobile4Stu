import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';

import { ConferenceApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { PopoverPage } from '../pages/about-popover/about-popover';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { SchedulePage } from '../pages/schedule/schedule';
import { ScheduleFilterPage } from '../pages/schedule-filter/schedule-filter';
import { SessionDetailPage } from '../pages/session-detail/session-detail';
import { SignupPage } from '../pages/signup/signup';
import { SpeakerDetailPage } from '../pages/speaker-detail/speaker-detail';
import { SpeakerListPage } from '../pages/speaker-list/speaker-list';
import { TabsPage } from '../pages/tabs-page/tabs-page';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { SupportPage } from '../pages/support/support';
import { UsersPage } from '../pages/users/users';
import { PhonePage } from '../pages/phone/phone'
import { PasswordPage } from '../pages/password/password';
import { UpdatePage } from "../pages/update/update";
import { LoginsPage } from  '../pages/logins/logins'
import { SigninPage } from '../pages/signin/signin'
import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';
import {HttpClientModule} from "@angular/common/http";
import {ProxyHttpService} from "../providers/proxy.http.service";

import {Camera} from "@ionic-native/camera";
import {ImagePicker} from "@ionic-native/image-picker";
import {IndexPage} from "../pages/index/index";
import {ClassroomPage} from "../pages/classroom/classroom";
import {GroupingPage} from "../pages/grouping/grouping";
import {DecisionPage} from "../pages/decision/decision";
import {Base64} from "@ionic-native/base64";
import {RecordsPage} from "../pages/records/records";
import {SimulationPage} from "../pages/simulation/simulation";

import {BaidutbPage} from "../pages/baidutb/baidutb";
import {TounaofbPage} from "../pages/tounaofb/tounaofb";
import {DanmuPage} from "../pages/danmu/danmu";
import {FindPasswordPage} from "../pages/find-password/find-password";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {SimulationListPage} from "../pages/simulation-list/simulation-list";
import {RecordsListPage} from "../pages/records-list/records-list";
import {GradePage} from "../pages/grade/grade";

import { WeiBoPage } from '../pages/weibo/weibo';
import { QQPage } from '../pages/qq/qq';
import {BottomPage} from "../pages/bottom/bottom";
import {ServerSocket} from "../providers/ws.service";
import {SceneListPage} from "../pages/scene-list/scene-list";
import {StatisticsPage} from "../pages/statistics/statistics";
import {DetailsPage} from "../pages/details/details";
import {CommentPage} from "../pages/comment/comment";
import {GroupIndexPage} from "../pages/group-index/group-index";
@NgModule({
  declarations: [
    ConferenceApp,
    AboutPage,
    AccountPage,
    LoginPage,
    MapPage,
    PopoverPage,
    SchedulePage,
    ScheduleFilterPage,
    SessionDetailPage,
    SignupPage,
    SpeakerDetailPage,
    SpeakerListPage,
    TabsPage,
    TutorialPage,
    SupportPage,
    UsersPage,
    PasswordPage,
    UpdatePage,
    LoginsPage,
    SigninPage,
    PhonePage,
    BottomPage,
    ClassroomPage,
    DecisionPage,
    GroupingPage,
    SimulationPage,
    SimulationListPage,
    RecordsPage,
    RecordsListPage,
    IndexPage,
    BaidutbPage,
    FindPasswordPage,
    TounaofbPage,
    DanmuPage,
    FindPasswordPage,
    GradePage,
    WeiBoPage,
    QQPage,
    SceneListPage,
    StatisticsPage,
    DetailsPage,
    CommentPage,
    GroupIndexPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(ConferenceApp, {}, {
      links: [
        { component: TabsPage, name: 'TabsPage', segment: 'tabs-page' },
        { component: SchedulePage, name: 'Schedule', segment: 'schedule' },
        { component: SessionDetailPage, name: 'SessionDetail', segment: 'sessionDetail/:sessionId' },
        { component: ScheduleFilterPage, name: 'ScheduleFilter', segment: 'scheduleFilter' },
        { component: SpeakerListPage, name: 'SpeakerList', segment: 'speakerList' },
        { component: SpeakerDetailPage, name: 'SpeakerDetail', segment: 'speakerDetail/:speakerId' },
        { component: MapPage, name: 'Map', segment: 'map' },
        { component: AboutPage, name: 'About', segment: 'about' },
        { component: GroupIndexPage, name: 'GroupIndexPage', segment: 'pageindex' },
        { component: TutorialPage, name: 'Tutorial', segment: 'tutorial' },
        { component: SupportPage, name: 'SupportPage', segment: 'support' },
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
        { component: AccountPage, name: 'AccountPage', segment: 'account' },
        { component: SignupPage, name: 'SignupPage', segment: 'signup' },
        { component: UsersPage, name: 'UsersPage', segment: 'user' },
        { component: PasswordPage, name: 'PasswordPage', segment: 'password' },
        { component: UpdatePage, name: 'UpdatePage', segment: 'update' },
        { component: LoginsPage, name: 'LoginsPage', segment: 'logins' },
        { component: PhonePage, name: 'PhonePage', segment: 'phone' },
        { component: BottomPage, name: 'BottomPage', segment: 'bottom' },
        { component: SigninPage, name: 'SigninPage', segment: 'signin' },
        { component: IndexPage, name: 'IndexPage', segment: 'index' },
        { component: ClassroomPage, name: 'ClassroomPage', segment: 'classroom' },
        { component: DecisionPage, name: 'DecisionPage', segment: 'decision' },
        { component: GroupingPage, name: 'GroupingPage', segment: 'grouping' },
        { component: RecordsPage, name: 'RecordsPage', segment: 'records' },
        { component: RecordsListPage, name: 'RecordsListPage', segment: 'recordsList' },
        { component: FindPasswordPage, name: 'FindPasswordPage', segment: 'findPassword' },
        { component: BaidutbPage, name: 'BaidutbPage', segment: 'baidutb' },
        { component: SimulationPage, name: 'SimulationPage', segment: 'simulation' },
        { component: SimulationListPage, name: 'SimulationListPage', segment: 'simulationList' },
        { component: TounaofbPage, name: 'TounaofbPage', segment: 'tounaofb' },
        { component: DanmuPage, name: 'DanmuPage', segment: 'danmu' },
        { component: GradePage, name: 'GradePage', segment: 'grade' },
        { component: WeiBoPage, name: 'WeiBoPage', segment: 'weibo' },
        { component: QQPage, name: 'QQPage', segment: 'qq' },
        { component: SceneListPage, name: 'SceneListPage', segment: 'scene-list' },
        { component: StatisticsPage, name: 'StatisticsPage', segment: 'statistics' },
        { component: DetailsPage, name: 'DetailsPage', segment: 'details' },
        { component: CommentPage, name: 'CommentPage', segment: 'comment' },
        { component: GroupIndexPage, name: 'GroupIndexPage', segment: 'group-index' }

      ]
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ConferenceApp,
    AboutPage,
    AccountPage,
    LoginPage,
    MapPage,
    PopoverPage,
    SchedulePage,
    ScheduleFilterPage,
    SessionDetailPage,
    SignupPage,
    SpeakerDetailPage,
    SpeakerListPage,
    GroupIndexPage,
    TabsPage,
    TutorialPage,
    SupportPage,
    UsersPage,
    PasswordPage,
    UpdatePage,
    LoginsPage,
    SigninPage,
    PhonePage,
    BottomPage,
    IndexPage,
    ClassroomPage,
    DecisionPage,
    GroupingPage,
    RecordsPage,
    RecordsListPage,
    BaidutbPage,
    SimulationPage,
    SimulationListPage,
    FindPasswordPage,
    TounaofbPage,
    DanmuPage,
    FindPasswordPage,
    GradePage,
    WeiBoPage,
    QQPage,
    SceneListPage,
    StatisticsPage,
    DetailsPage,
    CommentPage,
    GroupIndexPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ConferenceData,
    ProxyHttpService,
    UserData,
    InAppBrowser,
    Camera,
    Base64,
    BaidutbPage,
    BarcodeScanner,
    ImagePicker,
    SplashScreen,
    WeiBoPage,
    ServerSocket,
    QQPage,
    DecisionPage,
    BaidutbPage,
    TounaofbPage,
    DanmuPage,
    SceneListPage
  ]
})
export class AppModule { }

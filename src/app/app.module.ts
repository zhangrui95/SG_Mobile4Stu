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
import {RecordsPage} from "../pages/records/records";

import {BaidutbPage} from "../pages/baidutb/baidutb";
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
    ClassroomPage,
    DecisionPage,
    GroupingPage,
    RecordsPage,
    IndexPage,
    BaidutbPage
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
        { component: SigninPage, name: 'SigninPage', segment: 'signin' },
        { component: IndexPage, name: 'IndexPage', segment: 'index' },
        { component: ClassroomPage, name: 'ClassroomPage', segment: 'classroom' },
        { component: DecisionPage, name: 'DecisionPage', segment: 'decision' },
        { component: GroupingPage, name: 'GroupingPage', segment: 'grouping' },
        { component: RecordsPage, name: 'RecordsPage', segment: 'records' },
        { component: BaidutbPage, name: 'BaidutbPage', segment: 'baidutb' }
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
    TabsPage,
    TutorialPage,
    SupportPage,
    UsersPage,
    PasswordPage,
    UpdatePage,
    LoginsPage,
    SigninPage,
    PhonePage,
    IndexPage,
    ClassroomPage,
    DecisionPage,
    GroupingPage,
    RecordsPage,
    BaidutbPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ConferenceData,
    ProxyHttpService,
    UserData,
    InAppBrowser,
    Camera,
    ImagePicker,
    SplashScreen
  ]
})
export class AppModule { }

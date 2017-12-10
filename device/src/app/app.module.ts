import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { IonicStorageModule } from '@ionic/storage';
import { Push } from '@ionic-native/push';
import { MyApp } from './app.component';

// import { AboutPage } from '../pages/about/about';
// import { ContactPage } from '../pages/contact/contact';
// import { HomePage } from '../pages/home/home';
// import { TabsPage } from '../pages/tabs/tabs';
// import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthServiceProvider } from '../providers/index';
import { customHttpProvider } from '../helpers/index';
import { UserProvider } from '../providers/user/user';
import { NurseProvider } from '../providers/nurse/nurse';
import { ContractProvider } from '../providers/contract/contract';
import { ContractDetailProvider } from '../providers/contract-detail/contract-detail';
import { MapProvider } from '../providers/map/map';
import { GoogleMapsProvider } from '../providers/google-maps/google-maps';
import { ConnectivityProvider } from '../providers/connectivity/connectivity';
import { GoogleMapsClusterProvider } from '../providers/google-maps-cluster/google-maps-cluster';

@NgModule({
  declarations: [
    MyApp,
    // AboutPage,
    // ContactPage,
    // HomePage,
    // TabsPage
    // ListPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
    }),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    // AboutPage,
    // ContactPage,
    // HomePage,
    // TabsPage
    // ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Push,
    customHttpProvider,
    AuthServiceProvider,
    UserProvider,
    NurseProvider,
    ContractProvider,
    ContractDetailProvider,
    MapProvider,
    GoogleMapsProvider,
    ConnectivityProvider,
    GoogleMapsClusterProvider
  ]
})
export class AppModule {}

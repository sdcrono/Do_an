import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MainPage } from './main';
import { AgmCoreModule } from "@agm/core";

@NgModule({
  declarations: [
    MainPage,
  ],
  imports: [
    IonicPageModule.forChild(MainPage),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAepYGvisNRywBmOOV3d2_T-9wPBZVy9gM',
      libraries: ["places","geometry"]
      // language: 'vi',
      // region: 'VI' 
    }),
  ],
})
export class MainPageModule {}

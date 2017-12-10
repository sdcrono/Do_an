import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NurseInformationPage } from './nurse-information';
import { CalendarModule } from "ion2-calendar";
@NgModule({
  declarations: [
    NurseInformationPage,
  ],
  imports: [
    IonicPageModule.forChild(NurseInformationPage),
    CalendarModule
  ],
})
export class NurseInformationPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractDetailPage } from './contract-detail';
import { CalendarModule } from "ion2-calendar";

@NgModule({
  declarations: [
    ContractDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ContractDetailPage),
    CalendarModule
  ],
})
export class ContractDetailPageModule {}

import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

// import { AboutPage } from '../about/about';
// import { ContactPage } from '../contact/contact';
// import { HomePage } from '../home/home';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root: string = 'RequestPage';
  tab2Root: string = 'ContractPage';
  tab3Root: string = 'ContactPage';

  myIndex: number;

  constructor(navParams: NavParams) {
    this.myIndex = navParams.data.tabIndex || 0;
  }
}

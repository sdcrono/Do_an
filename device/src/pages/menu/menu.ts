import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, App, AlertController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { CAREEROPTION, TYPEOPTION, HOSPITALOPTION, MODEOPTION } from '../../helpers/index';
import { BusyDate } from '../../models/index';
import { AuthServiceProvider, UserProvider, NurseProvider } from '../../providers/index';
/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export interface PageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  icon: string;
}

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  // Basic root for our content view
  rootPage = 'MainPage';

  // Reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  pages: PageInterface[] = [
    { title: 'Main', pageName: 'MainPage', icon: 'globe' },
    { title: 'Request', pageName: 'TabsPage', tabComponent: 'Tab1Page', index: 0, icon: 'mail' },
    // { title: 'History', pageName: 'TabsPage', tabComponent: 'Tab2Page', index: 1, icon: 'list-box' },
    { title: 'Your Info', pageName: 'AboutPage', icon: 'contacts' },
    // { title: 'Special', pageName: 'TabsPage', tabComponent: 'Tab3Page', index: 2, icon: 'shuffle' },
  ];

  //date variable
  momentVariable: any;
  limitSt: Date;
  limitEn: Date;
  // testSt: Date;
  // testEn: Date;
  monSt: Date;
  monEn: Date;
  tueSt: Date;
  tueEn: Date;
  wedSt: Date;
  wedEn: Date;
  thuSt: Date;
  thuEn: Date;
  friSt: Date;
  friEn: Date;
  satSt: Date;
  satEn: Date;
  sunSt: Date;
  sunEn: Date;
  subDate: Date;
  numberBusyDateAllow: number = 0;
  workingDates: BusyDate[] = [];

  selectCareerOption: any;
  selectTypeOption: any;
  selectHospitalOption: any;
  selectMode: any;
  searchCriteriaCareer: any;
  searchCriteriaType: any;
  searchCriteriaHospital: any;
  searchMode: any;

  currentUser: any;
  currentUserInfo: any;
  isBusy: boolean = false;
  //Do su dung chung 1 ham de update status nen viec update ko thanh cong 
  //ta lai invoke ham update status lan nua (bien boolean thay doi) nen ta can 1 cai bien flag de chan
  isChangeBusy: boolean = false;

  isChanged = {
    t2: false,
    t3: false,
    t4: false,
    t5: false,
    t6: false,
    t7: false,
    cn: false
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public app: App, public alertCtrl: AlertController,
    public authService: AuthServiceProvider, public userService: UserProvider, public nurseService: NurseProvider) {
    this.authService.getCurrentUser().then((val) => {
      this.currentUser = JSON.parse(val);
      switch (this.currentUser.role) {
        case 'ROLE_User':
          this.userService.getById(this.currentUser._id).subscribe(user => {
            this.currentUserInfo = user;
          });
          break;
        case 'ROLE_Nurse':
          //remove the first page (MainPage)
          this.pages.shift();
        this.nav.setRoot('TabsPage', { tabIndex: 0 });
          this.nurseService.getById(this.currentUser._id).subscribe(nurse => {
            this.currentUserInfo = nurse;
            switch (this.currentUserInfo.nurseprofile.status) {
              case 'free':
                this.isBusy = false;
                break;
              case 'busy':
                this.isBusy = true;
                break;
            }
          });
          break;
      }
    }, err => console.log(err));
    this.selectCareerOption = CAREEROPTION;
    this.searchCriteriaCareer = this.selectCareerOption[0];

    this.selectTypeOption = TYPEOPTION;

    this.searchCriteriaType = this.selectTypeOption[0];

    this.selectHospitalOption = HOSPITALOPTION;

    this.searchCriteriaHospital = this.selectHospitalOption[0];

    this.selectMode = MODEOPTION;

    this.searchMode = this.selectMode[0];

    this.limitSt = new Date();
    this.limitSt.setHours(7);
    this.limitSt.setMinutes(30);
    this.limitSt.setSeconds(0);
    this.limitEn = new Date();
    this.limitEn.setHours(21);
    this.limitEn.setMinutes(31);
    this.limitEn.setSeconds(0);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  openPage(page: PageInterface) {
    let params = {};

    if (page.index) {
      params = { tabIndex: page.index };
    }

    if (this.nav.getActiveChildNavs()[0] && page.index !== undefined) {
      this.nav.getActiveChildNavs()[0].select(page.index)
    } else {
      this.nav.setRoot(page.pageName, params);
    }
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNavs()[0];
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected.root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.pageName) {
      return 'primary'
    }

    return;
  }

  backToWelcome() {
    const root = this.app.getRootNav();
    root.popToRoot();
  }

  logout() {
    // localStorage.clear();
    this.authService.logout();
    setTimeout(() => this.backToWelcome(), 1000);
  }

  changeStatus() {
    if (this.isChangeBusy)
      this.isChangeBusy = false;
    else {
      let status = this.isBusy ? "busy" : "free";
      let nurse = {
        id: this.currentUser._id,
        status: status
      };
      this.nurseService.setStatus(nurse).subscribe(result => {
        let id = result.text();
        console.log(id);
        // this.alertService.success('đổi thành công', false);
      }, err => {
        // this.alertService.error(err);
        console.log(err);
        this.isBusy = !this.isBusy
        this.isChangeBusy = true;
      });
    }

  }

  onChangeCareer($event: any) {
    this.events.publish('career:changed', this.searchCriteriaCareer);
  }

  onChangeType($event: any) {
    this.events.publish('type:changed', this.searchCriteriaType);
  }

  onChangeHospital($event: any) {
    this.events.publish('hospital:changed', this.searchCriteriaHospital);
  }

  onChangeMode($event: any) {
    this.events.publish('mode:changed', this.searchMode);
  }

  timeStringToFloat(time) {
    var hoursMinutes = time.split(/[.:]/);
    var hours = parseInt(hoursMinutes[0], 10);
    var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours * 60 + minutes;
  }

  setMonSt(event) {
    let check = this.monEn && this.validateTime(this.monSt, this.monEn);
    if (check === false) {
      console.log("start time > end time");
      let alert = this.alertCtrl.create({
        title: 'Warning',
        message: `start time after end time`,
        buttons: ['OK']
      });
      alert.present();
    }
    else
      this.events.publish('time:changed', { date: "monSt", value: this.timeStringToFloat(this.monSt) });
    if (this.monSt && this.monEn) {
      this.isChanged['t2'] = true;
    }
  }

  setMonEn(event) {
    let check = this.monSt && this.validateTime(this.monSt, this.monEn);
    if (check === false) {
      console.log("start time > end time");
      let alert = this.alertCtrl.create({
        title: 'Warning',
        message: `start time after end time`,
        buttons: ['OK']
      });
      alert.present();
    }
    else
      this.events.publish('time:changed', { date: "monEn", value: this.timeStringToFloat(this.monEn) });
      if (this.monSt && this.monEn) {
        this.isChanged['t2'] = true;
      }
  }

  setTueSt(event) {
    let check = this.tueEn && this.validateTime(this.tueSt, this.tueEn);
    if (check === false) {
      console.log("start time > end time");
      let alert = this.alertCtrl.create({
        title: 'Warning',
        message: `start time after end time`,
        buttons: ['OK']
      });
      alert.present();
    }
    else
      this.events.publish('time:changed', { date: "tueSt", value: this.timeStringToFloat(this.tueSt) });
      if (this.tueSt && this.tueEn) {
        this.isChanged['t3'] = true;
      }
  }

  setTueEn(event) {
    let check = this.tueSt && this.validateTime(this.tueSt, this.tueEn);
    if (check === false) {
      console.log("start time > end time");
      let alert = this.alertCtrl.create({
        title: 'Warning',
        message: `start time after end time`,
        buttons: ['OK']
      });
      alert.present();
    }
    else
      this.events.publish('time:changed', { date: "tueEn", value: this.timeStringToFloat(this.tueEn) });
      if (this.tueSt && this.tueEn) {
        this.isChanged['t3'] = true;
      }
  }

  setWedSt(event) {
    let check = this.wedEn && this.validateTime(this.wedSt, this.wedEn);
    if (check === false) {
      console.log("start time > end time");
      let alert = this.alertCtrl.create({
        title: 'Warning',
        message: `start time after end time`,
        buttons: ['OK']
      });
      alert.present();
    }
    else
      this.events.publish('time:changed', { date: "wedSt", value: this.timeStringToFloat(this.wedSt) });
      if (this.wedSt && this.wedEn) {
        this.isChanged['t4'] = true;
      }
  }

  setWedEn(event) {
    let check = this.wedSt && this.validateTime(this.wedSt, this.wedEn);
    if (check === false) {
      console.log("start time > end time");
      let alert = this.alertCtrl.create({
        title: 'Warning',
        message: `start time after end time`,
        buttons: ['OK']
      });
      alert.present();
    }
    else
      this.events.publish('time:changed', { date: "wedEn", value: this.timeStringToFloat(this.wedEn) });
      if (this.wedSt && this.wedEn) {
        this.isChanged['t4'] = true;
      }
  }

  setThuSt(event) {
    let check = this.thuEn && this.validateTime(this.thuSt, this.thuEn);
    if (check === false) {
      console.log("start time > end time");
      let alert = this.alertCtrl.create({
        title: 'Warning',
        message: `start time after end time`,
        buttons: ['OK']
      });
      alert.present();
    }
    else
      this.events.publish('time:changed', { date: "thuSt", value: this.timeStringToFloat(this.thuSt) });
      if (this.thuSt && this.thuEn) {
        this.isChanged['t5'] = true;
      }
  }

  setThuEn(event) {
    let check = this.thuSt && this.validateTime(this.thuSt, this.thuEn);
    if (check === false) {
      console.log("start time > end time");
      let alert = this.alertCtrl.create({
        title: 'Warning',
        message: `start time after end time`,
        buttons: ['OK']
      });
      alert.present();
    }
    else
      this.events.publish('time:changed', { date: "thuEn", value: this.timeStringToFloat(this.thuEn) });
      if (this.thuSt && this.thuEn) {
        this.isChanged['t5'] = true;
      }
  }

  setFriSt(event) {
    let check = this.friEn && this.validateTime(this.friSt, this.friEn);
    if (check === false) {
      console.log("start time > end time");
      let alert = this.alertCtrl.create({
        title: 'Warning',
        message: `start time after end time`,
        buttons: ['OK']
      });
      alert.present();
    }
    else
      this.events.publish('time:changed', { date: "friSt", value: this.timeStringToFloat(this.friSt) });
      if (this.friSt && this.friEn) {
        this.isChanged['t6'] = true;
      }
  }

  setFriEn(event) {
    let check = this.friSt && this.validateTime(this.friSt, this.friEn);
    if (check === false) {
      console.log("start time > end time");
      let alert = this.alertCtrl.create({
        title: 'Warning',
        message: `start time after end time`,
        buttons: ['OK']
      });
      alert.present();
    }
    else
      this.events.publish('time:changed', { date: "friEn", value: this.timeStringToFloat(this.friEn) });
      if (this.friSt && this.friEn) {
        this.isChanged['t6'] = true;
      }
  }
  setSatSt(event) {
    let check = this.satEn && this.validateTime(this.satSt, this.satEn);
    if (check === false) {
      console.log("start time > end time");
      let alert = this.alertCtrl.create({
        title: 'Warning',
        message: `start time after end time`,
        buttons: ['OK']
      });
      alert.present();
    }
    else
      this.events.publish('time:changed', { date: "satSt", value: this.timeStringToFloat(this.satSt) });
      if (this.satSt && this.satEn) {
        this.isChanged['t7'] = true;
      }
  }

  setSatEn(event) {
    let check = this.satSt && this.validateTime(this.satSt, this.satEn);
    if (check === false) {
      console.log("start time > end time");
      let alert = this.alertCtrl.create({
        title: 'Warning',
        message: `start time after end time`,
        buttons: ['OK']
      });
      alert.present();
    }
    else
      this.events.publish('time:changed', { date: "satEn", value: this.timeStringToFloat(this.satEn) });
      if (this.satSt && this.satEn) {
        this.isChanged['t7'] = true;
      }
  }
  setSunSt(event) {
    let check = this.sunEn && this.validateTime(this.sunSt, this.sunEn);
    if (check === false) {
      console.log("start time > end time");
      let alert = this.alertCtrl.create({
        title: 'Warning',
        message: `start time after end time`,
        buttons: ['OK']
      });
      alert.present();
    }
    else
      this.events.publish('time:changed', { date: "sunSt", value: this.timeStringToFloat(this.sunSt) });
      if (this.sunSt && this.sunEn) {
        this.isChanged['cn'] = true;
      }
  }

  setSunEn(event) {
    let check = this.sunSt && this.validateTime(this.sunSt, this.sunEn);
    if (check === false) {
      console.log("start time > end time");
      let alert = this.alertCtrl.create({
        title: 'Warning',
        message: `start time after end time`,
        buttons: ['OK']
      });
      alert.present();
    }
    else
      this.events.publish('time:changed', { date: "sunEn", value: this.timeStringToFloat(this.sunEn) });
      if (this.sunSt && this.sunEn) {
        this.isChanged['cn'] = true;
      }
  }

  validateTime(st, end) {
    console.log(st + end)
    return st > end ? false : true;
  }

  resetTime(thu: string) {
    switch (thu) {
      case "T2":
        this.monSt = undefined;
        this.monEn = undefined;
        this.events.publish('time:reset', { date: "monSt", value: this.monSt });
        this.events.publish('time:reset', { date: "monEn", value: this.monEn });
        if (this.monSt && this.monEn) {
          this.isChanged['t2'] = false;
        }
        break;
      case "T3":
        this.tueSt = undefined;
        this.tueEn = undefined;
        this.events.publish('time:reset', { date: "tueSt", value: this.tueSt });
        this.events.publish('time:reset', { date: "tueEn", value: this.tueEn });
        if (this.tueSt && this.tueEn) {
          this.isChanged['t3'] = false;
        }
        break;
      case "T4":
        this.wedSt = undefined;
        this.wedEn = undefined;
        this.events.publish('time:reset', { date: "wedSt", value: this.wedSt });
        this.events.publish('time:reset', { date: "wedEn", value: this.wedEn });
        if (this.wedSt && this.wedEn) {
          this.isChanged['t4'] = false;
        }
        break;
      case "T5":
        this.thuSt = undefined;
        this.thuEn = undefined;
        this.events.publish('time:reset', { date: "thuSt", value: this.thuSt });
        this.events.publish('time:reset', { date: "thuEn", value: this.thuEn });
        if (this.thuSt && this.thuEn) {
          this.isChanged['t5'] = false;
        }
        break;
      case "T6":
        this.friSt = undefined;
        this.friEn = undefined;
        this.events.publish('time:reset', { date: "friSt", value: this.friSt });
        this.events.publish('time:reset', { date: "friEn", value: this.friEn });
        if (this.friSt && this.friEn) {
          this.isChanged['t6'] = false;
        }
        break;
      case "T7":
        this.satSt = undefined;
        this.satEn = undefined;
        this.events.publish('time:reset', { date: "satSt", value: this.satSt });
        this.events.publish('time:reset', { date: "satEn", value: this.satEn });
        if (this.satSt && this.satEn) {
          this.isChanged['t7'] = false;
        }
        break;
      case "CN":
        this.sunSt = undefined;
        this.sunEn = undefined;
        this.events.publish('time:reset', { date: "sunSt", value: this.sunSt });
        this.events.publish('time:reset', { date: "sunEn", value: this.sunEn });
        if (this.sunSt && this.sunEn) {
          this.isChanged['cn'] = false;
        }
        break;
    }
  }

}

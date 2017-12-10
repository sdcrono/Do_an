import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthServiceProvider, ContractProvider } from '../../providers/index';
import { CalendarComponentOptions } from 'ion2-calendar'

/**
 * Generated class for the ContractDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contract-detail',
  templateUrl: 'contract-detail.html',
})
export class ContractDetailPage {

  contract: any;
  typeView: any = 'contract';
  currentUser: any;
  numberOfDayWork: number = 0;
  numberOfDayOff: number = 0;
  numberOfDayW8: number = 0;
  currentReceive: number = 0;
  totalReceive: number = 0;
  weekdays: number[] = [];
  dateMulti: any[];
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  optionsMulti: CalendarComponentOptions = {
    disableWeeks: [0, 1, 2, 3, 4, 5, 6],
    from: new Date(1),
    pickMode: 'multi'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private authService: AuthServiceProvider, private contractService: ContractProvider) {
    this.contract = this.navParams.get("contract");
    this.typeView = this.navParams.get("type");

    this.authService.getCurrentUser().then((val) => {
      this.currentUser = JSON.parse(val);
    }, err => console.log(err));
    this.getData();
  }

  getData() {
    this.contractService.getById(this.contract._id).subscribe(contract => {
      this.contract = contract;
      let start = new Date(this.contract.start_at)
      start.setDate(start.getDate() + 1)
      this.contract.start_at = start.toISOString();
      let end = new Date(this.contract.end_at)
      end.setDate(end.getDate() + 1)
      this.contract.end_at = end.toISOString();
      this.contract.detail.dates.forEach(date => {
        switch (date.date) {
          case 'T2':
            this.weekdays.push(1);
            break;
          case 'T3':
            this.weekdays.push(2);
            break;
          case 'T4':
            this.weekdays.push(3);
            break;
          case 'T5':
            this.weekdays.push(4);
            break;
          case 'T6':
            this.weekdays.push(5);
            break;
          case 'T7':
            this.weekdays.push(6);
            break;
          case 'CN':
            this.weekdays.push(0);
            break;
        }
      })
      this.numberOfDayW8 = this.contract.workingDates.filter(date => {
        if (date.process === 0)
          return date
      }).length;
      this.numberOfDayWork = this.contract.workingDates.filter(date => {
        if (date.process === 1)
          return date
      }).length;
      this.numberOfDayOff = this.contract.workingDates.filter(date => {
        if (date.process === -1)
          return date
      }).length;
      this.currentReceive = 0;
      this.totalReceive = 0;
      this.contract.workingDates.forEach(date => {
        if (date.process == 1)
          this.currentReceive += date.fee;
        this.totalReceive += date.fee;
      })
      let startDate = new Date(this.contract.created_at);
      let endDate = new Date(this.contract.end_at);
      this.dateMulti = this.filterWeekDays(this.getDates(startDate, endDate), this.weekdays);
    })
  }

  filterWeekDays(dates, includeDays) {
    let weekDays = [];

    dates.forEach(day => {
      includeDays.forEach(include => {
        if (day.getDay() == include) {
          weekDays.push(day);
        }
      });
    });
    return weekDays;
  }

  getDates(dateStart, dateEnd) {
    let currentDate = dateStart, dates = [];

    while (currentDate <= dateEnd) {
      dates.push(currentDate);
      let d = new Date(currentDate.valueOf());
      d.setDate(d.getDate() + 1);
      currentDate = d;
    }

    return dates;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContractDetailPage');
  }

  getTwoDigitFormat(num) {
    return ("0" + num).slice(-2)
  }

  showSchedule() {
    let dates = ``;
    this.contract.detail.dates.forEach(date => {
      dates += `<li> ${date.date} | from ${this.getTwoDigitFormat(new Date(date.start_time).getHours())}:
      ${this.getTwoDigitFormat(new Date(date.start_time).getMinutes())} - to ${this.getTwoDigitFormat(new Date(date.end_time).getHours())}:
      ${this.getTwoDigitFormat(new Date(date.end_time).getMinutes())}.</li>`
    })
    let alert = this.alertCtrl.create({
      title: 'Schedule',
      // subTitle: dates,
      message: `
      <p> The working time table:</p>
      <ul>
        ${dates}
      </ul>
      `,
      buttons: ['OK']
    });
    alert.present();
  }

  showPatient() {
    let alert = this.alertCtrl.create({
      title: `${this.contract.patientName} - ${this.contract.patientAge} tuổi`,
      subTitle: `Address: ${this.contract.address}`,
      message: `Request: ${this.contract.detail.jobDescription}`,
      buttons: ['OK']
    });
    alert.present();
  }

  showRegistator() {
    let alert = this.alertCtrl.create({
      title: `${this.contract.userId.profile.name} - ${this.contract.userId.profile.age} tuổi`,
      subTitle: `Email: ${this.contract.userId.profile.email} - Phone: ${this.contract.userId.profile.phone}`,
      message: `Address: ${this.contract.userId.profile.address}`,
      buttons: ['OK']
    });
    alert.present();
  }
  showNurse() {
    let alert = this.alertCtrl.create({
      title: `${this.contract.nurseId.profile.name} - ${this.contract.nurseId.profile.sex}`,
      subTitle: `Email: ${this.contract.nurseId.profile.email} - Phone: ${this.contract.nurseId.profile.phone}`,
      message: `Address: ${this.contract.nurseId.profile.address}`,
      buttons: ['OK']
    });
    alert.present();
  }

  validateDate(workingDate: any) {
    let date = new Date();
    if (workingDate.date > date) {
      let alert = this.alertCtrl.create({
        title: `Not this time`,
        // subTitle: `Email: ${this.contract.nurseId.profile.email} - Phone: ${this.contract.nurseId.profile.phone}`,
        message: `This working date is after today!`,
        buttons: ['OK']
      });
      alert.present();
      return false;
    }
    return true;
  }

  done(workingDate) {
    if (this.validateDate(workingDate)) {
      this.contractService.done(this.contract._id, this.contract.nurseId._id, workingDate).subscribe(result => {
        console.log(result);
        let alert = this.alertCtrl.create({
          title: `Finish`,
          // subTitle: `Email: ${this.contract.nurseId.profile.email} - Phone: ${this.contract.nurseId.profile.phone}`,
          message: `Good job, you done well!`,
          buttons: ['OK']
        });
        alert.present();
        this.getData();
      }, err => {
        console.log(err);
        let alert = this.alertCtrl.create({
          title: `Ops`,
          // subTitle: `Email: ${this.contract.nurseId.profile.email} - Phone: ${this.contract.nurseId.profile.phone}`,
          message: `There have some problem at the moment!`,
          buttons: ['OK']
        });
      });
    }
  }

  off(workingDate) {
    if (this.validateDate(workingDate)) {
      this.contractService.off(this.contract._id, this.contract.nurseId._id, workingDate).subscribe(result => {
        console.log(result);
        let alert = this.alertCtrl.create({
          title: `Take a rest`,
          // subTitle: `Email: ${this.contract.nurseId.profile.email} - Phone: ${this.contract.nurseId.profile.phone}`,
          message: `You have gotten a day off, just rest sometime!`,
          buttons: ['OK']
        });
        alert.present();
        this.getData();
      }, err => {
        console.log(err);
        let alert = this.alertCtrl.create({
          title: `Ops`,
          // subTitle: `Email: ${this.contract.nurseId.profile.email} - Phone: ${this.contract.nurseId.profile.phone}`,
          message: `There have some problem at the moment!`,
          buttons: ['OK']
        });
        alert.present();
      });
    }
  }

}

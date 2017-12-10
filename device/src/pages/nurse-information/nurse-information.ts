import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';

import { ContractProvider, NurseProvider, UserProvider } from '../../providers/index';
import { NurseProfile, Location, BusyDate, Contract, ContractDetail } from '../../models/index';
import { CalendarComponentOptions, CalendarModal, CalendarModalOptions } from 'ion2-calendar';
/**
 * Generated class for the NurseInformationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nurse-information',
  templateUrl: 'nurse-information.html',
})
export class NurseInformationPage {

  avatar: string;
  displayName: string;
  private money: any;
  coreMoney: number;
  payments: number[];
  totalPayment: number;
  private nurse: NurseProfile;
  private choosingDates: any;
  workingDates: BusyDate[] = [];
  weekdays: number[] = [];
  private location: Location;
  contract: Contract;
  contractDetail: ContractDetail;
  patientName: string;
  patientAge: number;
  patientDescription: string;
  currentUser: any;
  currentUserInfo: any;
  address: string;
  district: string;

  dateRange: { from: any; to: any; };
  type: 'moment'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  optionsRange: CalendarComponentOptions = {
    pickMode: 'range'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private alertCtrl: AlertController, public contractProvider: ContractProvider,
  public userService: UserProvider, public nurseService: NurseProvider) {
    this.money = this.navParams.get("money");
    this.nurse = this.navParams.get("nurse");
    this.choosingDates = this.navParams.get("workingDates");
    this.location = this.navParams.get("location");
    this.address = this.navParams.get("address");
    this.district = this.navParams.get("district");
    this.coreMoney = this.navParams.get("coreMoney");

    console.log(this.nurse);
    if (this.nurse.owner.profile.sex == 'Nữ') {
      this.avatar = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/91525/AmeliaBR-bw.jpg';
    }
    else this.avatar = 'https://pbs.twimg.com/profile_images/889736688624312321/xVAFH9ZH_400x400.jpg';
  }

  ionViewDidLoad() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    switch (this.currentUser.role) {
      case 'ROLE_User':
        this.userService.getById(this.currentUser._id).subscribe(user => {
          this.currentUserInfo = user;
        });
        break;
      case 'ROLE_Nurse':
        this.nurseService.getById(this.currentUser._id).subscribe(nurse => {
          this.currentUserInfo = nurse;
        });
        break;
    }
    console.log('ionViewDidLoad NurseInformationPage');
  }

  ionViewWillEnter() {
  }

  openCalendar() {
    const options: CalendarModalOptions = {
      pickMode: 'range',
      title: 'RANGE'
    };

    let myCalendar = this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss(date => {
      console.log(date);
    });
  }

  changeRange(event) {
    console.log(this.dateRange);
    console.log(event);
  }

  checkEmptySchedule() {
    let countSchedule = 0;
    if (this.choosingDates.monSt == undefined || this.choosingDates.monEn == undefined)
      countSchedule++;
    if (this.choosingDates.tueSt == undefined || this.choosingDates.tueEn == undefined)
      countSchedule++;
    if (this.choosingDates.wedSt == undefined || this.choosingDates.wedEn == undefined)
      countSchedule++;
    if (this.choosingDates.thuSt == undefined || this.choosingDates.thuEn == undefined)
      countSchedule++;
    if (this.choosingDates.friSt == undefined || this.choosingDates.friEn == undefined)
      countSchedule++;
    if (this.choosingDates.satSt == undefined || this.choosingDates.satEn == undefined)
      countSchedule++;
    if (this.choosingDates.sunSt == undefined || this.choosingDates.sunEn == undefined)
      countSchedule++;
    if (countSchedule == 7)
      return true;
    else return false
  }

  makeContract() {
    if (this.dateRange === undefined) {
      let alert = this.alertCtrl.create({
        title: 'Check again',
        subTitle: 'Please choose the working time range!',
        buttons: ['Okay']
      });
      alert.present();
      // console.log('Cần chọn khoảng thời gian làm việc!');
      return;
    }
    else if (this.patientName === "" || this.patientName === undefined) {
      let alert = this.alertCtrl.create({
        title: 'Check again',
        subTitle: 'Please enter a name of the patient!',
        buttons: ['Okay']
      });
      alert.present();
      // console.log('Cần điền tên người bệnh!');
      return;
    }
    else if (+this.patientAge <= 8 || +this.patientAge >= 70 || this.patientAge === undefined) {
      let alert = this.alertCtrl.create({
        title: 'Check again',
        subTitle: 'Please enter an age of the patient (8~70 years old)!',
        buttons: ['Okay']
      });
      alert.present();
      // console.log('Cần điền tuổi người bệnh (Từ 8 đến 70 tuổi)!');
      return;
    }
    else {
      let date = new Date(Date.now());
      let startDate = this.dateRange.from._d;
      let endDate = this.dateRange.to._d;
      if (this.checkEmptySchedule()) {
        let alert = this.alertCtrl.create({
          title: 'Check again',
          subTitle: 'Please choose your schedule (the filter menu on the right in the previous screen)!',
          buttons: ['Okay']
        });
        alert.present();        
        // console.log('Cần chọn lịch làm việc!');
        return;
      }
      else if (startDate <= date) {
        console.log("<=" + startDate + "," + endDate + "," + date);
        let alert = this.alertCtrl.create({
          title: 'Check again',
          subTitle: 'Please choose the start day after today!',
          buttons: ['Okay']
        });
        alert.present();
        // console.log('Ngày bắt đầu trước hôm nay!', false);
        return;
      }

      else {
        startDate.setDate(startDate.getDate());
        endDate.setDate(endDate.getDate());
        console.log(">" + startDate + "," + endDate + "," + date + "," + this.nurse.owner._id);
        this.addBusyDates();
        this.filterWeekDays(this.getDates(startDate, endDate), this.weekdays);
        this.contractDetail = { dates: this.workingDates, jobDescription: this.patientDescription };
        if (!this.address)
          this.address = this.currentUserInfo.profile.address;
        this.contract = {
          userId: this.currentUser._id,
          nurseId: this.nurse.owner._id,
          createdAt: new Date(),
          startAt: startDate,
          endAt: endDate,
          patientName: this.patientName,
          patientAge: this.patientAge.toString(),
          address: this.address,
          district: this.district,
          location: this.location,
          payment: this.money,
          corePayment: this.coreMoney,
          totalPayment: this.totalPayment,
          paymentEachDays: this.payments,
          detail: this.contractDetail
        };
        console.log(this.contract);
        this.contractProvider.create(this.contract).subscribe(
          data => {
            // this.alertService.success('Make a contract successful', true);
            let id = data.text();
            id = id.substring(1);
            id = id.substring(0, id.length - 1);
            console.log(id);

          let alert = this.alertCtrl.create({
            title: 'Success',
            subTitle: 'You have created a new contract!',
            buttons: ['Okay']
          });
          alert.present();    
          // this.patientName = "";
          // this.patientAge = 0;
          // this.patientDescription = "";
          },
          error => {
            console.log(error);
            let alert = this.alertCtrl.create({
              title: 'Something is wrong',
              subTitle: 'There are something that does not working correctly',
              buttons: ['Okay']
            });
            alert.present();  
            // this.loading = false;
          });
      }
    }

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

  getHourRange(st, en) {
    return ((en - st) / 1000) / 3600;
  }
  getHour(num) {
    return Math.floor(num / 60);
  }
  getMinute(num) {
    return (num / 60 - Math.floor(num / 60)) * 60;
  }

  addBusyDates() {
    this.workingDates = [];
    this.weekdays = [];
    this.payments = [];
    this.totalPayment = 0;
    let start = new Date();
    let end = new Date();

    if (this.choosingDates.sunSt !== undefined && this.choosingDates.sunEn !== undefined) {
      start.setHours(this.getHour(this.choosingDates.sunSt));
      start.setMinutes(this.getMinute(this.choosingDates.sunSt));
      end.setHours(this.getHour(this.choosingDates.sunEn));
      end.setMinutes(this.getMinute(this.choosingDates.sunEn));
      // let workingDate = Object.assign({ date: "CN", start_time: start, end_time: end });
      this.workingDates.push({ date: "CN", start_time: start, end_time: end });
      let fee = this.getHourRange(start, end) === 0 ? this.coreMoney : Math.floor(this.getHourRange(start, end)) * this.coreMoney;
      this.payments.push(fee);
      this.totalPayment += fee;
      this.weekdays.push(0);
    }

    if (this.choosingDates.monSt !== undefined && this.choosingDates.monEn !== undefined) {
      start.setHours(this.getHour(this.choosingDates.monSt));
      start.setMinutes(this.getMinute(this.choosingDates.monSt));
      end.setHours(this.getHour(this.choosingDates.monEn));
      end.setMinutes(this.getMinute(this.choosingDates.monEn));
      // let workingDate = Object.assign({ date: "T2", start, end });
      this.workingDates.push({ date: "T2", start_time: start, end_time: end });
      let fee = this.getHourRange(start, end) === 0 ? this.coreMoney : Math.floor(this.getHourRange(start, end)) * this.coreMoney;
      this.payments.push(fee);
      this.totalPayment += fee;
      this.weekdays.push(1);
    }

    if (this.choosingDates.tueSt !== undefined && this.choosingDates.tueEn !== undefined) {
      start.setHours(this.getHour(this.choosingDates.tueSt));
      start.setMinutes(this.getMinute(this.choosingDates.tueSt));
      end.setHours(this.getHour(this.choosingDates.tueEn));
      end.setMinutes(this.getMinute(this.choosingDates.tueEn));
      // let workingDate = Object.assign({ date: "T3", start_time: start, end_time: end });
      this.workingDates.push({ date: "T3", start_time: start, end_time: end });
      let fee = this.getHourRange(start, end) === 0 ? this.coreMoney : Math.floor(this.getHourRange(start, end)) * this.coreMoney;
      this.payments.push(fee);
      this.totalPayment += fee;
      this.weekdays.push(2);
    }

    if (this.choosingDates.wedSt !== undefined && this.choosingDates.wedEn !== undefined) {
      start.setHours(this.getHour(this.choosingDates.wedSt));
      start.setMinutes(this.getMinute(this.choosingDates.wedSt));
      end.setHours(this.getHour(this.choosingDates.wedEn));
      end.setMinutes(this.getMinute(this.choosingDates.wedEn));
      // let workingDate = Object.assign({ date: "T4", start_time: start, end_time: end });
      this.workingDates.push({ date: "T4", start_time: start, end_time: end });
      let fee = this.getHourRange(start, end) === 0 ? this.coreMoney : Math.floor(this.getHourRange(start, end)) * this.coreMoney;
      this.payments.push(fee);
      this.totalPayment += fee;
      this.weekdays.push(3);
    }

    if (this.choosingDates.thuSt !== undefined && this.choosingDates.thuEn !== undefined) {
      start.setHours(this.getHour(this.choosingDates.thuSt));
      start.setMinutes(this.getMinute(this.choosingDates.thuSt));
      end.setHours(this.getHour(this.choosingDates.thuEn));
      end.setMinutes(this.getMinute(this.choosingDates.thuEn));
      // let workingDate = Object.assign({ date: "T5", start_time: start, end_time: end });
      this.workingDates.push({ date: "T5", start_time: start, end_time: end });
      let fee = this.getHourRange(start, end) === 0 ? this.coreMoney : Math.floor(this.getHourRange(start, end)) * this.coreMoney;
      this.payments.push(fee);
      this.totalPayment += fee;
      this.weekdays.push(4);
    }

    if (this.choosingDates.friSt !== undefined && this.choosingDates.friEn !== undefined) {
      start.setHours(this.getHour(this.choosingDates.friSt));
      start.setMinutes(this.getMinute(this.choosingDates.friSt));
      end.setHours(this.getHour(this.choosingDates.friEn));
      end.setMinutes(this.getMinute(this.choosingDates.friEn));
      // let workingDate = Object.assign({ date: "T6", start_time: start, end_time: end });
      this.workingDates.push({ date: "T6", start_time: start, end_time: end });
      let fee = this.getHourRange(start, end) === 0 ? this.coreMoney : Math.floor(this.getHourRange(start, end)) * this.coreMoney;
      this.payments.push(fee);
      this.totalPayment += fee;
      this.weekdays.push(5);
    }

    if (this.choosingDates.satSt !== undefined && this.choosingDates.satEn !== undefined) {
      start.setHours(this.getHour(this.choosingDates.satSt));
      start.setMinutes(this.getMinute(this.choosingDates.satSt));
      end.setHours(this.getHour(this.choosingDates.satEn));
      end.setMinutes(this.getMinute(this.choosingDates.satEn));
      // let workingDate = Object.assign({ date: "T7", start_time: start, end_time: end });
      this.workingDates.push({ date: "T7", start_time: start, end_time: end });
      let fee = this.getHourRange(start, end) === 0 ? this.coreMoney : Math.floor(this.getHourRange(start, end)) * this.coreMoney;
      this.payments.push(fee);
      this.totalPayment += fee;
      this.weekdays.push(6);
    }

  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nurse } from '../../models/index';
import { STATUSOPTION } from '../../helpers/index';
import { AuthServiceProvider, ContractProvider, NurseProvider } from '../../providers/index';

/**
 * Generated class for the SchedulePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {

  contracts: any;
  currentUser: any;
  nurse: Nurse;
  private statusSelect: any;
  private statusOption: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthServiceProvider, private contractsService: ContractProvider, private nurseService: NurseProvider) {
    this.statusOption = STATUSOPTION;
    this.statusSelect = this.statusOption[0];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchedulePage');
    this.loadUserDetails();
  }


  loadUserDetails() {
    // this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.authService.getCurrentUser().then((val) => {
      this.currentUser =  JSON.parse(val);
      this.nurseService.getById(this.currentUser._id).subscribe(nurse => {
        this.nurse = nurse;
        this.getContractList();
        console.log(this.nurse);
      });
    });
  }

  getContractList() {
    this.contractsService.getAll(this.statusSelect.value, this.currentUser.role, this.currentUser._id).subscribe(contracts => {
      this.contracts = contracts;
    });
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { STATUSOPTION } from '../../helpers/index';
import { AuthServiceProvider, ContractProvider, NurseProvider } from '../../providers/index';
import { BusyDate } from '../../models/index';
/**
 * Generated class for the RequestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-request',
  templateUrl: 'request.html',
})
export class RequestPage {

  contracts: any;
  currentUser: any;
  private statusSelect: any;
  private statusOption: any;
  busyDates: BusyDate[] = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthServiceProvider, private alertCtrl: AlertController, 
    private contractsService: ContractProvider, private nursesService: NurseProvider) {
    this.statusOption = STATUSOPTION;
    this.statusSelect = this.statusOption[0];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContractPage');
    // this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.authService.getCurrentUser().then((val) => {
      this.currentUser = JSON.parse(val);
      this.getContractList();
    }, err => console.log(err));
  }

  getContractList() {
    this.contractsService.getAll(this.statusSelect.value, this.currentUser.role, this.currentUser._id).subscribe(contracts => {
      this.contracts = contracts.filter(contract => {
        if (contract.status === 'check')
          return contract;
      });
    });
  }

  getDetail(contractDetail) {
    this.navCtrl.push('ContractDetailPage', { contract: contractDetail, type: 'request' });
  }

  approve(id: any, nurseId: any) {
    let req = {
      id: id,
      nurseId: nurseId
    };
    console.log(id);
    this.contractsService.approve(req).subscribe(result => {
        console.log(result);
        this.contractsService.getById(id).subscribe(contract => {
          this.busyDates = contract.detail.dates;

          this.nursesService.getById(contract.nurseId._id).subscribe(nurse => {
            console.log(nurse);
            nurse.nurseprofile.busy_dates.forEach(workingDate => {
              this.busyDates.push(workingDate);
            });
            let req = {
              id: nurse._id,
              busyDates: this.busyDates,
            };            
            this.nursesService.updateBusyDate(req).subscribe(result => {
              let alert = this.alertCtrl.create({
                title: 'Approve',
                subTitle: 'Success!',
                buttons: ['Okay']
              });
              alert.present();
              this.getContractList();
            }, err => {
              let alert = this.alertCtrl.create({
                title: 'Approve',
                subTitle: `Fail! Cause: ${err}`,
                buttons: ['Okay']
              });
              alert.present();
              this.getContractList();
            });                        
          }, err => {
            // console.log(err);
            let alert = this.alertCtrl.create({
              title: 'Approve',
              subTitle: `Fail! Cause: ${err}`,
              buttons: ['Okay']
            });
            alert.present();
            this.getContractList();
          });       
      });
    }, err => {
      let alert = this.alertCtrl.create({
        title: 'Approve',
        subTitle: `Fail! Cause: ${err}`,
        buttons: ['Okay']
      });
      alert.present();
      this.getContractList();
    });
  }

  decline(id: any) {
    let req = {
      id: id
    };
    console.log(id);
    this.contractsService.reject(req).subscribe(result => {
        console.log(result);
        let alert = this.alertCtrl.create({
          title: 'Reject',
          subTitle: `Finish!`,
          buttons: ['Okay']
        });
        alert.present();
        this.getContractList();
    }, err => {
      let alert = this.alertCtrl.create({
        title: 'Reject',
        subTitle: `Fail! Cause: ${err}`,
        buttons: ['Okay']
      });
      alert.present();
      this.getContractList();
    });
  }

}

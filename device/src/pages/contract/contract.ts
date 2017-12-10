import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { STATUSOPTION } from '../../helpers/index';
import { AuthServiceProvider, ContractProvider } from '../../providers/index';
/**
 * Generated class for the ContractPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contract',
  templateUrl: 'contract.html',
})
export class ContractPage {

  contracts: any;
  currentUser: any;
  private statusSelect: any;
  private statusOption: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthServiceProvider, private contractsService: ContractProvider) {
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
      this.contracts = contracts;
    });
  }

  getDetail(contractDetail) {
    this.navCtrl.push('ContractDetailPage', { contract: contractDetail, type: 'contract' });
  }

}

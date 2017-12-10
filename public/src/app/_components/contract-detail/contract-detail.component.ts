import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, ContractsService } from '../../_services/index';
import { User } from '../../_models/index';
@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.css']
})
export class ContractDetailComponent implements OnInit {

  contract = {};
  contractInfo = {
    contractId: '',
    nurseId: '',
  };
  idCurrentUsingForManageWho: any;
  currentUsingForManageWho: string = "none";
  currentUser: User;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private contractService: ContractsService
  ) { }

  ngOnInit() {
    this.getContractDetail(this.route.snapshot.params['id']);
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  getContractDetail(id) {
    this.checkWhichUrl();
    this.contractService.getById(id).subscribe(contract => {
      this.contract = contract;
      console.log("Contract edit ", contract);
      this.contractInfo.contractId = contract._id;
      this.contractInfo.nurseId = contract.nurseId._id;
      this.loading = false;
    });
  }

  checkWhichUrl() {
    let url = this.router.url;
    if (url.indexOf("nurses") === 1) {
      this.idCurrentUsingForManageWho = this.route.snapshot.params['nurse_id']
      this.currentUsingForManageWho = "nurses"
    }
    else if (url.indexOf("users") === 1) {
      this.idCurrentUsingForManageWho = this.route.snapshot.params['user_id']
      this.currentUsingForManageWho = "users"
    }
  }

  done(workingDate) {
    this.loading = true;
    if (this.validateDate(workingDate)) {
      this.contractService.done(this.contractInfo.contractId, this.contractInfo.nurseId, workingDate).subscribe(result => {
        console.log(result);
        this.alertService.success('Đã hoàn thành', false);
        this.getContractDetail(this.route.snapshot.params['id'])
      }, err => {
        console.log(err);
        this.alertService.error(err, false);
        this.loading = false;
        // this.getContractDetail();
      });
    }
  }

  off(workingDate) {
    this.loading = true;
    if (this.validateDate(workingDate)) {
      this.contractService.off(this.contractInfo.contractId, this.contractInfo.nurseId, workingDate).subscribe(result => {
        console.log(result);
        this.alertService.success('Đã đánh vắng', false);
        this.getContractDetail(this.route.snapshot.params['id'])
      }, err => {
        console.log(err);
        this.alertService.error(err, false);
        this.loading = false;
        // this.getContractDetail();
      });
    }
  }

  validateDate(workingDate: any) {
    let date = new Date();
    if (workingDate.date > date) {
      this.alertService.error('Chưa tới lịch để thanh toán!');
      return false;
    }
    return true;
  }
}

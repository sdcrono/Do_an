import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, ContractsService, NursesService } from '../../_services/index';
import { User } from '../../_models/index';
import { BusyDate } from '../../_interfaces/index';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {

  contracts: any;
  currentUser: User;
  private statusSelect: any;
  private statusOption: any;
  busyDates: BusyDate[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private nursesService: NursesService,    
    private contractsService: ContractsService
  ) { 
    this.statusOption = [
      {
        id: 1,
        label: "-Chọn trạng thái-",
        value: ""
      }, {
        id: 2,
        label: "Toàn bộ",
        value: "all"
      }, {
        id: 3,
        label: "Đang chờ kiểm tra",
        value: "check"
      }, {
        id: 4,
        label: "Đã xác nhận",
        value: "approve"
      }, {
        id: 5,
        label: "Đã hủy bỏ",
        value: "reject"
      }, {
        id: 6,
        label: "Đã hoàn thành",
        value: "finish"
      }
    ];
    this.statusSelect = this.statusOption[0];    
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getContractList();
  }

  onChangeStatus($event: any) {
    this.getContractList();
  }

  getContractList() {
    this.contractsService.getAll(this.statusSelect.value, this.currentUser.role, this.currentUser._id).subscribe(contracts => {
      this.contracts = contracts;
      contracts.forEach(contract => {
        console.log("Contract ", contract);
      });
    });
  }

  approve(id: any) {
    let req = {
      id: id
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
              this.alertService.success('Chấp nhận thành công', false);
              this.getContractList();
            }, err => {
              this.alertService.error(err);
              // console.log(err);
              this.getContractList();
            });                        
          }, err => {
            // console.log(err);
            this.alertService.error(err);
            this.getContractList();
          });       
      });
    }, err => {
      // console.log(err);
      this.alertService.error(err);
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
        this.alertService.success('Hủy bỏ thành công', false);
        this.getContractList();
    }, err => {
      // console.log(err);
      this.alertService.error(err);
      this.getContractList();
    });
  }

  busy(id: any) {
    let nurse = {
      id: id,
      status: "busy"
    };
    this.nursesService.setStatus(nurse).subscribe(result => {
      let id = result.text();
      console.log(id);
      this.alertService.success('Báo bận thành công', true);
    }, err => {
      this.alertService.error(err);
      console.log(err);
    });       
  }  

}

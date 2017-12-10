import { Component, OnInit } from '@angular/core';
import { AlertService, NursesService } from '../../_services/index';

@Component({
  moduleId: module.id,
  selector: 'app-nurse',
  templateUrl: './nurse.component.html',
  styleUrls: ['./nurse.component.css']
})
export class NurseComponent implements OnInit {

  nurses: any;
  nursesFilter: any;
  month: number = new Date().getMonth() + 1;
  year: number = new Date().getFullYear();
  constructor(
    private alertService: AlertService,
    private nursesService: NursesService
  ) { }

  ngOnInit() {
    this.getNurseList();
  }

  getNurseList() {
    this.nursesService.getAll().subscribe(nurses => {
      this.nurses = nurses;
      this.nursesFilter = this.nurses.map(nurse => {
        let salary = nurse.nurseprofile.salaryBasic;
        let contractSalary = nurse.nurseprofile.salary && nurse.nurseprofile.salary.find(salary => {
          if (salary.month === +this.month && salary.year === this.year) return salary;
        })
        salary = contractSalary ? salary + (((+contractSalary.payment*1000 )* 60) / 100) : salary;
        salary = !isNaN(salary) ? salary : 0;
        let today = new Date();
        let createDay = new Date(nurse.created_at);
        if ((today.getMonth()+1 < +this.month && today.getFullYear() <= this.year) || (createDay.getMonth()+1 > +this.month && createDay.getFullYear() >= this.year)) {
          salary = 0;
        }
        if ((today.getFullYear() < this.year) || (createDay.getFullYear() > this.year)) {
          salary = 0;
        }
        let nurseFilter = Object.assign({}, nurse, {net: salary});
        return nurseFilter;
      });
      // nurses.forEach(nurse => {
      //   console.log("Nurse ", nurse);
      // });
    });
  }

  deactive(id: any) {
    let req = {
      id: id
    };
    console.log(id);
    this.nursesService.delete(req).subscribe(result => {
        console.log(result);
        this.alertService.success('Xóa thành công', false);
        this.getNurseList();
    }, err => {
      console.log(err);
      this.alertService.error(err, false);
    });
  }

  changeStatus(id: any, status: any) {
    status = status === "busy" ? "free" : "busy";
    let nurse = {
      id: id,
      status: status
    };
    this.nursesService.setStatus(nurse).subscribe(result => {
      let id = result.text();
      console.log(id);
      this.alertService.success('đổi trạng thái thành công', false);
      this.getNurseList();
    }, err => {
      this.alertService.error(err, false);
      console.log(err);
    });       
  }   

  changeFilter() {
    let nursesFilter = this.nurses.map(nurse => {
      let salary = nurse.nurseprofile.salaryBasic;
      let contractSalary = nurse.nurseprofile.salary && nurse.nurseprofile.salary.find(salary => {
        if (salary.month === +this.month && salary.year === this.year)
         return salary;
      })
      salary = contractSalary ? salary + (((+contractSalary.payment*1000 )* 60) / 100) : salary;
      salary = !isNaN(salary) ? salary : 0;
      let today = new Date();
      let createDay = new Date(nurse.created_at);
      if ((today.getMonth()+1 < +this.month && today.getFullYear() <= this.year) || (createDay.getMonth()+1 > +this.month && createDay.getFullYear() >= this.year)) {
        salary = 0;
      }
      if ((today.getFullYear() < this.year) || (createDay.getFullYear() > this.year)) {
        salary = 0;
      }
      let nurseFilter = Object.assign({}, nurse, {net: salary});
      return nurseFilter;
    });

    this.nursesFilter = nursesFilter;
    console.log(this.nursesFilter);
  }

  refresh(id: any) {
    this.getNurseList();
  }

}

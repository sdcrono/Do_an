import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeesService } from '../../_services/index';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {

  employee = {};
  
    constructor(
      private route: ActivatedRoute,
      private employeesService: EmployeesService
    ) { }
  
    ngOnInit() {
      this.getEmployeeDetail(this.route.snapshot.params['id']);
    }
  
    getEmployeeDetail(id) {
      this.employeesService.getById(id).subscribe(employee => {
        this.employee = employee;
        console.log("Employee edit ", employee);
      });
    }
  
}

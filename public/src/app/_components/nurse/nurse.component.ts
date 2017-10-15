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
      nurses.forEach(nurse => {
        console.log("Nurse ", nurse);
      });
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
      this.alertService.error(err);
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
      this.alertService.success('đổi thành công', false);
      this.getNurseList();
    }, err => {
      this.alertService.error(err);
      console.log(err);
    });       
  }   

}

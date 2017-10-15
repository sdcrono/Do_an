import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NursesService } from '../../_services/index';

@Component({
  // moduleId: module.id,
  selector: 'app-nurse-detail',
  templateUrl: './nurse-detail.component.html',
  styleUrls: ['./nurse-detail.component.css']
})
export class NurseDetailComponent implements OnInit {

  nurse = {};

  constructor(
    private route: ActivatedRoute,
    private nursesService: NursesService
  ) { }

  ngOnInit() {
    this.getNurseDetail(this.route.snapshot.params['id']);
  }

  getNurseDetail(id) {
    this.nursesService.getById(id).subscribe(nurse => {
      this.nurse = nurse;
      console.log("Nurse edit ", nurse);
    });
  }

}

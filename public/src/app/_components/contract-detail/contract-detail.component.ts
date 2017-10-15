import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractsService } from '../../_services/index';

@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.css']
})
export class ContractDetailComponent implements OnInit {

  contract = {};

  constructor(
    private route: ActivatedRoute,
    private contractService: ContractsService
  ) { }

  ngOnInit() {
    this.getNurseDetail(this.route.snapshot.params['id']);
  }

  getNurseDetail(id) {
    this.contractService.getById(id).subscribe(contract => {
      this.contract = contract;
      console.log("Contract edit ", contract);
    });
  }
}

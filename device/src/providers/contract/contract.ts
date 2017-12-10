import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { ContractPerson } from '../../models/index';

/*
  Generated class for the ContractProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ContractProvider {

  constructor(public http: Http) {
    console.log('Hello ContractProvider Provider');
  }

  getAll(status?: string, role?: String, id?: string) {
    let searchCriteria = {
      status: status,
      role: role,
      id: id,
    }
    console.log(searchCriteria);
    return this.http.post('/contracts/search', searchCriteria).map(response => response.json() as ContractPerson[]);
  }

  getById(_id: string) {
    return this.http.get('/contracts/' + _id).map(response => response.json() as ContractPerson);
  }


  create(contract: any) {
    return this.http.post('/contracts', contract);
  }

  done(contractId: any, nurseId: any, workingDate: any) {
    let info = {
      contractId: contractId,
      nurseId: nurseId,
      workingDate: workingDate
    }
    return this.http.post('/contracts/done', info);
  }

  off(contractId: any, nurseId: any, workingDate: any) {
    let info = {
      contractId: contractId,
      nurseId: nurseId,
      workingDate: workingDate
    }
    return this.http.post('/contracts/off', info);
  }

  approve(req: any) {
    return this.http.post('/contracts/approve', req);
  }

  reject(_id: any) {
    return this.http.post('/contracts/reject', _id);
  }

}

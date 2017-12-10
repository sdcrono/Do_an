import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';


import { Nurse, NurseProfile } from '../../models/index';
/*
  Generated class for the NurseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NurseProvider {

  constructor(public http: Http) {
    console.log('Hello NurseProvider Provider');
  }


  getAll() {
    return this.http.get('/nurses').map((res: Response) => res.json() as Nurse[]);
  }

  getById(id: string) {
    return this.http.get('/nurses/' + id).map((res: Response) => res.json() as Nurse);
  }

  create(nurse: Nurse) {
    return this.http.post('/nurses', nurse);
  }

  update(nurse: Nurse) {
    return this.http.put('/nurses/' + nurse._id, nurse);
  }

  delete(id: any) {
    return this.http. post('/nurses/del', id);
  }

  upsert(nurse: any) {
    return this.http.post('/nurses', nurse);
  }

  search(career?: string, type?: string, hospital?: string): Observable<NurseProfile[]> {
    let searchCriteria = {
      career: career,
      type: type,
      hospital: hospital
    }
    return this.http.post('/activenurses', searchCriteria).map((res: Response) => res.json() as NurseProfile[]);
  }

  updateBusyDate(nurse: any) {
    return this.http.post('/nurses/changeBusyDate', nurse);
  }

  setStatus(nurse: any) {
    return this.http.post('/nurses/changeStatus', nurse);
  }
  
}

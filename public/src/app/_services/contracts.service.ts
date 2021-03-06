import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response  } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { ContractPerson } from '../_interfaces/index';

@Injectable()
export class ContractsService {

  constructor(private http: Http) { }

    getAllCheck() {
        return this.http.get('/contracts/checks').map((response: Response) => response.json() as ContractPerson[]);
    }

    getAll(status?: string, role?: String, id?: string) {
        let searchCriteria = {
            status: status,
            role: role,
            id: id,
        }
        console.log(searchCriteria);       
        return this.http.post('/contracts/search', searchCriteria).map((response: Response) => response.json() as ContractPerson[]);
    }

    // search() {
    //     // return this.http.get('/activenurses').map((response: Response) => response.json() as NurseProfile[]);
    //     return this.http.get('/activenurses').map((response: Response) => response.json() as Nurse[]);
    // }
 
    getById(_id: string) {
        return this.http.get('/contracts/' + _id).map((response: Response) => response.json() as ContractPerson);
    }
 
    create(contract: any) {

        return this.http.post('/contracts', contract);
    }

    getTime(contract: any) {

        return this.http.post('/contracts/time', contract);
    }

    approve(req: any) {
        return this.http.post('/contracts/approve', req);
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

    reject(_id: any) {
        return this.http.post('/contracts/reject', _id);
    }    

    finish(_id: any) {
        return this.http.post('/contracts/finish', _id);
    }    

    // update(user: User) {
    //     return this.http.put('/users/' + user._id, user);
    // }
 
    // delete(_id: string) {
    //     return this.http.delete('/users/' + _id);
    // }

}
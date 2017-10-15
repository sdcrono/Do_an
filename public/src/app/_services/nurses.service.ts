import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response  } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

// import { NurseProfile } from '../_models/index';
import { Nurse, NurseProfile } from '../_interfaces/index';

@Injectable()
export class NursesService {

  constructor(private http: Http) { }

    getAll() {
        // return this.http.get('/nurses').map((response: Response) => response.json() as NurseProfile[]);
        return this.http.get('/nurses').map((response: Response) => response.json() as Nurse[]);
    }

    // search() {
    //     // return this.http.get('/activenurses').map((response: Response) => response.json() as NurseProfile[]);
    //     return this.http.get('/activenurses').map((response: Response) => response.json() as Nurse[]);
    // }

    search(career?: string, type?: string, hospital?: string) : Observable<any> {
        let searchCriteria = {
            career: career,
            type: type,
            hospital: hospital
        }
        // return this.http.get('/activenurses').map((response: Response) => response.json() as NurseProfile[]);
        return this.http.post('/activenurses', searchCriteria).map((response: Response) => response.json() as NurseProfile[]);
        // return Observable.interval(500).flatMap(() => {
        //     return this.http.post('/activenurses', searchCriteria).map((response: Response) => response.json() as NurseProfile[]);
        // });
    }
 
    getById(_id: string) {
        return this.http.get('/nurses/' + _id).map((response: Response) => response.json() as Nurse);
    }
 
    create(nurse: any) {
        return this.http.post('/nurses', nurse);
    }
 
    update(nurse: Nurse) {
        return this.http.put('/nurses/' + nurse._id, nurse);
    }
 
    upsert(nurse: any) {
        return this.http.post('/nurses', nurse);
    }

    delete(id: any) {
        return this.http.post('/nurses/del', id);
    }

    updateBusyDate(nurse: any) {
        console.log(nurse);
        return this.http.post('/nurses/changeBusyDate', nurse);
    }        

    setStatus(nurse: any) {
        console.log(nurse);
        return this.http.post('/nurses/changeStatus', nurse);
    }    

}


// export interface Nurse {
//     _id: string;
//     username: string;
//     nurseProfile: NurseProfil;
//     profile: Profil;
//     location: Loc;
//     // certification: string;
//     // rate: number;
//     // retribution: number;
// }

// export interface Loc {
//     latitude: number;
//     longitude: number;
// }

// export interface NurseProfil {
//     career: string;
//     working_place: string;
//     address: string;
//     age: number;
//     sex: string;
// }

// export interface Profil {

//     email: string;
//     phone: number;
// }
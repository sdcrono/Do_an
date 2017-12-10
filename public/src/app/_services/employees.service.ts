import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response  } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

// import { EmployeeProfile } from '../_models/index';
import { Employee, EmployeeProfile } from '../_interfaces/index';

@Injectable()
export class EmployeesService {

  constructor(private http: Http) { }

    getAll() {
        return this.http.get('/employees').map((response: Response) => response.json() as Employee[]);
    }

    search(career?: string, type?: string, hospital?: string) : Observable<any> {
        let searchCriteria = {
            career: career,
            type: type,
            hospital: hospital
        }
        return this.http.post('/activeemployees', searchCriteria).map((response: Response) => response.json() as EmployeeProfile[]);
    }
 
    getById(_id: string) {
        return this.http.get('/employees/' + _id).map((response: Response) => response.json() as Employee);
    }
 
    create(employee: any) {
        return this.http.post('/employees', employee);
    }
 
    update(employee: Employee) {
        return this.http.put('/employees/' + employee._id, employee);
    }
 
    upsert(employee: any) {
        return this.http.post('/employees', employee);
    }

    delete(id: any) {
        return this.http.post('/employees/del', id);
    }

    updateBusyDate(employee: any) {
        console.log(employee);
        return this.http.post('/employees/changeBusyDate', employee);
    }        

    setStatus(employee: any) {
        console.log(employee);
        return this.http.post('/employees/changeStatus', employee);
    }    

}

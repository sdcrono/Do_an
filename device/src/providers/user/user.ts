import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { User } from '../../models/index';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {

  constructor(public http: Http) {
    console.log('Hello UserProvider Provider');
  }

  getAll() {
    return this.http.get('./users').map((res: Response) => res.json() as User[]);
  }

  getById(id) {
    return this.http.get('/users/' + id).map((res: Response) => res.json() as User);
  }

  create(user: User) {
    return this.http.post('/users', user);
  }

  update(user: User) {
    return this.http.put('/users/' + user.id, user);
  }

  delete(id: any) {
    return this.http.post('/users/del', id);
  }

  upsert(user: any) {
    return this.http.post('/users', user);
  }

  device(id: any, deviceId: any) {
    let info = Object.assign({id: id, deviceId: deviceId})
    return this.http.post('/users/device', info);
  }

}

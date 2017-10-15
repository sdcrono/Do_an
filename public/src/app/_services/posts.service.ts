import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { User } from '../_models/user';

@Injectable()
export class PostsService {

  constructor(private http: Http) { }

  private _serverError(err: any) {
        console.log('sever error:', err);  // debug
        if(err instanceof Response) {
          // return Observable.throw(err.json().error || 'backend server error');
          // if you're using lite-server, use the following line
          // instead of the line above:
          return Observable.throw(err.text() || 'backend server error');
        }
        return Observable.throw(err || 'backend server error');
    }

  getAllPosts() {
    return this.http.get('http://localhost:3000/api/users').map(res => res.json() as User[]);
        
  }

  getUsers(): Promise<User[]> {
        return this.http.get('http://localhost:3000/api/users')
                    .toPromise()
                    .then(response => response.json() as User[])
    }

}

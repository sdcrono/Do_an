import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {

  constructor(public http: Http, private network: Network, private storage: Storage) {
    console.log('Hello AuthServiceProvider Provider');
  }

  isOnline(): boolean {
    console.log(this.network.type);
    return this.network.type != 'none' ? true : false;
  }

    login(credentials) {
      return this.http.post('/authenticate', { username: credentials.username, password: credentials.password })
          .map((response: Response) => {
              // login successful if there's a jwt token in the response
              let user = response.json();
              if (user && user.token) {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  // user.location.latitude = user.lat;
                  // user.location.longitude = user.lng;
                  this.storage.set('currentUser', JSON.stringify(user));
                  localStorage.setItem('currentUser', JSON.stringify(user));
              }
              console.log(user);
              return user;
          });
  }

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('currentUser');
      this.storage.remove('currentUser').then(resolve => {
        console.log("Remove currentUser in sqlite")
      });
  }

  // postData(credentials, type) {
  //   return new Promise((resolve, reject) => {
  //     let headers = new Headers();
  //     console.log(JSON.stringify(credentials));
  //     this.http.post(apiUrl,JSON.stringify(credentials), { headers: headers })
  //       .subscribe(res => 
  //         resolve(res.json()),
  //          err => reject(err))
  //   });
  // }
  register(credentials) {
    console.log(JSON.stringify(credentials))
    return this.http.post('/users',credentials);
  }
  signup(credentials) {
    console.log(JSON.stringify(credentials))
    return this.http.post('/nurses',credentials);
  }

  getCurrentUser() {
    return this.storage.get('currentUser');
  }

  getCurrentRegistrationId() {
    return this.storage.get('registrationId');
  }

}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class NavbarService {

  private navbarComponentMethodCallSource = new Subject<any>();

  componentMethodCalled$ = this.navbarComponentMethodCallSource.asObservable();

  callComponentMethod() {
    this.navbarComponentMethodCallSource.next();
  }   

}
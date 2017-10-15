import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/index';
import { NavbarService} from '../../_services/index';

@Component({
  moduleId: module.id,
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  currentUser: User;
  isLogin: boolean;

  constructor(
    private navbarService: NavbarService
  ) { 
      this.navbarService.componentMethodCalled$.subscribe(
        () => {
          // alert('(Component2) Method called!');
          this.changestate();
        }
      );    
  }

  ngOnInit() {
    // console.log("Currentuser: " + JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')) === null ? "" : JSON.parse(localStorage.getItem('currentUser'));
  }

  changestate() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')) === null ? "" : JSON.parse(localStorage.getItem('currentUser'));
  }

}

import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Location } from '@angular/common';
import { User } from '../_models/index';

@Injectable()
export class AuthGuardNurse implements CanActivate {

    currentUser: User;

    constructor(private router: Router, private location: Location) {}
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('currentUser')) {
            
            this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (this.currentUser.role === "ROLE_Nurse")
                return true;
            else {
                this.location.back();
                return false;
            }
                

        }
 
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
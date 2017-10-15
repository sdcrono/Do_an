import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { NavMenuComponent } from './nav-menu/index';
import { NurseProvideComponent } from './nurse-provide/index';
import { NurseComponent, NurseDetailComponent, NurseCreateComponent, NurseEditComponent, UserComponent, UserDetailComponent, UserCreateComponent, 
    UserEditComponent, ContractComponent, ContractDetailComponent, ProfileComponent } from './_components/index';
import { AuthGuard, AuthGuardAdmin, AuthGuardNurse, AuthGuardUser } from './_guards/index';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'search', component: NurseProvideComponent, canActivate: [AuthGuardUser] },
    { path: 'users', component: UserComponent, canActivate: [AuthGuardAdmin] },
    { path: 'users/add', component: UserCreateComponent, canActivate: [AuthGuardAdmin] },
    { path: 'users/:id/edit', component: UserEditComponent, canActivate: [AuthGuardAdmin] },
    { path: 'users/:id', component: UserDetailComponent, canActivate: [AuthGuardAdmin] },
    { path: 'users/:id/profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'nurses', component: NurseComponent, canActivate: [AuthGuardAdmin] },
    { path: 'nurses/add', component: NurseCreateComponent, canActivate: [AuthGuardAdmin] },
    { path: 'nurses/:id/edit', component: NurseEditComponent, canActivate: [AuthGuardAdmin] },
    { path: 'nurses/:id', component: NurseDetailComponent, canActivate: [AuthGuardAdmin] },
    { path: 'contracts', component: ContractComponent, canActivate: [AuthGuard] },
    { path: 'contracts/add', component: NurseCreateComponent, canActivate: [AuthGuardAdmin] },
    { path: 'contracts/:id/edit', component: NurseEditComponent, canActivate: [AuthGuardAdmin] },
    { path: 'contracts/:id', component: ContractDetailComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' },
    // { path: '**', component: NavMenuComponent, canActivate: [AuthGuard] }
];

export const routing = RouterModule.forRoot(appRoutes);
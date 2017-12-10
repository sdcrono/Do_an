import { Location, EmployeeProfile, Profile } from './index';

export interface Employee {
    _id: string;
    username: string;
    employeeprofile: EmployeeProfile;
    profile: Profile;
    location: Location;
}
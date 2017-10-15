import { Location, NurseProfile, Profile } from './index';

export interface Nurse {
    _id: string;
    username: string;
    nurseprofile: NurseProfile;
    profile: Profile;
    location: Location;
}
import { Location, Profile } from './index';

export interface Users {
    id: string;
    username: string;
    profile: Profile;
    location: Location;
}
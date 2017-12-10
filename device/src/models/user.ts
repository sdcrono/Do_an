import { Location, Profile } from './index';
export interface User {
    id: string,
    username: string,
    profile: Profile,
    location: Location
}
import { Location } from './location';
export class NurseProfile {
    _id: string;
    username: string;
    password: string;
    // lat: number;
    // lng: number;
    location: Location;
    role: String; 
    email: string;
    phone: number;
    age: number;
    gender: string;
    address: string;
    certification: string;
    career: string;
    working_place: string;
    sex: string;
    rate: number;
    retribution: number;
}
import { Nurse, Name, BusyDate } from './index';

export interface NurseProfile {
    career: string;
    working_place: string;
    hospital: string;
    type: string;
    owner: Nurse;
    name: Name;
    status: string;
    busy_dates: BusyDate[];
    // address: string;
    // age: number;
    // sex: string;
}
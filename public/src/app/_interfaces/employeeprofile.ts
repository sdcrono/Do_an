import { Employee, Name, DayOff, Job, Education, Salary } from './index';

export interface EmployeeProfile {
    id_number: string;
    home_town: string;
    leave: Boolean,
    start_contract_date: Date,
    end_contract_date: Date,
    owner: Employee;
    // name: Name;
    day_off: DayOff[];
    job: String;
    education: String;
    division: String;
    salary: number;  
    // address: string;
    // age: number;
    // sex: string;
}
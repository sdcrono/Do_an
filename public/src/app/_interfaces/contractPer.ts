import { Users, Nurse, ContractDetail, Location } from './index';

export interface ContractPerson {
    userId: Users,
    nurseId: Nurse,
    patientName: String,
    patientAge: String,
    address: String,
    location: Location,
    district: String,
    created_at: Date,
    detail: ContractDetail
    _id: string;
}
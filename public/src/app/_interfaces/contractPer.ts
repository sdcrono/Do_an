import { Users, Nurse, ContractDetail } from './index';

export interface ContractPerson {
    userId: Users,
    nurseId: Nurse,
    patientName: String,
    patientAge: String,
    detail: ContractDetail
}
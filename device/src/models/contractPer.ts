import { User, Nurse, ContractDetail } from './index';
export interface ContractPerson {
    userId: User,
    nurseId: Nurse,
    patientName: string,
    patientAge: string,
    status: string,
    detail: ContractDetail
}
import { ContractDetail, Location } from './index';
export interface Contract {
    userId: string,
    nurseId: string,
    createdAt: Date,
    startAt: Date,
    endAt: Date,
    patientName: string,
    patientAge: string,
    address: string,
    district: string,
    location: Location, 
    payment: string,
    corePayment: Number,
    totalPayment: Number,    
    paymentEachDays: number[], 
    detail: ContractDetail
}
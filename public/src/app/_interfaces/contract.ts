import { Location } from './index'
export interface Contract {
    userId: string,
    nurseId: string,
    createdAt: Date,
    endAt: Date,
    patientName: string,
    patientAge: string,
    address: string,
    location: Location,
    payment: string
}
import { Contract } from '../_interfaces/index'
import { ContractDetailModel, Location } from '../_models/index'
export class ContractModel implements Contract{
    
    constructor(
        public userId: string,
        public nurseId: string, 
        public createdAt: Date, 
        public startAt: Date, 
        public endAt: Date,
        public patientName: string,
        public patientAge: string,
        public address: string,
        public location: Location,
        public district: string,
        public payment: string,     
        public corePayment: number,
        public totalPayment: number, 
        public paymentEachDays: number[],   
        public detail: ContractDetailModel
    ) { }
    
}
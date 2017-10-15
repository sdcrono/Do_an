import { Contract } from '../_interfaces/index'
import { ContractDetailModel, Location } from '../_models/index'
export class ContractModel implements Contract{
    
    constructor(
        public userId: string,
        public nurseId: string, 
        public createdAt: Date, 
        public endAt: Date,
        public patientName: string,
        public patientAge: string,
        public address: string,
        public location: Location,
        public payment: string,        
        public detail: ContractDetailModel
    ) { }
    
}
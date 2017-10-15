import { BusyDate } from '../_models/index'
export class ContractDetailModel{
    
    constructor(
        public jobDescription: string,
        // public dates: string[]
        public dates: BusyDate[]
    ) { }
    
}
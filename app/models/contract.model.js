const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var contractSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users'	
    },
    nurseId: {
        type: Schema.Types.ObjectId,
        ref: 'Users'	
    },
    created_at: Date,
    start_at: Date,
    end_at: Date,
    patientName: String,
    patientAge: String,
    address: String,
    location: {
        latitude: Number,
        longitude: Number
    },
    // payment: String,
    district: String,
    workingDates: [{
        date: Date,
        process: Number,
        fee: Number
    }],    
    corePayment: Number, 
    totalPayment: Number, 
    nurseNetReceive: Number,
    companyNetReceive: Number,
    status: {
        type: String,
        enum: ['check', 'approve', 'reject', 'finish']
    },
    payment: String,
    detail: {
        type: Schema.Types.ObjectId,
        ref: 'ContractDetails'	
    }
});

var Contracts = mongoose.model('Contracts', contractSchema);

module.exports = Contracts;
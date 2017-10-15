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
    end_at: Date,
    patientName: String,
    patientAge: String,
    address: String,
    location: {
        latitude: Number,
        longitude: Number
    },
    payment: String,    
    status: {
        type: String,
        enum: ['check', 'approve', 'reject', 'finish']
    },
    payment: {
        type: String,
        enum: ['50.000 VND', '100.000 VND', '200.000 VND', '300.000 VND', '400.000 VND']
    },    
    detail: {
        type: Schema.Types.ObjectId,
        ref: 'ContractDetails'	
    }
});

var Contracts = mongoose.model('Contracts', contractSchema);

module.exports = Contracts;
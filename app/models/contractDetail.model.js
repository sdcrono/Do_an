const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var contractDetailSchema = new Schema({
    jobDescription: String,
    dates: [{
        date: String,
        start_time: Date,
        end_time: Date
    }],
    // startHour: TimeRanges,
    // endHour: TimeRanges,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Contracts'	
    }
});

var ContractDetails = mongoose.model('ContractDetails', contractDetailSchema);

module.exports = ContractDetails;
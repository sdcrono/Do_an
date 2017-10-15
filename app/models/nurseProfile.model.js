const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var nurseProfileSchema = new Schema({
    certification: [String],
    career: {
        type: String,
        enum: ['LPN', 'RN'] //Licensed Practical Nurse and Registered Nurse
    },
    working_place: String,
    address: String,
    age: { type: Number, min: 22 },
    sex: String,	
    rate: Number,
    retribution: Number,
    history: String,
    hospital: String,
    type: {
        type: String,
        enum: ['Internal', 'External']
    },
    isDelete: Boolean,
    status: {
        type: String,
        enum: ['free', 'working']
    },
    busy_dates: [{
        date: String,
        start_time: Date,
        end_time: Date
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
});

var NurseProfiles = mongoose.model('NurseProfiles', nurseProfileSchema);

module.exports = NurseProfiles;
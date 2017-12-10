const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var employeeProfileSchema = new Schema({
    id_number: String,
    home_town: String,
    address: String,
    age: { type: Number, min: 22 },
    sex: String,
    isDelete: Boolean,    
    leave: Boolean,
    start_contract_date: Date,
    end_contract_date: Date,
    job: String,  
    education: String,
    division: String,    
    salary: Number,
    salaries: [{
        date: Date,
        monthApply: Number,
        yearApply: Number,
        salary: Number,
    }],
    day_off: [{
        date: Date,
        start_time: Date,
        end_time: Date
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
});

var EmployeeProfiles = mongoose.model('EmployeeProfiles', employeeProfileSchema);

module.exports = EmployeeProfiles;
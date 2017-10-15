const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var serviceSchema = new Schema({    
    type: {
        type: String,
        enum: ['Standard', 'High demand']
    }
    
});

var Services = mongoose.model('Services', serviceSchema);

module.exports = Services;
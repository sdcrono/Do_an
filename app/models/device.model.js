var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var deviceSchema = mongoose.Schema({ 

	deviceName 		: String,
	deviceId		: String, 
	registrationId	: String

});


var DeviceDetails = mongoose.model('DeviceDetails', deviceSchema);

module.exports = DeviceDetails;
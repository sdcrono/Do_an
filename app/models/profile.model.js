const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var profileSchema = new Schema({
    name: {
        type: String
    },
	email: {
        type: String,
        lowercase: true,
        unique: true,
        dropDups: true 
    },
	phone: {
        type: String,
        validate: {
          validator: function(v) {
            return /\d{11}/.test(v);
          },
          message: '{VALUE} is not a valid phone number!'
        }
    },
	age: { type: Number, min: 22 },	
	sex: String,
	address: String,
	owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'	
    }
});

profileSchema.virtual('fullname').get(function() {
    return this.first + " " + this.last;
});

profileSchema.virtual('fullname').set(function (name) {  
  var split = name.split(' ');
  this.first = split[0];
  this.last = split[1];
});

var Profiles = mongoose.model('Profiles', profileSchema);

module.exports = Profiles;
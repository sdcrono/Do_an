const mongoose = require('mongoose'),
    crypto = require('crypto');

const Schema = mongoose.Schema;

var userSchema = new Schema({    
	username: {
        type: String,
        required: [true, 'Username required'],
        get: username => username,
        set: username => username,
        trim: true,
        unique: true 
    },
	password: {
        type: String,
        required: [true, 'Password required']
    },
    provider: String,
	providerId: String,
	providerData: {},
    role: String,
    location: {
        latitude: Number,
        longitude: Number
    },
    created_at: Date,
    updated_at: {
        type: Date,
        default: Date.now
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profiles'
    },
    nurseprofile: {
        type: Schema.Types.ObjectId,
        ref: 'NurseProfiles'
    },
    isDelete: Boolean
});

// userSchema.pre('save',
//     next => {
//         if (this.password) {
//             var md5 = crypto.createHash('md5');
//             this.password = md5.update(this.password).digest('hex');
//         }

//         next();
//     }
// );

userSchema.methods.authenticate = function(password) {
    var md5 = crypto.createHash('md5');
    md5 = md5.update(password).digest('hex');

    return this.password === md5;
};

userSchema.statics.findUniqueUsername = function(username, suffix, callback){
	var _this = this;
	var possibleUsername = username + (suffix || '');
	
	_this.findOne(
		{username: possibleUsername},
		(err, user) => {
			if(!err){
				if(!user){
					callback(possibleUsername);
				}
				else{
					return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
				}
			}
			else{
				callback(null);
			}
		}
	);
};

var Users = mongoose.model('Users', userSchema);

module.exports = Users;
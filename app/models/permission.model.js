const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var permissionSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
	description: String,
});

var Permissions = mongoose.model('Permissions', permissionSchema);

module.exports = Permissions;
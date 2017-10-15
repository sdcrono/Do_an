const Permissions = require('mongoose').model('Permissions');

exports.listPermission = (req, res) => 
        Permissions.find({ name: "ROLE_Login" },
        (err, permission) => {
            if (err) throw err;
            res.send(permission);
        });
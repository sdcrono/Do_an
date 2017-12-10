const employeeService = require('../services/employee.service'),
userService = require('../services/user.service');

var getErrorMessage = function(err){
var message = '';
if(err.code){
    switch(err.code){
        case 11000:
        case 11001:
            message = 'Username already exists';
            break;
        default:
            message = 'Something went wrong';
    }
}
else{
    for(var errName in err.errors){
        if(err.errors[errName].message)
            message = err.errors[errName].message;
    }
}

return message;
};

exports.read =(req, res) => res.send(req.user)

exports.getById = (req, res, next, id) => 
    employeeService.getById(id)
    .then(user => {
        // res.send(users);
        req.user = user;
        next();
    })
    .catch(err => {
        res.status(400).send(err);
    })
    
exports.getMetaById = (req, res) => 
    employeeService.getMetaById(req.params.id)
    .then(profile => {
        res.send(profile);
    })
    .catch(err => {
        res.status(400).send(err);
    })  

exports.getAll = (req, res, next) => 
    employeeService.getAll()
        .then(users => {
            res.send(users);
        })
        .catch(err => {
            res.status(400).send(err);
        })

exports.upsert = (req, res, next) => {

    if (req.body.id) {
        employeeService.updateUser(req.body)
            .then(result => {
                res.send(result);
            })
            .catch(err => {
                res.status(400).send(err);
            });
        employeeService.updateProfile(req.body)
            .then(result => {
                res.send(result);
            })
            .catch(err => {
                res.status(400).send(err);
            });
        employeeService.updateEmployeeProfile(req.body)
            .then(result => {
                res.send(result);
            })
            .catch(err => {
                res.status(400).send(err);
            });
    }

    else {
        employeeService.createUser(req.body)
            .then(result => {
                res.send(result);
            })                
            .catch(err => {
                res.status(400).send(err);
            })                    
    }

}

exports.delete = (req, res, next) => {
employeeService.deleteUser(req.body.id)
    .then(result => {
        res.send(result);
    })                
    .catch(err => {
        res.status(400).send(err);
    })
}
    

exports.deactive = (req, res, next) => {
    employeeService.deactiveUser(req.body.id)        
    .then(result => {
        res.send(result);
    })                
    .catch(err => {
        res.status(400).send(err);
    });
    employeeService.deactiveEmployee(req.body.id)        
    .then(result => {
        res.send(result);
    })                
    .catch(err => {
        res.status(400).send(err);
    });
}


exports.active = (req, res, next) => 
    employeeService.activeUser(req.body.id)        
    .then(result => {
        res.send(result);
    })                
    .catch(err => {
        res.status(400).send(err);
    })

// exports.search = (req, res) => {
// };

exports.register = (req, res, next) => {
if (!req.user) {
    var user = new User(req.body);
    var message = null;
    user.provider = 'local';
    user.save( err => {
        if (err) {
            var message = getErrorMessage(err);
            req.flash('error', message);
            return res.redirect('/register');
        }

        req.login(user, function(err) {
            if (err)
                return next(err);

            return res.redirect('/');
        });
    });
}
else {
    return res.redirect('/');
}
};

exports.logout = (req, res) => {
req.logout();
res.redirect('/');
};

exports.authenticate = (req, res) => 
userService.authenticate(req.body.username, req.body.password)
    .then(function (user) {
        if (user) {
            // authentication successful
            res.send(user);
        } else {
            // authentication failed
            res.status(400).send('Username or password is incorrect');
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });

exports.search = (req, res, next) => 
    employeeService.search(req.body)
        .then(users => {
            res.send(users);
        })
        .catch(err => {
            res.status(400).send(err);
        })

exports.setStatus = (req, res, next) => {
console.log(req.body);
employeeService.setStatus(req.body)
        .then(employee => {
            res.send("Thành công");
        })
        .catch(err => {
            res.status(400).send(err);
        })            
}

exports.setDate = (req, res, next) => {
console.log(req.body);
employeeService.setDate(req.body)
        .then(employee => {
            res.send("Thành công");
        })
        .catch(err => {
            res.status(400).send(err);
        })            
}

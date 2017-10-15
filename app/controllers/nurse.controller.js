const nurseService = require('../services/nurse.service'),
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
        nurseService.getById(id)
        .then(user => {
            // res.send(users);
            req.user = user;
            next();
        })
        .catch(err => {
            res.status(400).send(err);
        })
        
exports.getMetaById = (req, res) => 
        nurseService.getMetaById(req.params.id)
        .then(profile => {
            res.send(profile);
        })
        .catch(err => {
            res.status(400).send(err);
        })  

exports.getAll = (req, res, next) => 
        nurseService.getAll()
            .then(users => {
                res.send(users);
            })
            .catch(err => {
                res.status(400).send(err);
            })

exports.upsert = (req, res, next) => {

        if (req.body.id) {
            nurseService.updateUser(req.body)
                .then(result => {
                    res.send(result);
                })
                .catch(err => {
                    res.status(400).send(err);
                });
            nurseService.updateProfile(req.body)
                .then(result => {
                    res.send(result);
                })
                .catch(err => {
                    res.status(400).send(err);
                });
            nurseService.updateNurseProfile(req.body)
                .then(result => {
                    res.send(result);
                })
                .catch(err => {
                    res.status(400).send(err);
                });
        }

        else {
            nurseService.createUser(req.body)
                .then(result => {
                    res.send(result);
                })                
                .catch(err => {
                    res.status(400).send(err);
                })                    
        }

    }

exports.insert = (req, res) => {

        var newUser = Users({
            username: req.body.username,
            password: req.body.password,
            nurse: false,
            admin: false,
            created_at: new Date,
            updated_at: new Date,
            isDelete: true
        });
        newUser.save((err, user) => {
            if (err) throw err;
            res.send('Success');
        });

        Users.findOne({username: req.body.username}, (err, user) => {
                if(err){
                    return handleError(err);
                }
                var profile = {
                    name: {
                        first: req.body.first,
                        last: req.body.last
                    },
                    email: req.body.email,
                    phone: req.body.phone,
                    age: req.body.age,	
                    sex: req.body.gender,
                    address: req.body.address,
                    owner: user._id 
                }

                Profiles.findOneAndUpdate({owner: user._id}, profile, {upsert:true}, (err, doc) => {
                    if (err) return handleError(err);
                    // return res.send("succesfully saved");
                });
            });
        // }

    }

exports.delete = (req, res, next) => {
    nurseService.deleteUser(req.body.id)
        .then(result => {
            res.send(result);
        })                
        .catch(err => {
            res.status(400).send(err);
        })
}
        

exports.deactive = (req, res, next) => {
        nurseService.deactiveUser(req.body.id)        
        .then(result => {
            res.send(result);
        })                
        .catch(err => {
            res.status(400).send(err);
        });
        nurseService.deactiveNurse(req.body.id)        
        .then(result => {
            res.send(result);
        })                
        .catch(err => {
            res.status(400).send(err);
        });
}


exports.active = (req, res, next) => 
        nurseService.activeUser(req.body.id)        
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
        nurseService.search(req.body)
            .then(users => {
                res.send(users);
            })
            .catch(err => {
                res.status(400).send(err);
            })

exports.setStatus = (req, res, next) => {
    console.log(req.body);
    nurseService.setStatus(req.body)
            .then(nurse => {
                res.send("Thành công");
            })
            .catch(err => {
                res.status(400).send(err);
            })            
}

exports.setDate = (req, res, next) => {
    console.log(req.body);
    nurseService.setDate(req.body)
            .then(nurse => {
                res.send("Thành công");
            })
            .catch(err => {
                res.status(400).send(err);
            })            
}
    
// const Users = require('../models/userModel'),
// const Users = require('mongoose').model('Users'),

//     Profiles = require('../models/profile.model');
const userService = require('../services/user.service');

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

// exports.userById = (req, res) => 
//         Users.find({ username: req.params.id },
//         (err, users) => {
//             if (err) throw err;
//             res.send(users);
//         })

exports.getById = (req, res) => 
        userService.getById(req.params.id)
        .then(users => {
            res.send(users);
        })
        .catch(err => {
            res.status(400).send(err);
        })        

// exports.list = (req, res) => 
//         Users.find({}, (err, users) => {
//             var userMap = {};

//             users.forEach((user) => userMap[user._id] = user );

//             res.send(users);
//         })

exports.getAll = (req, res, next) => 
        userService.getAll()
            .then(users => {
                res.send(users);
            })
            .catch(err => {
                res.status(400).send(err);
            })

// exports.upsert = (req, res) => {

//         if (req.body.id) {
//             Users.findByIdAndUpdate(req.body.id, { username: req.body.username, password: req.body.password,
//                 nurse: false, admin: false, updated_at: new Date}, (err, user) => {
//                 if (err) throw err;
//                 // res.send('success');
//             });
//         }

//         else {
//             var newUser = Users({
//                 username: req.body.username,
//                 password: req.body.password,
//                 nurse: false,
//                 admin: false,
//                 created_at: new Date,
//                 updated_at: new Date,
//                 isDelete: true
//             });
//             newUser.save((err, user) => {
//                 if (err) throw err;
//                 // res.send('Success');
//                 Users.findOne({username: req.body.username}, (err, user) => {
//                     if(err){
//                         return handleError(err);
//                     }
//                     var profile = new Profiles({
//                         name: {
//                             first: req.body.first,
//                             last: req.body.last
//                         },
//                         email: req.body.email,
//                         phone: req.body.phone,
//                         age: req.body.age,	
//                         sex: req.body.gender,
//                         address: req.body.address,
//                         owner: user._id 
//                     });

//                     // Profiles.findOneAndUpdate({owner: user._id}, profile, {upsert:true}, (err, doc) => {
//                     //     if (err) return handleError(err);
//                     //      res.send("succesfully saved");
//                     // });
//                     profile.save((err, doc) => {
//                         if (err) return handleError(err);
//                          res.send("succesfully saved");
//                     });
//                 });
//             });


//         }

//     }

exports.upsert = (req, res, next) => {

        if (req.body.id) {
            // Users.findByIdAndUpdate(req.body.id, { username: req.body.username, password: req.body.password,
            //     nurse: false, admin: false, updated_at: new Date}, (err, user) => {
            //     if (err) throw err;
            //     res.send('success');
            // });
            userService.updateUser(req.body)
                .then(result => {
                    res.send(result);
                })
                .catch(err => {
                    res.status(400).send(err);
                });
            userService.updateProfile(req.body)
                .then(result => {
                    res.send(result);
                })
                .catch(err => {
                    res.status(400).send(err);
                });
        }

        else {
            userService.createUser(req.body)
                // .then(userService.upsertProfile(req.body.username, req.body.first, req.body.last, req.body.email, req.body.phone, req.body.age, req.body.gender, req.body.address)
                //     .then(result => {
                //         res.send(result);
                //     })
                //     .catch(err => {
                //         res.status(400).send(err);
                //     })  )
                .then(result => {
                    res.send(result);
                })                
                .catch(err => {
                    res.status(400).send(err);
                })
            // userService.upsertProfile(req.body.username, req.body.first, req.body.last, req.body.email, req.body.phone, req.body.age, req.body.gender, req.body.address)
            //     .then(result => {
            //         res.send(result);
            //     })
            //     .catch(err => {
            //         res.status(400).send(err);
            //     })                    
        }

    }

exports.insert = (req, res) => {

        // if (req.body.id) {
        //     res.send('the username is existing');     
        // }

        // else {
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

// exports.delete = (req, res, next) => 

//         Users.findByIdAndRemove(req.body.id, (err) => {
//             if (err) throw err;
//             res.send('SUCCESS');
//         })

exports.register = (req, res, next) => {

    userService.registerUser(req.body)
        .then(result => {
            res.send(result);
        })                
        .catch(err => {
            res.status(400).send(err);
        })                 
}

exports.delete = (req, res, next) => {
    userService.deleteUser(req.body.id)
        .then(result => {
            res.send(result);
        })                
        .catch(err => {
            res.status(400).send(err);
        })
}
        

exports.deactive = (req, res, next) => 
        userService.deactiveUser(req.body.id)        
        .then(result => {
            res.send(result);
        })                
        .catch(err => {
            res.status(400).send(err);
        })

exports.active = (req, res, next) => 
        userService.activeUser(req.body.id)        
        .then(result => {
            res.send(result);
        })                
        .catch(err => {
            res.status(400).send(err);
        })

exports.search = (req, res) => {
};

// exports.register = (req, res, next) => {
//     if (!req.user) {
//         var user = new User(req.body);
//         var message = null;
//         user.provider = 'local';
//         user.save( err => {
//             if (err) {
//                 var message = getErrorMessage(err);
//                 req.flash('error', message);
//                 return res.redirect('/register');
//             }

//             req.login(user, function(err) {
//                 if (err)
//                     return next(err);

//                 return res.redirect('/');
//             });
//         });
//     }
//     else {
//         return res.redirect('/');
//     }
// };

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};

// exports.authenticate = (username, password) => {
//     var deferred = Q.defer();
 
//     db.users.findOne({ username: username }, function (err, user) {
//         if (err) deferred.reject(err.name + ': ' + err.message);
 
//         if (user && bcrypt.compareSync(password, user.hash)) {
//             // authentication successful
//             deferred.resolve({
//                 _id: user._id,
//                 username: user.username,
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 token: jwt.sign({ sub: user._id }, config.secret)
//             });
//         } else {
//             // authentication failed
//             deferred.resolve();
//         }
//     });
 
//     return deferred.promise;

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


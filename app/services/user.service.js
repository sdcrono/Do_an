const Users = require('mongoose').model('Users'),
    Profiles = require('mongoose').model('Profiles');

const _ = require('lodash');
    jwt = require('jsonwebtoken')
    bcrypt = require('bcryptjs');
    Q = require('q');

var service = {};
 
service.authenticate = authenticate;
service.getAll = getAllUser;
service.getById = getById;
service.registerUser = registerUser;
service.registerProfile = registerProfile;
service.createUser = createUser;
service.createProfile = createProfile;
service.updateUser = updateUser;
service.updateProfile = updateProfile;
service.deleteUser = _deleteUser;
service.deleteProfile = _deleteProfile;
// service.search = search;
service.deactiveUser = deactiveUser;
service.activeUser = activeUser;
 
module.exports = service;

function authenticate(username, password) {
    var deferred = Q.defer();
 
    Users.findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);
 
        if (user && bcrypt.compareSync(password, user.password)) {
            // authentication successful
            Profiles.findOne({owner: user._id}, (err, profile) => {
                if(err){
                    deferred.reject(err.name + ': ' + err.message);
                }
                deferred.resolve({
                    _id: user._id,
                    username: user.username,
                    // firstName: profile.name.first,
                    // lastName: profile.name.last,
                    role: user.role,
                    lat: user.location.latitude,
                    lng: user.location.longitude,
                    token: jwt.sign({ sub: user._id }, "config.secret")
                });
            });

        } else {
            // authentication failed
            deferred.resolve();
        }
    });
 
    return deferred.promise;
}

function getAll() {
    let deferred = Q.defer();
 
    Users.find({isDelete: false}, (err, users) => {

                if (err) deferred.reject(err.name + ': ' + err.message);

                var userMap = {};

                users.forEach((user) => userMap[user._id] = user );
                users = _.map(users, function (user) {
                    return _.omit(user, 'password');
                });
                deferred.resolve(users);
                // res.send(users);
            })
    return deferred.promise;
}


function getAllUser() {
    let deferred = Q.defer();
    Users.find({isDelete: false, role: "ROLE_User"}).select("-password -created_at -updated_at -isDelete -role -__v").populate({
                path: 'profile',
                model: 'Profiles',
                select: '-_id -owner -__v'
            }).exec((err, users) => {

                if (err) deferred.reject(err.name + ': ' + err.message);
                
                // var userMap = {};

                // users.forEach((user) => userMap[user._id] = user );
                // users = _.map(users, function (user) {
                //     return _.omit(user, 'password');
                // });
                deferred.resolve(users);
                // res.send(users);
            })
    return deferred.promise;
}

function userById() {
    let deferred = Q.defer();
    Users.find({ username: req.params.id },
            (err, users) => {
                if (err) throw err;
                res.send(users);
            })

}

// function getById(_id) {
//     let deferred = Q.defer();
 
//     Users.findById({ _id: _id }, function (err, user) {
//         if (err) deferred.reject(err.name + ': ' + err.message);
 
//         if (user) {
//             // return user (without hashed password)
//             deferred.resolve(_.omit(user, 'hash'));
//         } else {
//             // user not found
//             deferred.resolve();
//         }
//     });
 
//     return deferred.promise;
// }

function getById(_id) {
    let deferred = Q.defer();
 
    // Users.findById({ _id: _id }, function (err, user) {
    //     if (err) deferred.reject(err.name + ': ' + err.message);
 
    //     if (user) {
    //         // return user (without hashed password)
    //         deferred.resolve(_.omit(user, 'password'));
    //     } else {
    //         // user not found
    //         deferred.resolve();
    //     }
    // });
    Users.findById({ _id: _id }).select("-password -created_at -updated_at -isDelete -role -__v").populate({
            path: 'profile',
            model: 'Profiles',
            select: '-_id -owner -__v'
        }).exec((err, user) => {

            if (err) deferred.reject(err.name + ': ' + err.message);
            
            // var userMap = {};

            // users.forEach((user) => userMap[user._id] = user );
            // users = _.map(users, function (user) {
            //     return _.omit(user, 'password');
            // });
            deferred.resolve(user);
            // res.send(users);
        })

    return deferred.promise;
}

function registerUser(userParam) {
    let deferred = Q.defer();

    Users.findOne(
        { username: userParam.username },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);
 
            if (user) {
                // username already exists
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
                    Profiles.findOne(
                        { email: userParam.email },
                        function (err, profile) {
                            if (err) deferred.reject(err.name + ': ' + err.message);
                
                            if (profile) {
                                // username already exists
                                deferred.reject('Email "' + userParam.email + '" is already taken');
                            } else {
                                let pass = bcrypt.hashSync(userParam.password, 10);
                                let newUser = Users({
                                    username: userParam.username,
                                    password: pass,
                                    // nurse: false,
                                    // admin: false,
                                    role: "ROLE_User",
                                    created_at: new Date,
                                    updated_at: new Date,
                                    isDelete: false
                                });
                                newUser.save((err, user) => {
                                    if (err) deferred.reject(err.name + ': ' + err.message);
                                    // deferred.resolve('Success');
                                    registerProfile(userParam);
                                });
                                
                            }
                        });
            }
        });
        return deferred.promise;


}

function registerProfile(userParam) {
    let deferred = Q.defer();

    Users.findOne({username: userParam.username}, (err, user) => {
        if(err){
            deferred.reject(err.name + ': ' + err.message);
        }
        let profile = new Profiles ({
            name: userParam.name,
            email: userParam.email,
            owner: user._id 
        })

        // Profiles.findOneAndUpdate({owner: user._id}, profile, {upsert:true}, (err, doc) => {
        //     if (err) deferred.reject(err.name + ': ' + err.message);
        //     deferred.resolve('Success2');
        // });
        profile.save((err, profile) => {
            if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve('Success2');
                Users.findOneAndUpdate({username: userParam.username}, {profile: profile._id}, (err, user) => {
                    if (err) deferred.reject(err.name + ': ' + err.message);
                     deferred.resolve('Success4');
                });
        });
    });
    return deferred.promise;
}

function createUser(userParam) {
    let deferred = Q.defer();

    Users.findOne(
        { username: userParam.username },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);
 
            if (user) {
                // username already exists
                // deferred.reject('Username "' + userParam.username + '" is already taken');
                deferred.reject('Tên tài khoản "' + userParam.username + '" đã có rồi');
            } else {
                    Profiles.findOne(
                        { email: userParam.email },
                        function (err, profile) {
                            if (err) deferred.reject(err.name + ': ' + err.message);
                
                            if (profile) {
                                // username already exists
                                // deferred.reject('Email "' + userParam.email + '" is already taken');
                                deferred.reject('Email "' + userParam.email + '" đã có rồi');
                            } else {
                                let pass = bcrypt.hashSync(userParam.password, 10);
                                let newUser = Users({
                                    username: userParam.username,
                                    password: pass,
                                    location: {
                                        latitude: userParam.lat,
                                        longitude: userParam.lng
                                    },
                                    // nurse: false,
                                    // admin: false,
                                    role: "ROLE_User",
                                    created_at: new Date,
                                    updated_at: new Date,
                                    isDelete: false
                                });
                                newUser.save((err, user) => {
                                    if (err) deferred.reject(err.name + ': ' + err.message);
                                    // deferred.resolve('Success');
                                    else
                                        createProfile(userParam).then(result => {
                                            deferred.resolve(user._id);
                                        })
                                        .catch(err => {
                                            deferred.reject(err);
                                        });
                                });
                                
                            }
                        });
            }
        });
        return deferred.promise;


}

function createProfile(userParam) {
    let deferred = Q.defer();

    Users.findOne({username: userParam.username}, (err, user) => {
        if(err){
            deferred.reject(err.name + ': ' + err.message);
        }
        let profile = new Profiles ({
            name: userParam.name,
            email: userParam.email,
            phone: userParam.phone,
            age: userParam.age,	
            sex: userParam.gender,
            address: userParam.address, 
            owner: user._id 
        })

        // Profiles.findOneAndUpdate({owner: user._id}, profile, {upsert:true}, (err, doc) => {
        //     if (err) deferred.reject(err.name + ': ' + err.message);
        //     deferred.resolve('Success2');
        // });
        profile.save((err, profile) => {
            if (err) deferred.reject(err.name + ': ' + err.message);
                // deferred.resolve(userParam.id);
                Users.findOneAndUpdate({username: userParam.username}, {profile: profile._id}, (err, user) => {
                    if (err) deferred.reject(err.name + ': ' + err.message);
                     deferred.resolve(userParam.id);
                });
        });
    });
    return deferred.promise;
}

function updateUser(userParam) {
    let deferred = Q.defer();

    // Users.findByIdAndUpdate(id, { username: username, password: password,
    //     nurse: false, admin: false, updated_at: new Date}, (err, user) => {
    //     if (err) deferred.reject(err.name + ': ' + err.message);
    //     // deferred.resolve('Success3');
    //     updateProfile(user.profile._id, username, firstname, lastname, email, phone, age, gender, address);
    // });
    // return deferred.promise;

    Users.findOne({_id: userParam.id}, (err, user) => {
        if (err){
            deferred.reject(err.name + ': ' + err.message);
        }

        var info = {
            username: userParam.username,
            location: {
                latitude: userParam.lat,
                longitude: userParam.lng
            }            
        };

        if(userParam.password)
            info.password = bcrypt.hashSync(userParam.password, 10);

        user.update(info, (err) => {
            if (err) { deferred.reject(err.name + ': ' + err.message); }
        });

        // updateProfile(id, firstname, lastname, email, phone, age, gender, address);

        // let profile = new Profiles ({$2a$10$eeDlRLFlHKIQVKvkWNRSAu9Vq9YmBQ8EVKQRtMgCAc7PCP8ni0q66
        //     name: {
        //         first: firstname,
        //         last: lastname
        //     },
        //     email: email,
        //     phone: phone,
        //     age: age,	
        //     sex: gender,
        //     address: address,
        //     owner: user._id 
        // })

        // // Profiles.findOneAndUpdate({owner: user._id}, profile, {upsert:true}, (err, doc) => {
        // //     if (err) deferred.reject(err.name + ': ' + err.message);
        // //     deferred.resolve('Success2');
        // // });
        // profile.save((err, profile) => {
        //     if (err) deferred.reject(err.name + ': ' + err.message);
        //         deferred.resolve('Success2');
        //         Users.findOneAndUpdate({username: username}, {profile: profile._id}, (err, user) => {
        //             if (err) deferred.reject(err.name + ': ' + err.message);
        //              deferred.resolve('Success4');
        //         });
        // });
    });
    return deferred.promise;


}

function updateProfile(userParam) {
    let deferred = Q.defer();
    // let profile = Profiles.find({owner: id});
    Profiles.findOne({owner: userParam.id}, (err, profile) => {
        if (err){
            deferred.reject(err.name + ': ' + err.message);
        }   
        let set = {
            name: userParam.name,
            email: userParam.email,
            phone: userParam.phone,
            age: userParam.age,	
            sex: userParam.gender,
            address: userParam.address
        }

        profile.update(set, (err, doc) => {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(userParam.id);
        });
    });
    // Profiles.findByIdAndUpdate(id, set, (err, doc) => {
    //     if (err) deferred.reject(err.name + ': ' + err.message);
    //     deferred.resolve('Success2');
    // });


    return deferred.promise;
}

function _deleteUser(id) {

    let deferred = Q.defer();

    Users.findByIdAndRemove(id, (err) => {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve('SUCCESS');
    })
    return deferred.promise;
}

function _deleteProfile(id) {

    let deferred = Q.defer();

    Profiles.findByIdAndRemove(id, (err) => {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve('SUCCESS');
    })
    return deferred.promise;
}

function deactiveUser(id) {

    let deferred = Q.defer();

    Users.findOne({_id: id}, (err, user) => {
        if (err){
            deferred.reject(err.name + ': ' + err.message);
        }

        let info = {
            isDelete: true
        };

        user.update(info, (err) => {
            if (err) { deferred.reject(err.name + ': ' + err.message); }
            deferred.resolve('SUCCESS');
        });

    });
    return deferred.promise;
}

function activeUser(id) {

    let deferred = Q.defer();

    Users.findOne({_id: id}, (err, user) => {
        if (err){
            deferred.reject(err.name + ': ' + err.message);
        }

        let info = {
            isDelete: false
        };

        user.update(info, (err) => {
            if (err) { deferred.reject(err.name + ': ' + err.message); }
            deferred.resolve('SUCCESS');
        });

    });
    return deferred.promise;
}
const Users = require('mongoose').model('Users'),
    Profiles = require('mongoose').model('Profiles'),
    EmployeeProfiles = require('mongoose').model('EmployeeProfiles');

const _ = require('lodash');
jwt = require('jsonwebtoken')
bcrypt = require('bcryptjs');
Q = require('q');

var service = {};

// service.authenticate = authenticate;
service.getAll = getAllEmployees;
service.getById = getById;
service.getMetaById = getMetaById;
service.createUser = createUser;
service.createProfile = createProfile;
service.createEmployeeProfile = createEmployeeProfile;
service.updateUser = updateUser;
service.updateProfile = updateProfile;
service.updateEmployeeProfile = updateEmployeeProfile;
service.deleteUser = _deleteUser;
service.deleteProfile = _deleteProfile;
service.deactiveUser = deactiveUser;
service.activeUser = activeUser;
service.deactiveEmployee = deactiveEmployee;
service.setStatus = setStatus;
service.setDate = setDate;
service.search = searchByEmployeeProfile;

module.exports = service;



function getAll() {
    let deferred = Q.defer();

    Users.find({
        isDelete: false,
        role: "ROLE_Employee"
    }, (err, users) => {

        if (err) deferred.reject(err.name + ': ' + err.message);

        var userMap = {};

        users.forEach((user) => userMap[user._id] = user);
        users = _.map(users, function (user) {
            return _.omit(user, 'password');
        });
        deferred.resolve(users);
        // res.send(users);
    })
    return deferred.promise;
}



function userById() {
    let deferred = Q.defer();
    Users.find({
            username: req.params.id
        },
        (err, users) => {
            if (err) throw err;
            res.send(users);
        })

}

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
    Users.findById({
        _id: _id
    }).select("-password -created_at -updated_at -isDelete -role -__v").populate([{
        path: 'profile',
        model: 'Profiles',
        select: '-_id -owner -__v'
    }, {
        path: 'employeeprofile',
        model: 'EmployeeProfiles',
        select: '-_id -age -sex -address -isDelete -owner -__v'
    }]).exec((err, user) => {

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

function getMetaById(_id) {
    let deferred = Q.defer();

    EmployeeProfiles.findById({
        owner: _id
    }, function (err, profile) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (profile) {
            // return user (without hashed password)
            deferred.resolve(profile);
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function createUser(userParam) {
    let deferred = Q.defer();

    Users.findOne({
            username: userParam.username
        },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // username already exists
                // deferred.reject('Username "' + userParam.username + '" is already taken');
                deferred.reject('Tên tài khoản "' + userParam.username + '" đã có rồi');
            } else {
                Profiles.findOne({
                        email: userParam.email
                    },
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
                                role: "ROLE_Employee",
                                created_at: new Date,
                                updated_at: new Date,
                                isDelete: false
                            });
                            newUser.save((err, user) => {
                                if (err) deferred.reject(err.name + ': ' + err.message);
                                // deferred.resolve('Success');
                                createProfile(userParam).then(
                                    // deferred.resolve(user._id)

                                    createEmployeeProfile(userParam).then(
                                        deferred.resolve(user._id)
                                    ).catch(err => {
                                        deferred.reject(err);
                                    })
                                ).catch(err => {
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

    Users.findOne({
        username: userParam.username
    }, (err, user) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }
        let profile = new Profiles({
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
            Users.findOneAndUpdate({
                username: userParam.username
            }, {
                profile: profile._id
            }, (err, user) => {
                if (err) deferred.reject(err.name + ': ' + err.message);
                //  deferred.resolve(userParam.id);
            });
        });
    });
    return deferred.promise;
}

function createEmployeeProfile(userParam) {
    let deferred = Q.defer();

    Users.findOne({
        username: userParam.username
    }, (err, user) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }
        let date = new Date();
        let monthApply = date.getMonth() + 2;
        let year = date.getFullYear();
        if ((date.getMonth() + 1) === 12) {
            monthApply = 1;
            year++;
        }
        let salaries = Object.assign({
            date: date,
            monthApply: date.getMonth() + 2,
            yearApply: date.getFullYear(),
            salary: userParam.salary
        });
        let profile = new EmployeeProfiles({
            id_number: userParam.id_number,
            home_town: userParam.home_town,
            // working_place: userParam.working_place,
            address: userParam.address,
            age: userParam.age,
            sex: userParam.gender,
            job: userParam.job,
            education: userParam.education,
            division: userParam.division,
            salary: userParam.salary,
            salaries: salaries,
            day_off: [],
            isDelete: false,
            leave: false,
            owner: user._id
        })
        profile.save((err, profile) => {
            if (err) deferred.reject(err.name + ': ' + err.message);
            // deferred.resolve(userParam.id);
            Users.findOneAndUpdate({
                username: userParam.username
            }, {
                employeeprofile: profile._id
            }, (err, user) => {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve(userParam.id);
            });
        });
    });
    return deferred.promise;
}

function updateUser(userParam) {
    let deferred = Q.defer();

    Users.findOne({
        _id: userParam.id
    }, (err, user) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }

        var info = {
            username: userParam.username,
            location: {
                latitude: userParam.lat,
                longitude: userParam.lng
            }
        };

        if (userParam.password)
            info.password = bcrypt.hashSync(userParam.password, 10);

        user.update(info, (err) => {
            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            }
        });
    });
    return deferred.promise;


}

function updateEmployeeProfile(userParam) {
    let deferred = Q.defer();
    // let profile = Profiles.find({owner: id});
    EmployeeProfiles.findOne({
        owner: userParam.id
    }, (err, profile) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }


        let newProfile = JSON.parse(JSON.stringify(profile));
        let currentSalaries = [];
        
        currentSalaries = newProfile.salaries ? newProfile.salaries : [];

        let date = new Date();
        // let monthApply = date.getMonth() + 2;
        // let year = date.getFullYear();
        // if ((date.getMonth() + 1) === 12) {
        //     monthApply = 1;
        //     year++;
        // }
        let monthApply = date.getMonth() + 1;
        let year = date.getFullYear();
        let salaries = Object.assign({
            date: date,
            monthApply: date.getMonth() + 2,
            yearApply: date.getFullYear(),
            salary: userParam.salary
        });

        
        if (userParam.salary !== newProfile.salary)
            currentSalaries.push(salaries);
        
        let set = {
            address: userParam.address,
            age: userParam.age,
            sex: userParam.gender,
            status: userParam.status,
            day_off: userParam.dayOff,
            job: userParam.job,
            education: userParam.education,
            division: userParam.division,
            salary: userParam.salary,
            salaries: currentSalaries
        }

        profile.update(set, (err, doc) => {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve(userParam.id);
        });
    });

    return deferred.promise;
}

function updateProfile(userParam) {
    let deferred = Q.defer();
    // let profile = Profiles.find({owner: id});
    Profiles.findOne({
        owner: userParam.id
    }, (err, profile) => {
        if (err) {
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

    Users.findOne({
        _id: id
    }, (err, user) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }

        let info = {
            isDelete: true
        };

        user.update(info, (err) => {
            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            }
            deferred.resolve('SUCCESS');
        });

    });
    return deferred.promise;
}

function activeUser(id) {

    let deferred = Q.defer();

    Users.findOne({
        _id: id
    }, (err, user) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }

        let info = {
            isDelete: false
        };

        user.update(info, (err) => {
            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            }
            deferred.resolve('SUCCESS');
        });

    });
    return deferred.promise;
}

function deactiveEmployee(id) {

    let deferred = Q.defer();

    EmployeeProfiles.findOne({
        owner: id
    }, (err, employee) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }

        let info = {
            isDelete: true,
        };

        employee.update(info, (err) => {
            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            }
            deferred.resolve('SUCCESS');
        });

    });
    return deferred.promise;
}

function setStatus(employeeParam) {

    let deferred = Q.defer();

    EmployeeProfiles.findOne({
        owner: employeeParam.id
    }, (err, employee) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }

        let info = {
            status: employeeParam.status,
        };

        employee.update(info, (err) => {
            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            }
            deferred.resolve('SUCCESS');
        });

    });
    return deferred.promise;
}

function setDate(employeeParam) {

    let deferred = Q.defer();

    EmployeeProfiles.findOne({
        owner: employeeParam.id
    }, (err, employee) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }

        let info = {
            busy_dates: employeeParam.busyDates,
        };

        employee.update(info, (err) => {
            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            }
            deferred.resolve('SUCCESS');
        });

    });
    return deferred.promise;
}

function getAllEmployees() {
    let deferred = Q.defer();
    Users.find({
        isDelete: false,
        role: "ROLE_Employee"
    }).sort('-created_at').select("-password -updated_at -isDelete -role -__v").populate([{
        path: 'profile',
        model: 'Profiles',
        select: '-_id -owner -__v'
    }, {
        path: 'employeeprofile',
        model: 'EmployeeProfiles',
        select: '-_id -age -sex -address -certification -rate -retribution -isDelete -owner -__v'
    }]).exec((err, users) => {

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

function searchByEmployeeProfile(searchCriteria) {
    let deferred = Q.defer();
    let query = {
        isDelete: false,
        status: "free",
    };
    if (searchCriteria.career != "")
        query.career = searchCriteria.career;
    if (searchCriteria.type != "")
        query.type = searchCriteria.type;
    if (searchCriteria.hospital != "")
        query.hospital = searchCriteria.hospital;
    EmployeeProfiles.find(query).select("-_id -age -sex -address -certification -rate -retribution -isDelete -__v").populate({
        path: 'owner',
        model: 'Users',
        select: '-password -created_at -updated_at -isDelete -role -__v',
        populate: {
            path: 'profile',
            model: 'Profiles',
            select: '-_id -owner -__v'
        }
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
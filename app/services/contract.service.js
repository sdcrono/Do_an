const Contracts = require('mongoose').model('Contracts'),
    Details = require('mongoose').model('ContractDetails');
    Schedule = require('node-schedule');

const _ = require('lodash');
    jwt = require('jsonwebtoken')
    bcrypt = require('bcryptjs');
    Q = require('q');

var service = {};
 
service.getAll = getAll;
service.getAllCheck = getAllCheck;
service.getAllCustom = getAllCustom;
service.getById = getById;
service.createContract = createContract;
service.approve = approve;
service.reject = reject;
// service.createProfile = createProfile;
// service.updateUser = updateUser;
// service.updateProfile = updateProfile;
// service.deleteUser = _deleteUser;
// service.deleteProfile = _deleteProfile;
// service.search = search;
// service.deactiveUser = deactiveUser;
// service.activeUser = activeUser;
 
module.exports = service;


function getAll() {
    let deferred = Q.defer();
 
    Contracts.find().select("-__v").populate([{
                path: 'userId',
                model: 'Users',
                select: '-password -created_at -updated_at -isDelete -role -__v',
                populate: {
                    path: 'profile',
                    model: 'Profiles',
                    select: '-_id -owner -__v'
                }
            },{           
                path: 'nurseId',
                model: 'Users',
                select: '-password -created_at -updated_at -isDelete -role -__v',
                populate: [{
                    path: 'profile',
                    model: 'Profiles',
                    select: '-_id -owner -__v'
                },{
                    path: 'nurseprofile',
                    model: 'NurseProfiles',
                    select: '-_id -age -sex -address -certification -rate -retribution -isDelete -owner -__v'
                }]
            },{
                path: 'detail',
                model: 'ContractDetails',
                select: '-_id -owner -__v',
                populate: {
                    path: 'profile',
                    model: 'Profiles',
                    select: '-_id -owner -__v'
                }
            }]).exec((err, contracts) => {

                if (err) deferred.reject(err.name + ': ' + err.message);
                
                // var userMap = {};

                // users.forEach((user) => userMap[user._id] = user );
                // users = _.map(users, function (user) {
                //     return _.omit(user, 'password');
                // });
                deferred.resolve(contracts);
                // res.send(users);
            })
    return deferred.promise;
}

function getAllCheck() {
    let deferred = Q.defer();
 
    Contracts.find({status: "check"}).select("-__v").populate([{
                path: 'userId',
                model: 'Users',
                select: '-password -created_at -updated_at -isDelete -role -__v',
                populate: {
                    path: 'profile',
                    model: 'Profiles',
                    select: '-_id -owner -__v'
                }
            },{           
                path: 'nurseId',
                model: 'Users',
                select: '-password -created_at -updated_at -isDelete -role -__v',
                populate: [{
                    path: 'profile',
                    model: 'Profiles',
                    select: '-_id -owner -__v'
                },{
                    path: 'nurseprofile',
                    model: 'NurseProfiles',
                    select: '-_id -age -sex -address -certification -rate -retribution -isDelete -owner -__v'
                }]
            },{
                path: 'detail',
                model: 'ContractDetails',
                select: '-_id -owner -__v',
                populate: {
                    path: 'profile',
                    model: 'Profiles',
                    select: '-_id -owner -__v'
                }
            }]).exec((err, contracts) => {

                if (err) deferred.reject(err.name + ': ' + err.message);
                
                // var userMap = {};

                // users.forEach((user) => userMap[user._id] = user );
                // users = _.map(users, function (user) {
                //     return _.omit(user, 'password');
                // });
                deferred.resolve(contracts);
                // res.send(users);
            })
    return deferred.promise;
}

function getAllCustom(searchCriteria) {
    let deferred = Q.defer();
    let query = {};
    if (searchCriteria.status != "" && searchCriteria.status != "all") {
        query.status = searchCriteria.status;
        if (searchCriteria.role == "ROLE_User")
            query.userId = searchCriteria.id;
        if (searchCriteria.role == "ROLE_Nurse")
            query.nurseId = searchCriteria.id;
        Contracts.find(query).select("-__v").populate([{
            path: 'userId',
            model: 'Users',
            select: '-password -created_at -updated_at -isDelete -role -__v',
            populate: {
                path: 'profile',
                model: 'Profiles',
                select: '-_id -owner -__v'
            }
        },{           
            path: 'nurseId',
            model: 'Users',
            select: '-password -created_at -updated_at -isDelete -role -__v',
            populate: [{
                path: 'profile',
                model: 'Profiles',
                select: '-_id -owner -__v'
            },{
                path: 'nurseprofile',
                model: 'NurseProfiles',
                select: '-_id -age -sex -address -certification -rate -retribution -isDelete -owner -__v'
            }]
        },{
            path: 'detail',
            model: 'ContractDetails',
            select: '-_id -owner -__v',
            populate: {
                path: 'profile',
                model: 'Profiles',
                select: '-_id -owner -__v'
            }
        }]).exec((err, contracts) => {

            if (err) deferred.reject(err.name + ': ' + err.message);
            
            // var userMap = {};

            // users.forEach((user) => userMap[user._id] = user );
            // users = _.map(users, function (user) {
            //     return _.omit(user, 'password');
            // });
            deferred.resolve(contracts);
            // res.send(users);
        })        
    }
    else {
        if (searchCriteria.role == "ROLE_Admin")
            Contracts.find().select("-__v").populate([{
                path: 'userId',
                model: 'Users',
                select: '-password -created_at -updated_at -isDelete -role -__v',
                populate: {
                    path: 'profile',
                    model: 'Profiles',
                    select: '-_id -owner -__v'
                }
            },{           
                path: 'nurseId',
                model: 'Users',
                select: '-password -created_at -updated_at -isDelete -role -__v',
                populate: [{
                    path: 'profile',
                    model: 'Profiles',
                    select: '-_id -owner -__v'
                },{
                    path: 'nurseprofile',
                    model: 'NurseProfiles',
                    select: '-_id -age -sex -address -certification -rate -retribution -isDelete -owner -__v'
                }]
            },{
                path: 'detail',
                model: 'ContractDetails',
                select: '-_id -owner -__v',
                populate: {
                    path: 'profile',
                    model: 'Profiles',
                    select: '-_id -owner -__v'
                }
            }]).exec((err, contracts) => {

                if (err) deferred.reject(err.name + ': ' + err.message);
                
                // var userMap = {};

                // users.forEach((user) => userMap[user._id] = user );
                // users = _.map(users, function (user) {
                //     return _.omit(user, 'password');
                // });
                deferred.resolve(contracts);
                // res.send(users);
            })
        else {
            if (searchCriteria.role == "ROLE_User")
                query.userId = searchCriteria.id;
            if (searchCriteria.role == "ROLE_Nurse")
                query.nurseId = searchCriteria.id; 
            Contracts.find(query).select("-__v").populate([{
                path: 'userId',
                model: 'Users',
                select: '-password -created_at -updated_at -isDelete -role -__v',
                populate: {
                    path: 'profile',
                    model: 'Profiles',
                    select: '-_id -owner -__v'
                }
            },{           
                path: 'nurseId',
                model: 'Users',
                select: '-password -created_at -updated_at -isDelete -role -__v',
                populate: [{
                    path: 'profile',
                    model: 'Profiles',
                    select: '-_id -owner -__v'
                },{
                    path: 'nurseprofile',
                    model: 'NurseProfiles',
                    select: '-_id -age -sex -address -certification -rate -retribution -isDelete -owner -__v'
                }]
            },{
                path: 'detail',
                model: 'ContractDetails',
                select: '-_id -owner -__v',
                populate: {
                    path: 'profile',
                    model: 'Profiles',
                    select: '-_id -owner -__v'
                }
            }]).exec((err, contracts) => {

                if (err) deferred.reject(err.name + ': ' + err.message);
                
                // var userMap = {};

                // users.forEach((user) => userMap[user._id] = user );
                // users = _.map(users, function (user) {
                //     return _.omit(user, 'password');
                // });
                deferred.resolve(contracts);
                // res.send(users);
            })                 
        }     

    }
       
    return deferred.promise;
}

function getById(_id) {
    let deferred = Q.defer();
 
    Contracts.findById({ _id: _id }).select("-__v").populate([{
                path: 'userId',
                model: 'Users',
                select: '-password -created_at -updated_at -isDelete -role -__v',
                populate: {
                    path: 'profile',
                    model: 'Profiles',
                    select: '-_id -owner -__v'
                }
            },{           
                path: 'nurseId',
                model: 'Users',
                select: '-password -created_at -updated_at -isDelete -role -__v',
                populate: [{
                    path: 'profile',
                    model: 'Profiles',
                    select: '-_id -owner -__v'
                },{
                    path: 'nurseprofile',
                    model: 'NurseProfiles',
                    select: '-_id -age -sex -address -certification -rate -retribution -isDelete -owner -__v'
                }]
            },{
                path: 'detail',
                model: 'ContractDetails',
                select: '-_id -owner -__v',
                populate: {
                    path: 'profile',
                    model: 'Profiles',
                    select: '-_id -owner -__v'
                }
            }]).exec((err, contracts) => {

                if (err) deferred.reject(err.name + ': ' + err.message);
                
                // var userMap = {};

                // users.forEach((user) => userMap[user._id] = user );
                // users = _.map(users, function (user) {
                //     return _.omit(user, 'password');
                // });
                deferred.resolve(contracts);
                // res.send(users);
            })
 
    return deferred.promise;
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

function createContract(contractParam) {
    let deferred = Q.defer();

    let newContract = new Contracts({
        userId: contractParam.userId,
        nurseId: contractParam.nurseId,
        created_at: contractParam.createdAt,
        end_at: contractParam.endAt,
        patientName: contractParam.patientName,
        patientAge: contractParam.patientAge,
        address: contractParam.address,
        location: {
            latitude: contractParam.location.latitude,
            longitude: contractParam.location.longitude
        },
        payment: contractParam.payment,
        status: "check"
    });        
    newContract.save((err, contract) => {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(contract._id);
        var contractId = contract._id;
        let newContractDetail = new Details({
            jobDescription: contractParam.detail.jobDescription,
            dates: contractParam.detail.dates,
            owner: contract._id
        });
        newContractDetail.save((err, detail) => {
            Contracts.findOneAndUpdate({
                // userId: contractParam.userId,
                // NurseId: contractParam.nurseId,
                // created_at: contractParam.created_at
                _id: contractId
            }, {detail: detail._id}, (err, contract) => {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve(contractId);
                let j = Schedule.scheduleJob(contract.created_at, () => {
                    if (contract !== undefined)
                        if (contract.status === 'check')  {
                            let info = {
                                status: "reject"
                            };
                            contract.update(info, (err) => {
                                if (err) { deferred.reject(err.name + ': ' + err.message); }
                                console.log('thành công');
                            });                    
                        }
                });
            });
        });
        // createDetail(contractParam);
    });
                                

    return deferred.promise;


}

function approve(id) {

    let deferred = Q.defer();

    Contracts.findOne({_id: id}, (err, contract) => {
        if (err){
            deferred.reject(err.name + ': ' + err.message);
        }

        let info = {
            status: "approve"
        };

        contract.update(info, (err) => {
            if (err) { deferred.reject(err.name + ': ' + err.message); }
            deferred.resolve(id);
            console.log("End time: "+ contract.end_at);
            // let d = new Date("8/5/2017");
            // d.setHours(10);
            // d.setMinutes(17);
            // d.setSeconds(0);
            let j = Schedule.scheduleJob(contract.end_at, () => {
                if (contract !== undefined) {
                    if (contract.status === 'check')  {

                        let info = {
                            status: "finish"
                        };                
                        contract.update(info, (err) => {
                            if (err) { deferred.reject(err.name + ': ' + err.message); }
                            console.log('thành công');
                        });

                    }
                }

            });
        });

    });
    return deferred.promise;
}

function reject(id) {

    let deferred = Q.defer();

    Contracts.findOne({_id: id}, (err, contract) => {
        if (err){
            deferred.reject(err.name + ': ' + err.message);
        }

        let info = {
            status: "reject"
        };

        contract.update(info, (err) => {
            if (err) { deferred.reject(err.name + ': ' + err.message); }
            deferred.resolve('SUCCESS');
        });

    });
    return deferred.promise;
}

// function createProfile(userParam) {
//     let deferred = Q.defer();

//     Users.findOne({username: userParam.username}, (err, user) => {
//         if(err){
//             deferred.reject(err.name + ': ' + err.message);
//         }
//         let profile = new Profiles ({
//             name: {
//                 first: userParam.firstname,
//                 last: userParam.lastname
//             },
//             email: userParam.email,
//             phone: userParam.phone,
//             age: userParam.age,	
//             sex: userParam.gender,
//             address: userParam.address,
//             owner: user._id 
//         })

//         // Profiles.findOneAndUpdate({owner: user._id}, profile, {upsert:true}, (err, doc) => {
//         //     if (err) deferred.reject(err.name + ': ' + err.message);
//         //     deferred.resolve('Success2');
//         // });
//         profile.save((err, profile) => {
//             if (err) deferred.reject(err.name + ': ' + err.message);
//                 deferred.resolve('Success2');
//                 Users.findOneAndUpdate({username: userParam.username}, {profile: profile._id}, (err, user) => {
//                     if (err) deferred.reject(err.name + ': ' + err.message);
//                      deferred.resolve('Success4');
//                 });
//         });
//     });
//     return deferred.promise;
// }

// function updateUser(userParam) {
//     let deferred = Q.defer();
//     Users.findOne({_id: userParam.id}, (err, user) => {
//         if (err){
//             deferred.reject(err.name + ': ' + err.message);
//         }

//         var info = {
//             username: userParam.username,
//             location: {
//                 latitude: userParam.lat,
//                 longitude: userParam.lng
//             }            
//         };

//         if(userParam.password)
//             info.password = bcrypt.hashSync(userParam.password, 10);

//         user.update(info, (err) => {
//             if (err) { deferred.reject(err.name + ': ' + err.message); }
//         });
//     });
//     return deferred.promise;


// }

// function updateProfile(userParam) {
//     let deferred = Q.defer();
//     // let profile = Profiles.find({owner: id});
//     Profiles.findOne({owner: userParam.id}, (err, profile) => {
//         if (err){
//             deferred.reject(err.name + ': ' + err.message);
//         }   
//         let set = {
//             name: {
//                 first: userParam.firstname,
//                 last: userParam.lastname
//             },
//             email: userParam.email,
//             phone: userParam.phone,
//             age: userParam.age,	
//             sex: userParam.gender,
//             address: userParam.address
//         }

//         profile.update(set, (err, doc) => {
//             if (err) deferred.reject(err.name + ': ' + err.message);
//             deferred.resolve('Success2');
//         });
//     });

//     return deferred.promise;
// }

// function _deleteUser(id) {

//     let deferred = Q.defer();

//     Users.findByIdAndRemove(id, (err) => {
//         if (err) deferred.reject(err.name + ': ' + err.message);
//         deferred.resolve('SUCCESS');
//     })
//     return deferred.promise;
// }

// function _deleteProfile(id) {

//     let deferred = Q.defer();

//     Profiles.findByIdAndRemove(id, (err) => {
//         if (err) deferred.reject(err.name + ': ' + err.message);
//         deferred.resolve('SUCCESS');
//     })
//     return deferred.promise;
// }

// function deactiveUser(id) {

//     let deferred = Q.defer();

//     Users.findOne({_id: id}, (err, user) => {
//         if (err){
//             deferred.reject(err.name + ': ' + err.message);
//         }

//         let info = {
//             isDelete: true
//         };

//         user.update(info, (err) => {
//             if (err) { deferred.reject(err.name + ': ' + err.message); }
//             deferred.resolve('SUCCESS');
//         });

//     });
//     return deferred.promise;
// }

// function activeUser(id) {

//     let deferred = Q.defer();

//     Users.findOne({_id: id}, (err, user) => {
//         if (err){
//             deferred.reject(err.name + ': ' + err.message);
//         }

//         let info = {
//             isDelete: false
//         };

//         user.update(info, (err) => {
//             if (err) { deferred.reject(err.name + ': ' + err.message); }
//             deferred.resolve('SUCCESS');
//         });

//     });
//     return deferred.promise;
// }
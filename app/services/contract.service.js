const Contracts = require('mongoose').model('Contracts'),
    Details = require('mongoose').model('ContractDetails');
Users = require('mongoose').model('Users'),
    NurseProfiles = require('mongoose').model('NurseProfiles'),
    Schedule = require('node-schedule');

const _ = require('lodash');
jwt = require('jsonwebtoken')
bcrypt = require('bcryptjs');
Q = require('q');
gcm = require('node-gcm');
constants = require('../constants/constants.json');
gcmApiKey = constants.gcm_api_key; // GCM API KEY OF YOUR GOOGLE CONSOLE PROJECT




const tmService = require('./tm.service');
const nurseService = require('./nurse.service');
const userService = require('./user.service');

var service = {};

service.getAll = getAll;
service.getAllCheck = getAllCheck;
service.getAllCustom = getAllCustom;
service.getById = getById;
service.createContract = createContract;
service.createTimeContract = createTimeContract;
service.approve = approve;
service.reject = reject;
service.finish = finish;
service.done = done;
service.off = off;
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
    }, {
        path: 'nurseId',
        model: 'Users',
        select: '-password -created_at -updated_at -isDelete -role -__v',
        populate: [{
            path: 'profile',
            model: 'Profiles',
            select: '-_id -owner -__v'
        }, {
            path: 'nurseprofile',
            model: 'NurseProfiles',
            select: '-_id -age -sex -address -certification -rate -retribution -isDelete -owner -__v'
        }]
    }, {
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

    Contracts.find({
        status: "check"
    }).select("-__v").populate([{
        path: 'userId',
        model: 'Users',
        select: '-password -created_at -updated_at -isDelete -role -__v',
        populate: {
            path: 'profile',
            model: 'Profiles',
            select: '-_id -owner -__v'
        }
    }, {
        path: 'nurseId',
        model: 'Users',
        select: '-password -created_at -updated_at -isDelete -role -__v',
        populate: [{
            path: 'profile',
            model: 'Profiles',
            select: '-_id -owner -__v'
        }, {
            path: 'nurseprofile',
            model: 'NurseProfiles',
            select: '-_id -age -sex -address -certification -rate -retribution -isDelete -owner -__v'
        }]
    }, {
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
        Contracts.find(query).sort('-created_at').select("-__v").populate([{
            path: 'userId',
            model: 'Users',
            select: '-password -created_at -updated_at -isDelete -role -__v',
            populate: {
                path: 'profile',
                model: 'Profiles',
                select: '-_id -owner -__v'
            }
        }, {
            path: 'nurseId',
            model: 'Users',
            select: '-password -created_at -updated_at -isDelete -role -__v',
            populate: [{
                path: 'profile',
                model: 'Profiles',
                select: '-_id -owner -__v'
            }, {
                path: 'nurseprofile',
                model: 'NurseProfiles',
                select: '-_id -age -sex -address -certification -rate -retribution -isDelete -owner -__v'
            }]
        }, {
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
    } else {
        if (searchCriteria.role == "ROLE_Admin")
            Contracts.find().sort('-created_at').select("-__v").populate([{
                path: 'userId',
                model: 'Users',
                select: '-password -created_at -updated_at -isDelete -role -__v',
                populate: {
                    path: 'profile',
                    model: 'Profiles',
                    select: '-_id -owner -__v'
                }
            }, {
                path: 'nurseId',
                model: 'Users',
                select: '-password -created_at -updated_at -isDelete -role -__v',
                populate: [{
                    path: 'profile',
                    model: 'Profiles',
                    select: '-_id -owner -__v'
                }, {
                    path: 'nurseprofile',
                    model: 'NurseProfiles',
                    select: '-_id -age -sex -address -certification -rate -retribution -isDelete -owner -__v'
                }]
            }, {
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
            Contracts.find(query).sort('-created_at').select("-__v").populate([{
                path: 'userId',
                model: 'Users',
                select: '-password -created_at -updated_at -isDelete -role -__v',
                populate: {
                    path: 'profile',
                    model: 'Profiles',
                    select: '-_id -owner -__v'
                }
            }, {
                path: 'nurseId',
                model: 'Users',
                select: '-password -created_at -updated_at -isDelete -role -__v',
                populate: [{
                    path: 'profile',
                    model: 'Profiles',
                    select: '-_id -owner -__v'
                }, {
                    path: 'nurseprofile',
                    model: 'NurseProfiles',
                    select: '-_id -age -sex -address -certification -rate -retribution -isDelete -owner -__v'
                }]
            }, {
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

    Contracts.findById({
        _id: _id
    }).select("-__v").populate([{
        path: 'userId',
        model: 'Users',
        select: '-password -created_at -updated_at -isDelete -role -__v',
        populate: {
            path: 'profile',
            model: 'Profiles',
            select: '-_id -owner -__v'
        }
    }, {
        path: 'nurseId',
        model: 'Users',
        select: '-password -created_at -updated_at -isDelete -role -__v',
        populate: [{
            path: 'profile',
            model: 'Profiles',
            select: '-_id -owner -__v'
        }, {
            path: 'nurseprofile',
            model: 'NurseProfiles',
            select: '-_id -age -sex -address -certification -rate -retribution -isDelete -owner -__v'
        }]
    }, {
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

    let workingDateSymbols = [];
    let workingDates = [];
    let workingDatesWithOtherDays = [];
    let workingDatesWithoutOtherDays = [];
    contractParam.detail.dates.forEach(date => {
        switch (date.date) {
            case 'T2':
                workingDateSymbols.push(1);
                break;
            case 'T3':
                workingDateSymbols.push(2);
                break;
            case 'T4':
                workingDateSymbols.push(3);
                break;
            case 'T5':
                workingDateSymbols.push(4);
                break;
            case 'T6':
                workingDateSymbols.push(5);
                break;
            case 'T7':
                workingDateSymbols.push(6);
                break;
            case 'CN':
                workingDateSymbols.push(0);
                break;
        }
    });
    //lay 2 moc thoi gian bat dau ket thuc
    let startDate = new Date(contractParam.startAt);
    let endDate = new Date(contractParam.endAt);
    //tao ra 1 object bao gom 2 phan tu la 2 mang: 1 mang la cac ngay lam viec da loc. 1 mang la so lan moi ngay trong tuan phai lam viec (vd: t2:2, t3:0, ..)
    workingDatesWithOtherDays = tmService.filterWeekDays(tmService.getDates(startDate, endDate), workingDateSymbols);
    //tao 1 mang luu nhung object bao gom ngay lam va trang thai lam viec 0: binh thuong, 1: da lam, -1: nghi
    workingDatesWithOtherDays.numberEachWeekDays.forEach(day => {
        if (day > 0) workingDatesWithoutOtherDays.push(day)
    })

    let totalPayment = 0;
    //tao 1 bien để tang so ngay trong tuan làm việc
    let numberOfDay = 0;
    //tinh tong tien bang cach cong don so ngay la trong moi thu * phi tra TRONG ngay do (ko phai core)
    workingDatesWithoutOtherDays.forEach(day => {
        totalPayment += day * contractParam.paymentEachDays[numberOfDay];
        numberOfDay++
    })
    numberOfDay--;
    //tao 1 bien dem de ap so tien tra cua ngay trong tuan khop voi moi ngay trong tuan 
    let count = 0
    //tao 1 mang chi luu nhung so lan ngay co lam viec, ngay ko lam viec bo qua
    workingDatesWithOtherDays.weekDays.forEach(day => {
        workingDates.push({
            date: day,
            process: 0,
            fee: contractParam.paymentEachDays[count]
        });
        count++;
        if (count > numberOfDay) {
            count = 0;
        }
    })
    let newContract = new Contracts({
        userId: contractParam.userId,
        nurseId: contractParam.nurseId,
        created_at: contractParam.createdAt,
        start_at: contractParam.startAt,
        end_at: contractParam.endAt,
        patientName: contractParam.patientName,
        patientAge: contractParam.patientAge,
        address: contractParam.address,
        location: {
            latitude: contractParam.location.latitude,
            longitude: contractParam.location.longitude
        },
        district: contractParam.district,
        workingDates: workingDates,
        payment: contractParam.payment,
        corePayment: contractParam.corePayment,
        totalPayment: totalPayment,
        nurseNetReceive: 0,
        companyNetReceive: 0,
        status: "check"
    });
    newContract.save((err, contract) => {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(contract._id);
        var contractId = contract._id;
        let newContractDetail = new Details({
            jobDescription: contractParam.detail.jobDescription,
            dates: contractParam.detail.dates,
            // workingDates: workingDates,
            owner: contract._id
        });
        newContractDetail.save((err, detail) => {
            Contracts.findOneAndUpdate({
                _id: contractId
            }, {
                detail: detail._id
            }, (err, contract) => {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve(contractId);


                let nurse = nurseService.getById(contractParam.nurseId).then(nurse => {
                    //salary se la phan luong hop dong trong thang hien tai dieu duong do co
                    //nurseSalary là toan bo luong hop dong
                    let newNurse = JSON.parse(JSON.stringify(nurse));
                    let newSalary = [],
                        nurseSalary;
                    nurseSalary = newNurse.nurseprofile.salary ? newNurse.nurseprofile.salary : [];

                    var device_tokens = []; //create array for storing device tokens
                    
                    var retry_times = 4; //the number of times to retry sending the message if it fails
                    var sender = new gcm.Sender(gcmApiKey); //create a new sender
                    var message = new gcm.Message(); //create a new message
                    message.addData('title', 'New Request');
                    message.addData('message', "You received a new request");
                    message.addData('sound', 'default');
                    message.collapseKey = 'Testing Push'; //grouping messages
                    message.delayWhileIdle = true; //delay sending while receiving device is offline
                    message.timeToLive = 15; //number of seconds to keep the message on 
                    //server if the device is offline
                    
                    //Take the registration id(lengthy string) that you logged 
                    //in your ionic v2 app and update device_tokens[0] with it for testing.
                    //Later save device tokens to db and 
                    //get back all tokens and push to multiple devices
                    device_tokens = newNurse.registrationId;
                    sender.send(message, device_tokens, retry_times, function (result) {
                        console.log('push sent to: ' + device_tokens);
                        // res.status(200).send('Pushed notification ' + device_tokens);
                    }, function (err) {
                        // res.status(500).send('failed to push notification ');
                        console.log(err);
                    });

                });

                // let sender = new gcm.Sender(constants.gcm_api_key);
                
                // let message = new gcm.Message({
                //     notification: {
                //         title: "Hello Wolrd!",
                //         icon: "your_icon_name",
                //         body: "Here is a notification's body"
                //     },
                // });
                

                let j = Schedule.scheduleJob(contract.start_at, () => {
                    if (contract !== undefined)
                        if (contract.status === 'check') {
                            let info = {
                                status: "reject"
                            };
                            contract.update(info, (err) => {
                                if (err) {
                                    deferred.reject(err.name + ': ' + err.message);
                                }
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

function createTimeContract(contractParam) {
    let deferred = Q.defer();
    let workingDateSymbols = [];
    let workingDatesWithOtherDays = [];
    let workingDatesWithoutOtherDays = [];
    contractParam.detail.dates.forEach(date => {
        switch (date.date) {
            case 'T2':
                workingDateSymbols.push(1);
                break;
            case 'T3':
                workingDateSymbols.push(2);
                break;
            case 'T4':
                workingDateSymbols.push(3);
                break;
            case 'T5':
                workingDateSymbols.push(4);
                break;
            case 'T6':
                workingDateSymbols.push(5);
                break;
            case 'T7':
                workingDateSymbols.push(6);
                break;
            case 'CN':
                workingDateSymbols.push(0);
                break;
        }
    });
    let startDate = new Date(contractParam.startAt);
    let endDate = new Date(contractParam.endAt);
    workingDatesWithOtherDays = tmService.filterWeekDays(tmService.getDates(startDate, endDate), workingDateSymbols);
    workingDatesWithOtherDays.numberEachWeekDays.forEach(day => {
        if (day > 0) workingDatesWithoutOtherDays.push(day)
    })
    let totalPayment = 0;
    let dem = 0;
    workingDatesWithoutOtherDays.forEach(day => {
        totalPayment += day * contractParam.paymentEachDays[dem];
        dem++
    })
    console.log(contractParam.paymentEachDays);

    deferred.resolve("contract._id")
    return deferred.promise;


}

function approve(id, nurseId) {

    let deferred = Q.defer();

    Contracts.findOne({
        _id: id
    }, (err, contract) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }

        let info = {
            status: "approve"
        };

        userService.getById(contract.userId).then(user => {
            //salary se la phan luong hop dong trong thang hien tai dieu duong do co
            //nurseSalary là toan bo luong hop dong
            let newUser = JSON.parse(JSON.stringify(user));
            var device_tokens = []; //create array for storing device tokens
            
            var retry_times = 4; //the number of times to retry sending the message if it fails
            var sender = new gcm.Sender(gcmApiKey); //create a new sender
            var message = new gcm.Message(); //create a new message
            message.addData('title', 'New Notification');
            message.addData('message', "Your request has been approved");
            message.addData('sound', 'default');
            message.collapseKey = 'Testing Push'; //grouping messages
            message.delayWhileIdle = true; //delay sending while receiving device is offline
            message.timeToLive = 15; //number of seconds to keep the message on 
            //server if the device is offline
            
            //Take the registration id(lengthy string) that you logged 
            //in your ionic v2 app and update device_tokens[0] with it for testing.
            //Later save device tokens to db and 
            //get back all tokens and push to multiple devices
            device_tokens = newUser.registrationId;
            sender.send(message, device_tokens, retry_times, function (result) {
                console.log('push sent to: ' + device_tokens);
                // res.status(200).send('Pushed notification ' + device_tokens);
            }, function (err) {
                // res.status(500).send('failed to push notification ');
                console.log(err);
            });

        });

        contract.update(info, (err) => {
            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            }
            deferred.resolve(id);
            console.log("End time: " + contract.end_at);
            // let d = new Date("8/5/2017");
            // d.setHours(10);
            // d.setMinutes(17);
            // d.setSeconds(0);
            let j = Schedule.scheduleJob(contract.end_at, () => {
                if (contract !== undefined) {
                    if (contract.status === 'check') {

                        let info = {
                            status: "finish"
                        };
                        contract.update(info, (err) => {
                            if (err) {
                                deferred.reject(err.name + ': ' + err.message);
                            }
                            console.log('thành công');
                        });

                    }
                }

            });
        });

    });
    return deferred.promise;
}

function done(contractInfo) {

    let deferred = Q.defer();

    Contracts.findOne({
        _id: contractInfo.contractId
    }, (err, contract) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }

        let startDate = new Date(contract.start_at);
        let endDate = new Date(contract.end_at);
        let workingDate = new Date(contractInfo.workingDate.date);
        let workingDateMonth = workingDate.getMonth() + 1;
        let workingDateYear = workingDate.getFullYear()
        console.log(contract)

        //lấy workingdates ra kiểm tra process
        let workingDates = contract.workingDates.map(workingDateInContract => {
            if (workingDateInContract.date.getTime() === workingDate.getTime()) {
                // if (workingDateInContract.process === -1) {
                //     contractInfo.workingDate.fee = contractInfo.workingDate.fee * 2;
                // }
                workingDateInContract.process = 1;
            }
            return workingDateInContract;
        })

        let info = {
            workingDates: workingDates
        };

        contract.update(info, (err) => {
            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            }
            // deferred.resolve(id);

            let nurse = nurseService.getById(contractInfo.nurseId).then(nurse => {
                //salary se la phan luong hop dong trong thang hien tai dieu duong do co
                //nurseSalary là toan bo luong hop dong
                let newNurse = JSON.parse(JSON.stringify(nurse));
                let newSalary = [],
                    nurseSalary;
                nurseSalary = newNurse.nurseprofile.salary ? newNurse.nurseprofile.salary : [];
                //1 bien kiem tra la thang do co nam trong day thang cong luong chua
                let had = false;
                nurseSalary.forEach(salary => {
                    if (salary.month === workingDateMonth && salary.year === workingDateYear) {
                        salary.payment += contractInfo.workingDate.fee;
                        had = true;
                    }
                    newSalary.push({
                        month: salary.month,
                        year: salary.year,
                        payment: salary.payment
                    });
                });
                // !newSalary || newSalary.length === 0 || !had && newSalary.push({
                //     month: startDate.getMonth() + 1,
                //     year: startDate.getFullYear(),
                //     payment: contractInfo.workingDate.fee
                // });
                if (!newSalary || newSalary.length === 0 || !had) {
                    newSalary.push({
                        month: workingDateMonth,
                        year: workingDateYear,
                        payment: contractInfo.workingDate.fee
                    });
                }
                NurseProfiles.findOne({
                    owner: contractInfo.nurseId
                }, (err, profile) => {
                    if (err) {
                        deferred.reject(err.name + ': ' + err.message);
                    }
                    let set = {
                        salary: newSalary
                    }

                    profile.update(set, (err, doc) => {
                        if (err) deferred.reject(err.name + ': ' + err.message);
                        deferred.resolve(contractInfo.contractId);
                    });
                });
                // nurse.update({salary: newSalary}, (err) => {
                //     if (err) {
                //         deferred.reject(err.name + ': ' + err.message);
                //     }
                //     deferred.resolve(contractInfo.contractId);
                // })
            });
        });
    });
    return deferred.promise;
}

function off(contractInfo) {

    let deferred = Q.defer();

    Contracts.findOne({
        _id: contractInfo.contractId
    }, (err, contract) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }

        let startDate = new Date(contract.start_at);
        let endDate = new Date(contract.end_at);
        let workingDate = new Date(contractInfo.workingDate.date);
        let workingDateMonth = workingDate.getMonth() + 1;
        let workingDateYear = workingDate.getFullYear()
        console.log(contract)

        //lấy workingdates ra kiểm tra process
        let workingDates = contract.workingDates.map(workingDateInContract => {
            if (workingDateInContract.date.getTime() === workingDate.getTime()) {
                if (workingDateInContract.process === 0) {
                    contractInfo.workingDate.fee = 0;
                }
                workingDateInContract.process = -1;
            }
            return workingDateInContract;
        })

        let info = {
            workingDates: workingDates
        };

        contract.update(info, (err) => {
            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            }
            // deferred.resolve(id);

            let nurse = nurseService.getById(contractInfo.nurseId).then(nurse => {
                //salary se la phan luong hop dong trong thang hien tai dieu duong do co
                //nurseSalary là toan bo luong hop dong
                let newNurse = JSON.parse(JSON.stringify(nurse));
                let newSalary = [],
                    nurseSalary;
                nurseSalary = newNurse.nurseprofile.salary ? newNurse.nurseprofile.salary : [];
                //1 bien kiem tra la thang do co nam trong day thang cong luong chua
                let had = false;
                nurseSalary.forEach(salary => {
                    if (salary.month === workingDateMonth && salary.year === workingDateYear) {
                        salary.payment -= contractInfo.workingDate.fee;
                        had = true;
                    }
                    newSalary.push({
                        month: salary.month,
                        year: salary.year,
                        payment: salary.payment
                    });
                });
                // !newSalary || newSalary.length === 0 || !had && newSalary.push({
                //     month: startDate.getMonth() + 1,
                //     year: startDate.getFullYear(),
                //     payment: contractInfo.workingDate.fee
                // });
                if (!newSalary || newSalary.length === 0 || !had) {
                    newSalary.push({
                        month: workingDateMonth,
                        year: workingDateYear,
                        payment: contractInfo.workingDate.fee
                    });
                }
                NurseProfiles.findOne({
                    owner: contractInfo.nurseId
                }, (err, profile) => {
                    if (err) {
                        deferred.reject(err.name + ': ' + err.message);
                    }
                    let set = {
                        salary: newSalary
                    }

                    profile.update(set, (err, doc) => {
                        if (err) deferred.reject(err.name + ': ' + err.message);
                        deferred.resolve(contractInfo.contractId);
                    });
                });
                // nurse.update({salary: newSalary}, (err) => {
                //     if (err) {
                //         deferred.reject(err.name + ': ' + err.message);
                //     }
                //     deferred.resolve(contractInfo.contractId);
                // })
            });
        });
    });
    return deferred.promise;
}

var IndexedArray = function (key) {
    this.key = key || 'id';
    this.data = [];
    this.index = {};
};

IndexedArray.prototype.addOrReplace = function (object) {
    var id = object[this.key],
        index = this.index[id];

    if (index === undefined) {
        index = this.data.length;
        this.index[id] = index;
    }
    this.data[index] = object;
};

function reject(id) {

    let deferred = Q.defer();

    Contracts.findOne({
        _id: id
    }, (err, contract) => {
        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }

        userService.getById(contract.userId).then(user => {
            //salary se la phan luong hop dong trong thang hien tai dieu duong do co
            //nurseSalary là toan bo luong hop dong
            let newUser = JSON.parse(JSON.stringify(user));
            var device_tokens = []; //create array for storing device tokens
            
            var retry_times = 4; //the number of times to retry sending the message if it fails
            var sender = new gcm.Sender(gcmApiKey); //create a new sender
            var message = new gcm.Message(); //create a new message
            message.addData('title', 'New Notification');
            message.addData('message', "Your request has been rejected");
            message.addData('sound', 'default');
            message.collapseKey = 'Testing Push'; //grouping messages
            message.delayWhileIdle = true; //delay sending while receiving device is offline
            message.timeToLive = 15; //number of seconds to keep the message on 
            //server if the device is offline
            
            //Take the registration id(lengthy string) that you logged 
            //in your ionic v2 app and update device_tokens[0] with it for testing.
            //Later save device tokens to db and 
            //get back all tokens and push to multiple devices
            device_tokens = newUser.registrationId;
            sender.send(message, device_tokens, retry_times, function (result) {
                console.log('push sent to: ' + device_tokens);
                // res.status(200).send('Pushed notification ' + device_tokens);
            }, function (err) {
                // res.status(500).send('failed to push notification ');
                console.log(err);
            });

        });

        let info = {
            status: "reject"
        };

        contract.update(info, (err) => {
            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            }
            deferred.resolve('SUCCESS');
        });

    });
    return deferred.promise;
}

function finish(id) {
    
        let deferred = Q.defer();
    
        Contracts.findOne({
            _id: id
        }, (err, contract) => {
            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            }
    
            // userService.getById(contract.userId).then(user => {
            //     //salary se la phan luong hop dong trong thang hien tai dieu duong do co
            //     //nurseSalary là toan bo luong hop dong
            //     let newUser = JSON.parse(JSON.stringify(user));
            //     var device_tokens = []; //create array for storing device tokens
                
            //     var retry_times = 4; //the number of times to retry sending the message if it fails
            //     var sender = new gcm.Sender(gcmApiKey); //create a new sender
            //     var message = new gcm.Message(); //create a new message
            //     message.addData('title', 'New Notification');
            //     message.addData('message', "Your request has been rejected");
            //     message.addData('sound', 'default');
            //     message.collapseKey = 'Testing Push'; //grouping messages
            //     message.delayWhileIdle = true; //delay sending while receiving device is offline
            //     message.timeToLive = 15; //number of seconds to keep the message on 
            //     //server if the device is offline
                
            //     //Take the registration id(lengthy string) that you logged 
            //     //in your ionic v2 app and update device_tokens[0] with it for testing.
            //     //Later save device tokens to db and 
            //     //get back all tokens and push to multiple devices
            //     device_tokens = newUser.registrationId;
            //     sender.send(message, device_tokens, retry_times, function (result) {
            //         console.log('push sent to: ' + device_tokens);
            //         // res.status(200).send('Pushed notification ' + device_tokens);
            //     }, function (err) {
            //         // res.status(500).send('failed to push notification ');
            //         console.log(err);
            //     });
    
            // });
    
            let info = {
                status: "finish"
            };
    
            contract.update(info, (err) => {
                if (err) {
                    deferred.reject(err.name + ': ' + err.message);
                }
                deferred.resolve('SUCCESS');
            });
    
        });
        return deferred.promise;
    }
const Users = require('../models/user.model');

exports.userById = (req, res) => 
        Users.find({ username: req.params.id },
        (err, users) => {
            if (err) throw err;
            res.send(users);
        })

exports.list = (req, res) => 
        Users.find({}, (err, users) => {
            var userMap = {};

            users.forEach((user) => userMap[user._id] = user );

            res.send(userMap);
        })

exports.upsert = (req, res) => {

        if (req.body.id) {
            Users.findByIdAndUpdate(req.body.id, { username: req.body.username, password: req.body.password,
                nurse: false, admin: false, updated_at: new Date}, (err, user) => {
                if (err) throw err;
                res.send('success');
            });
        }

        else {
            var newUser = Users({
                username: req.body.username,
                password: req.body.password,
                nurse: false,
                admin: false,
                created_at: new Date,
                updated_at: new Date
            });
            newUser.save((err, user) => {
                if (err) throw err;
                res.send('Success');
            });
        }

    }

exports.delete = (req, res) => 

        Users.findByIdAndRemove(req.body.id, (err) => {
            if (err) throw err;
            res.send('SUCCESS');
        })

exports.index = (req, res) => res.send("Api list")
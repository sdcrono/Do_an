// var Users = require('../models/userModel')

const Users = require('../controllers/user.controller'),
    Apis = require('../controllers/apiController');

module.exports = app => {

    // app.delete('/api/user', function(req, res) {

    //     Users.findByIdAndRemove(req.body.id, function(err) {
    //         if (err) throw err;
    //         res.send('SUCCESS');
    //     });
    // });

    app.route('/api/users').get(Users.getAll).post(Users.upsert).delete(Users.active);
    app.route('/api/users/del').post(Users.deactive);
    app.route('/api/users/:id').get(Users.getById);
    app.route('/api').get(Apis.index);

}
const Permissions = require('../controllers/rolePermissionController');

module.exports = app => {

    // app.delete('/api/user', function(req, res) {

    //     Users.findByIdAndRemove(req.body.id, function(err) {
    //         if (err) throw err;
    //         res.send('SUCCESS');
    //     });
    // });

    app.route('/api/permissions').get(Permissions.listPermission);

}
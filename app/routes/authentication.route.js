const Users = require('../controllers/user.controller'),
    Logins = require('../controllers/loginController'),
    passport = require('passport');

module.exports = app => {
    // app.route('/register').post(Users.insert);
    // app.route('/').get(Logins.index);
    app.route('/api/register')
        // .get(users.renderRegister)
        .post(Users.register);

    app.route('/login')
        // .get(users.renderLogin)
        .post(passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }));

    app.get('/logout', Users.logout);
    app.post('/api/authenticate', Users.authenticate);
}
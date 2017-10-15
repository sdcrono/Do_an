const express = require('express'),
	session = require('express-session'),
	passport = require('passport'),
	flash = require('connect-flash'),
    path = require('path'),
    cors = require('cors'),
    bodyParser = require('body-parser');

module.exports = () => {
    const app = express();

    app.use(cors());

    // // use JWT auth to secure the api, the token can be passed in the authorization header or querystring
    // app.use(expressJwt({
    //     secret: config.secret,
    //     getToken: function (req) {
    //         if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    //             return req.headers.authorization.split(' ')[1];
    //         } else if (req.query && req.query.token) {
    //             return req.query.token;
    //         }
    //         return null;
    //     }
    // }).unless({ path: ['/users/authenticate', '/users/register'] }));

    // app.use('/assets', express.static('../app/public'));
    app.use(express.static(path.join(__dirname, '../public/src')));

    app.set('view engine', 'ejs');

    app.use(bodyParser.json());

    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: 'OurSuperSecretCookiesSecret'
	}));

    app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());

    require('../app/controllers/setupController')(app);
    // require('../app/controllers/apiController'),
    require('../app/routes/api.route')(app);
    require('../app/routes/nurse.route')(app);
    require('../app/routes/contract.route')(app);
    require('../app/routes/rolePermissionRoute')(app);
    require('../app/routes/authentication.route')(app);

    app.get('*', (req, res) => 
        res.send("Appwork!")
        // res.sendFile(path.join(__dirname, '../public/src/index.html'))
    );

    // setupController(app);
    // // apiController(app);
    // apiRoute(app);

    return app;
}
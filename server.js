const config = require('./config/config'),
    mongoose = require('./config/mongoose'),
    // mongoose = require('mongoose');
    express = require('./config/express'),
    passport = require('./config/passport');
    io = require('socket.io');

// const config = require('./config');


const db = mongoose(),
    app = express();
    // passports = passport();

// const port = process.env.PORT || 3000;

// mongoose.connect(config.getDbConnectionString());

// app.listen(port, () => console.log('CORS-enabled web server listening on port 3000'));

var listen = app.listen(config.port, () => console.log('CORS-enabled web server listening on port 3000'));

var socket = io.listen(listen);

require('./app/routes/routes')(app,socket);

// console.log(' server running at ' + config.getDbConnectionString() + ':' + port);

console.log(' server running at ' + config.db + ':' + config.port);
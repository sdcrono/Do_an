const port = 3000;
const configValues = require("../loginname");
module.exports = {
	port: process.env.PORT || port,
    // db: 'mongodb://localhost/nurse',
	db: 'mongodb://'+configValues.uname+':'+configValues.pwd+'@ds133932.mlab.com:33932/nurses',
	facebook:{
		clientID: '396953987333419',
		clientSecret: 'e1713baaa807362edd455698dd780c7e',
		callbackURL: 'http://localhost' + port + '/oauth/facebook/callback'
	},
	twitter:{
		clientID: 'byDDkhQ8Is7CNE4sG5M0VAYFP',
		clientSecret: 'oawqRKGfNkRYUnsBLCzb3K84sMOrDknWMSYJiRlrhH6NcFQexd',
		callbackURL: 'http://localhost' + port + '/oauth/twitter/callback' 
	}
};
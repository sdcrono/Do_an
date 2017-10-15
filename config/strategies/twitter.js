const passport = require('passport'),
	url = require('url'),
	TwitterStrategy = require('passport-twitter').Strategy,
	config = require('../config'),
	// users = require('../../app/controllers/usercontroller');
    users = require('mongoose').model('Users');
	
module.exports = function(){
	passport.use(new TwitterStrategy({
		consumerKey: config.twitter.clientID,
		consumerSecret: config.twitter.clientSecret,
		callbackURL: config.twitter.callbackURL,
		passReqToCallBack: true
	},
	function(req, token, tokenSecret, profile, done){
		let providerData = profile._json;
		providerData.token = token;
		providerData.tokenSecret = tokenSecret;
		
		let providerUserProfile = {
			fullname: profile.displayName,			
			username:profile.username,
			provider:'twitter',
			providerId:profile.id,
			providerData:providerData
		};
		
		users.saveOAuthUserProfile(req, providerUserProfile, done);
	}));
};
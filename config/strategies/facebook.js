const passport = require('passport'),
	url = require('url'),
	FacebookStrategy = require('passport-facebook').Strategy,
	config = require('../config'),
	// users = require('../../app/controllers/usercontroller');
    users = require('mongoose').model('Users');
	
module.exports = function(){
	passport.use(new FacebookStrategy({
		clientID: config.facebook.clientID,
		clientSecret: config.facebook.clientSecret,
		callbackURL: config.facebook.callbackURL,
		passReqToCallBack: true
	},
	function(req, accessToken, refreshToken, profile, done){
		let providerData = profile._json;
		providerData.accessToken = accessToken;
		providerData.refreshToken = refreshToken;
		
		let providerUserProfile = {
			name: profile.name.givenName,
			email:profile.emails[0].value,
			username:profile.username,
			provider:'facebook',
			providerId:profile.id,
			providerData:providerData
		};
		
		users.saveOAuthUserProfile(req, providerUserProfile, done);
	}));
};
var express = require('express');
var router = express.Router();
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

passport.use(
	new FacebookStrategy({
    	clientID: '1457381837900081',
    	clientSecret: 'bb9d6ec500962626fd896de4abbfa89f',
    	callbackURL: "http://localhost:3000/auth/facebook/callback"
  	},
  	function(accessToken, refreshToken, profile, done) {
    	db.user.find({
    		where: {
    			username: profile.id,
    		}
    	}).then(function(result) {
    		if(result) {
    			return done(null, result);
    		} else {
    			var newUser = {
    				username: profile.id,
    				name: profile.displayName,
    				password: '',
            email: 'noemail@gmail.com',
    				profileImage: 'noimage.png'
    			};
    			db.user.create(newUser).then(function(user) {
    				done(null, user);
    			}).catch(function(err) {
    				done(err);
    			});
    		}
    	});
  	}
));

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/users/login' }), function(req, res) {
    req.flash('success', 'You are logged in');
    res.redirect('/');
  });

/* GET home page. */
router.get('/', checkAuthenticated, function(req, res, next) {
  res.render('index', { title: 'members' });
});

function checkAuthenticated(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/users/login');
	}
}

module.exports = router;

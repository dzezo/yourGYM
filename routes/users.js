var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');

var config = require('../config/database');
var User = require('../models/user.model');


// Register
router.post('/register', function (req, res, next) {
	// Create user
	var newUser = new User({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password
	});

	User.addUser(newUser, function (err, user) {
		if(err)
			return res.status(400).json({ success: false, msg: 'Failed to register user.' });
		res.json({ success: true, msg: 'User registered.' });
	});

});

// Authenticate
router.post('/authenticate', function (req, res, next) {
	var username = req.body.username;
	var password = req.body.password;

	User.getUserByUsername(username, function (err, user) {
		if(err)
			throw err;
		if(!user){
			return res.status(404).json({ success: false, msg: 'User not found.' });
		}

		User.comparePassword(password, user.password, function (err, isMatch) {
			if(err)
				throw err;
			if(isMatch){
				var token = jwt.sign(user, config.secret, {
					expiresIn: '7d'
				});

				res.json({
					success: true,
					token: 'JWT ' + token,
					// Return user without password
					user: {
						id: user._id,
						name: user.name,
						username: user.username,
						email: user.email
					}
				});
			}
			else {
				return res.status(403).json({ success: false, msg: 'Wrong password.' });
			}
		})
	})
});

module.exports = router;

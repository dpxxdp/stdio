'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');


exports.settle_kismet = function(req, res, next) {
	if(req.user.username === req.body.user.username) { return res.status(400).send({ message: 'That\'s your own article!' }); }
	
	User.findOne({ username: req.user.username }, function(err, user) {
		if (!user) {
			return res.status(400).send({
				message: 'No account with that username has been found'
			});
		} else if(user.kismet>0) {
			user.kismet--;
			user.save(function(err) {
				req.locals = { 'kismet_sent': true };
				next();
			});
		} else {
			return res.status(400).send({ message: 'It seems like you signed up using your ' + user.provider + ' account' });
		}
	});
};

exports.send_kismet = function(req, res, next) {
	User.findOne({ username: req.body.user.username }, function(err, user) {
		if (!user) {
			return res.status(400).send({
				message: 'No account with that username has been found'
			});
		} else {
			user.kismet++;
			user.save(function(err) {
				req.locals = { 'kismet_sent': true };
				next();
			});
		}
	});
};

exports.update_send = function(req, res, next) {
	var user = req.user;
	user.kismet--;
	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			next();
		}
	});
};

/**
 * creates and caches an address
 */
//exports.getAddress = function(req, res) {
//	// Init Variables
//	var user = req.user;
//	var message = null;
//
//	// For security measurement we remove the roles from the req.body object
//	delete req.body.roles;
//
//	if (user) {
//		// Merge existing user
//		user = _.extend(user, req.body);
//		user.updated = Date.now();
//		user.displayName = user.firstName + ' ' + user.lastName;
//
//		user.save(function(err) {
//			if (err) {
//				return res.status(400).send({
//					message: errorHandler.getErrorMessage(err)
//				});
//			} else {
//				req.login(user, function(err) {
//					if (err) {
//						res.status(400).send(err);
//					} else {
//						res.json(user);
//					}
//				});
//			}
//		});
//	} else {
//		res.status(400).send({
//			message: 'User is not signed in'
//		});
//	}
//};

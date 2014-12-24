'use strict';

var mongoose = require('mongoose'),
	errorHandler = require('../errors.server.controller'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * List of Users
 */
exports.list = function(req, res) {
	User.find({parent:'top'}).sort('-kismet').populate('user', 'username').exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(users);
		}
	});
};

/*
Same as list for now.
*/
exports.read = function(req, res) {
	User.find({parent:'top'}).sort('-kismet').populate('user', 'username').exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(users);
		}
	});
};
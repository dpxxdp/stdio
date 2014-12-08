'use strict';

var cp_api = require('./models/cp_api.server.model.js');
var errorHandler = require('./errors.server.controller');
var _ = require('lodash');
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('Election');

exports.create = function(req, res) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	// Init Variables
	var election = new Election();

	


	// Then save the user 
	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
					res.json(user);
				}
			});
		}
	});



};
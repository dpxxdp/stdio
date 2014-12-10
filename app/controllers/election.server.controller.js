'use strict';

var cp_api = require('../models/cp_api.server.model.js');
var errorHandler = require('./errors.server.controller');
var _ = require('lodash');
var mongoose = require('mongoose');
var passport = require('passport');
var Election = mongoose.model('Election');

exports.create = function(req, res) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	
	Election.create(function(err, model) {
		if(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(model);
		}
	});
};

exports.add = function(req, res) {
	var election = req.election;
	election = _.extend(election, req.body);

	election.add(req.body.title, req.body.description, req.user, function(err, model) {
		if(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(election);
		}
	});
};

exports.seal = function(req, res) {
	var election = req.election;
	election = _.extend(election, req.body);

	election.seal(function(err, model) {
		if(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(model);
		}
	});
};

exports.list = function(req, res) {
	Election.find().sort('-created').populate('user', 'displayName').exec(function(err, elections) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(elections);
		}
	});
};

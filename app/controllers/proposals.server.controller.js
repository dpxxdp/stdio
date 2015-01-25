'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Proposal = mongoose.model('Proposal'),
	_ = require('lodash');

/**
 * Create a proposal
 */
exports.create = function(req, res) {
	var proposal = new Proposal(req.body);

	proposal.user = req.user;

	proposal.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(proposal);
		}
	});
};

/**
 * Show the current proposal
 */
exports.read = function(req, res) {
	res.json(req.proposal);
};

/**
 * Update a article
 */
exports.update = function(req, res) {
	var proposal = req.proposal;

	//console.log('resetting parent');
	//article.parent = '';//article.id;

	proposal = _.extend(proposal, req.body);

	proposal.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(proposal);
		}
	});
};

//exports.vote = function(req, res) {
//	console.log('proposals.server.controller.vote: voting for: ' + req.proposal._id);
//
//	var conditions = { _id: req.proposal._id };
//	var update = { $inc: { req.proposal: 1 }};
//
//	Proposal.update(conditions, update, function(err, proposal) {
//		if (err) {
//			console.log('proposals.server.controller.kismet: findbyId ERROR: ' + err);
//			return res.status(400).send({	message: errorHandler.getErrorMessage(err)	});
//		} else if (!proposal) {
//			console.log('proposals.server.controller.kismet: ERROR: no proposal found for id: ' + req.proposal._id);
//			return res.status(400).send(new Error('Proposal does not exist: ' + req.proposal._id));
//		} else {
//			res.status(200).send();
//		}
//	});
//};


//exports.kismet = function(req, res) {
//	console.log('proposals.server.controller.kismet: sending kismet to: ' + req.proposal._id);
//
//	var conditions = { _id: req.proposal._id };
//	var update = { $inc: { kismet: 1 }};
//
//	Proposal.update(conditions, update, function(err, proposal) {
//		if (err) {
//			console.log('proposals.server.controller.kismet: findbyId ERROR: ' + err);
//			return res.status(400).send({	message: errorHandler.getErrorMessage(err)	});
//		} else if (!proposal) {
//			console.log('proposals.server.controller.kismet: ERROR: no proposal found for id: ' + req.proposal._id);
//			return res.status(400).send(new Error('Proposal does not exist: ' + req.proposal._id));
//		} else {
//			res.status(200).send();
//		}
//	});
//};

/**
 * Delete an proposal
 */
//exports.delete = function(req, res) {
//	var proposal = req.proposal;
//
//	proposal.remove(function(err) {
//		if (err) {
//			return res.status(400).send({
//				message: errorHandler.getErrorMessage(err)
//			});
//		} else {
//			res.json(proposal);
//		}
//	});
//};

/**
 * List of Proposals
 */
exports.list = function(req, res) {
	Proposal.find({parent:'top'}).sort('-created').populate('user', 'username').exec(function(err, proposals) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(proposals);
		}
	});
};

//exports.listComments = function(req, res) {
////	console.log('list:');
////	console.log(JSON.stringify(req.query));
//
//	Proposal.find({parent:req.param('parentId')}).sort('-created').populate('user', 'username').exec(function(err, proposals) {
//		if (err) {
//			return res.status(400).send({
//				message: errorHandler.getErrorMessage(err)
//			});
//		} else {
//			res.json(proposals);
//		}
//	});
//};

/**
 * Proposal middleware
 */
exports.proposalByID = function(req, res, next, id) {
	Proposal.findById(id).populate('user', 'username').exec(function(err, proposal) {
		if (err) return next(err);
		if (!proposal) return next(new Error('Failed to load proposal ' + id));
		req.proposal = proposal;
		next();
	});
};

exports.proposalByParent = function(req, res, next, id) {
	Proposal.where('parent').equals(id).populate('user', 'username').exec(function(err, proposal) {
		if (err) return next(err);
		if (!proposal) return next(new Error('Failed to load proposal ' + id));
		req.proposal = proposal;
		next();
	});
};
/**
 * Proposal authorization middleware
 */
//exports.hasAuthorization = function(req, res, next) {
//	if (req.proposal.user.id !== req.user.id) {
//		return res.status(403).send({
//			message: 'User is not authorized'
//		});
//	}
//	next();
//};

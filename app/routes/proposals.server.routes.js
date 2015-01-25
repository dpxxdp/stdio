'use strict';

/**
 * Module dependencies.
 */

var users = require('../../app/controllers/users.server.controller');
var proposals = require('../../app/controllers/proposals.server.controller');
//var cp_api = require('../../app/controllers/cp_api.server.controller');

module.exports = function(app) {
	// Proposal Routes
	app.route('/proposals')
		.get(proposals.list)
		.post(users.requiresLogin, proposals.create);

	//app.route('/comments/:parentId')
		//.get(proposals.listComments);

	app.route('/proposals/:proposalId')
		.get(proposals.read)
		.put(users.requiresLogin,
			//proposals.hasAuthorization, 
			proposals.update);
		//.delete(users.requiresLogin, proposals.hasAuthorization, proposals.delete)
		//.post(
			//users.requiresLogin,
			//users.getAddress,
			//cp_api.send_kismet,
			//users.settle_kismet,
			//users.send_kismet,
			//proposals.kismet);

	// Finish by binding the article middleware
	app.param('proposalId', proposals.proposalByID);
	//app.param('parent', proposals.proposalByParent);
};
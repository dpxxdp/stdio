'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller');
var articles = require('../../app/controllers/articles.server.controller');
var election = require('../../app/controllers/election.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/elections')
		.get(election.list)
		.post(users.requiresLogin, articles.create);

	app.route('/articles/:articleId')
		.get(articles.read)
		.put(users.requiresLogin, articles.hasAuthorization, articles.update)
		.delete(users.requiresLogin, articles.hasAuthorization, articles.delete);

//	app.route('/articles/:articleId/kismet')
//		.put(users.requiresLogin, articles.kismet);

	// Finish by binding the article middleware
	app.param('articleId', articles.articleByID);
};
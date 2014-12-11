'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller');
var articles = require('../../app/controllers/articles.server.controller');
var cp_api = require('../../app/controllers/cp_api.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/articles')
		.get(articles.list)
		.post(users.requiresLogin, articles.create);

	app.route('/comments/:parentId')
		.get(articles.listComments);

	app.route('/articles/:articleId')
		.get(articles.read)
		.put(users.requiresLogin,articles.hasAuthorization,articles.update)
		.delete(users.requiresLogin, articles.hasAuthorization, articles.delete)
		.post(users.requiresLogin, cp_api.kismet, articles.kismet);

	// Finish by binding the article middleware
	app.param('articleId', articles.articleByID);
	app.param('parent', articles.articleByParent);

};

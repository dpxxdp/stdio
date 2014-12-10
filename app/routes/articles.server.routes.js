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

	app.route('/articles/:articleId')
		.get(articles.read)
		.put(users.requiresLogin, articles.hasAuthorization, articles.update)
		.delete(users.requiresLogin, articles.hasAuthorization, articles.delete)
<<<<<<< HEAD
		.post(users.requiresLogin, articles.kismet);
		
//	app.route('/articles/:articleId/kismet')
//		.put(users.requiresLogin, articles.kismet);
=======
		.post(users.requiresLogin, cp_api.save_to_blockchain, articles.kismet);
>>>>>>> 353c946a6d8295b48a92773bd3ce979fa62d0c53

	// Finish by binding the article middleware
	app.param('articleId', articles.articleByID);
};

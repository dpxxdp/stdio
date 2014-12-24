'use strict';

module.exports = function(app) {
	// Root routing
	var boardroom = require('../../app/controllers/boardroom.server.controller');
	var users = require('../../app/controllers/users.server.controller');

	app.route('/boardroom')
		.get(users.requiresLogin, boardroom.boardroom);
	
	app.route('/boardroom/owners')
		.get(users.requiresLogin, users.list);
};
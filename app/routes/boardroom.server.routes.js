'use strict';

module.exports = function(app) {
	// Root routing
	var boardroom = require('../../app/controllers/boardroom.server.controller');
	app.route('/boardroom').get(boardroom.boardroom);
};
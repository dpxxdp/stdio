'use strict';

/**
 * Module dependencies.
 */
exports.boardroom = function(req, res) {
	res.render('boardroom', {
		user: req.user || null,
		request: req
	});
};
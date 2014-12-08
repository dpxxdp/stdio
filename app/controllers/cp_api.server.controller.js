'use strict';

var cp_api = require('./models/cp_api.server.model.js');
var errorHandler = require('./errors.server.controller');

exports.send = function(req, res) {
	var source = req.user.address;
	var destination = req.body.destination;
	var privkey = req.user.password;
	var currency = 'KSMT';
	var amt = 1;

	cp_api.send(source, destination, amt, currency, privkey, function(err, data){
		if (err) { return res.status(400).send({ message: errorHandler.getErrorMessage(err) }); }

		res.json(data);
	});
};

exports.get_balances = function(req, res) {
	var address = req.body.address;

	cp_api.get_balances(address, function(err, data){
		if (err) { return res.status(400).send({ message: errorHandler.getErrorMessage(err) }); }

		res.json(data);
	});
};

exports.vote = function(req, res) {
	var source = req.user.address;
	var destination = req.body.vote.destination;
	var privkey = req.user.password;
	var currency = req.body.vote.currency;
	var amt = 1;

	cp_api.send(source, destination, amt, currency, privkey, function(err, data){
		if (err) { return res.status(400).send({ message: errorHandler.getErrorMessage(err) }); }

		res.json(data);
	});
};



exports.schedule_vote = function(req, res) {
	
	var issuance = 


	var destination = req.body.destination;
	var amt = 1;

	cp_api.send(source, destination, amt, function(err, data) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err),
			});
		} else {
			res.json(data);
		}
	});
};
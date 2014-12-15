'use strict';

var cp_api = require('../models/cp_api.server.model.js');
var errorHandler = require('./errors.server.controller');


//TODO: Insecure password passing
exports.send_kismet = function(req, res, next) {
	var source = req.user.address;
	var dest = req.article.address;
	var privKey = req.user.privKey;

	var amt = 1;
	var currency = 'KSMT';
	//console.log('cp_api.server.controller: sending kismet to: ' + dest);

	cp_api.create_send(source, dest, amt, currency, function(err, unsigned_tx_hex) {
		if(err) {
			console.log('cp_api.server.controller.kismet: ERROR: ' + err);
			return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
		}
		//console.log('cp_api.server.controller.kismet: created tx:' + unsigned_tx_hex);

		cp_api.sign_tx(unsigned_tx_hex, privKey, function(err, signed_tx_hex) {
			if(err) {
				console.log('cp_api.server.controller.kismet: ERROR: ' + err);
				return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
			}
			//console.log('cp_api.server.controller.kismet: signed tx:' + signed_tx_hex);

			cp_api.broadcast_tx(signed_tx_hex, function(err, tx_id) {
				if(err) {
					console.log('cp_api.server.controller.kismet: ERROR: ' + err);
					return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
				}
				//console.log('cp_api.server.controller.kismet: returned data' + data);

				if(tx_id)
				{
					req.locals = {'tx_id': tx_id};
					console.log('request.locals.tx: ' + req.locals.tx);
					next();
				}
			});
		});
	});
};

//TODO: Insecure password passing
exports.my_ksmt = function(req, res) {
	var address = req.user.address;

	cp_api.get_balances(address, function(err, data){
		if (err) { return res.status(400).send({ message: errorHandler.getErrorMessage(err) }); }
		res.json(data);
	});

};

//TODO: Insecure password passing
exports.get_ksmt = function(req,res) {
	var subject = req.body.subject_user;
	cp_api.get_balances(subject.address, function(err, data){
		if (err) { return res.status(400).send({ message: errorHandler.getErrorMessage(err) }); }
		res.json(data);
	});
};


//TODO: Insecure password passing
exports.vote = function(req, res) {
	var source = req.user.wallet.address;
	var index = req.body.prop.index;
	var destination = '';
	switch(req.body.prop.answer) {
	case 'yes':
		destination = req.election.proposal[index].ballotbox.yes;
		break;
	case 'no':
		destination = req.election.proposal[index].ballotbox.no;
		break;
	case 'protest':
		destination = req.election.proposal[index].ballotbox.protest;
		break;
	default:
		break;
	}
	
	var privkey = req.user.password;
	var dividend_asset = req.election.proposal[index].hash;
	var amt = req.body.amt;

	cp_api.vote(source, destination, amt, dividend_asset, privkey, function(err, data) {
		if (err) { return res.status(400).send({ message: errorHandler.getErrorMessage(err) }); }
		res.json(data);
	});
};


//TODO: Insecure password passing
exports.setup_election = function(req, res) {
	var source = req.user.wallet.address;
	var index = req.body.prop.index;
	var destination = req.election.proposal[index].ballotbox.yes;
	var privkey = req.user.password;
	var dividend_asset = req.election.proposal[index].hash;
	var amt = req.body.amt;
	var options = req.election.options;

	cp_api.setup_election(source, dividend_asset, options, privkey, function(err, data){
		if (err) { return res.status(400).send({ message: errorHandler.getErrorMessage(err) }); }
		res.json(data);
	});
};


















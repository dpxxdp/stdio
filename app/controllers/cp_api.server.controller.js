'use strict';

var cp_api = require('./models/cp_api.server.model.js');
var errorHandler = require('./errors.server.controller');


//TODO: Insecure password passing
exports.kismet = function(req, res, next) {

	cp_api.kismet(req.user.wallet.address, req.article.author, req.user.wallet.privKey, function(err,data) {
		if (err) { return res.status(400).send({ message: errorHandler.getErrorMessage(err) }); }
		if(data.error) { return res.status(400).send({ message: errorHandler.getErrorMessage(data.error) }); }

		req.kismet.result = data.result;
		next();
	});

};

//TODO: Insecure password passing
exports.my_ksmt = function(req, res) {

	cp_api.get_balances(req.user.wallet, function(err, data){
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


















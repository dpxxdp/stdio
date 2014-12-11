'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Wallet = mongoose.model('Wallet');
var crypto = require('crypto');


var BallotBoxSchema = new Schema({
	//hash will be SHA1(ballotbox.yes+ballotbox.no+ballotbox.protest)
	hash: {
		type: String,
		default: '',
		trim: true,
		required: 'proposal hash cannot be blank',
	},
	yes: {
		type: String,
		default: '',
		trim: true,
		required: 'ballotbox yes address cannot be blank',
	},
	no: {
		type: String,
		default: '',
		trim: true,
		required: 'ballotbox no address cannot be blank',
	},
	protest: {
		type: String,
		default: '',
		trim: true,
		required: 'protest address cannot be blank',
	},
});

BallotBoxSchema.statics.create = function(proposal_title, callback) {

	Wallet.create_vote_address(Date.now(), proposal_title, function(err, data) {
		this.yes = data;
	});

	Wallet.create_vote_address(Date.now(), proposal_title, function(err, data) {
		this.no = data;
	});

	Wallet.create_vote_address(Date.now(), proposal_title, function(err, data) {
		this.protest = data;
	});

	var sha = crypto.createHash('sha1');
	sha.write(this.yes+this.no+this.protest);
	this.hash = sha.read();

	this.save(callback);
};

mongoose.model('BallotBox', BallotBoxSchema);
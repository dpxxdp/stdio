'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var wallet = require('./wallet.server.model.js');
var crypto = require('crypto');
var Proposal = mongoose.model('Proposal');

var ElectionSchema = new Schema({
	//hash will be SHA1(election.previous+election.created+iterate_and_append(election.proposal.hash)+election.expired)
	hash: {
		type: String,
		default: '',
		trim: true,
		required: 'election hash cannot be blank'
	},
	created: {
		type: Date,
		default: Date.now,
	},
	expired: {
		type: Date,
		default: Date.now+4000000
	},
	previous: {
		type: String,
		default: '',
		required: 'election previous cannot be blank',
	},
	proposals: [{type: mongoose.Schema.Types.ObjectId, ref: 'Proposal'}]
});

ElectionSchema.statics.create = function(callback) {
	this.save(callback);
};

ElectionSchema.statics.add = function(title, description, sponsors, callback) {
	Proposal.create(title, description, sponsors, function(err, model) {
		if(err) { return callback(err); }

		this.proposals.push(model);
	});

	this.save(callback);
};

ElectionSchema.statics.seal = function(callback) {

	var sha = crypto.createHash('sha1');
	sha.write(this.previous);
	sha.write(this.created);
	for (var i = 0; i < this.proposals.length - 1; i++) {
		sha.write(this.proposals.hash);
	}
	sha.write(this.expired);
	this.hash = sha.read();

	this.save(callback);
};

ElectionSchema.statics.now = function(callback) {
	var now = Date.now();
	var election = mongoose.find()
	//find with mongoose in elections. create new one if now>this.expired
	if(now>election.expired) {
		this.create(function(err, model) {
			if(err) { return callback(err); }
			callback(null, model);
		});
	} else {
		callback(null, election);
	}
};

mongoose.model('Election', ElectionSchema);
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var wallet = require('./wallet.server.model.js');
var crypto = require('crypto');
var Proposal = mongoose.model('Proposal');

var ElectionSchema = new Schema({
	//hash will be SHA1(election.header.previous+iterate_and_append(election.proposal.hash)+election.header.created)
	hash: {
		type: String,
		default: '',
		trim: true,
		required: 'electionheader hash cannot be blank'
	},
	created: {
		type: Date,
		default: Date.now,
	},
	previous: {
		type: String,
		default: '',
		required: 'electionheader previous cannot be blank',
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
	for (var i = 0; i < this.proposals.length - 1; i++) {
		sha.write(this.proposals.hash);
	}
	sha.write(this.created);
	this.hash = sha.read();

	this.save(callback);
};

mongoose.model('Election', ElectionSchema);
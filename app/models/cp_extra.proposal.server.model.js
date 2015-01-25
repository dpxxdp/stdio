/*'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
//var BallotBox = mongoose.model('BallotBox');

var ProposalSchema= new Schema({
	//hash will be SHA1(proposal.title+proposal.description+proposal.ballotbox.hash)
	hash: {
		type: String,
		default: '',
		trim: true,
		required: 'proposal hash cannot be blank',
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'proposal title cannot be blank',
	},
	description: {
		type: String,
		default: '',
		trim: true,
		required: 'proposal description cannot be blank',
	},
	sponsors: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},],
	signatories: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},],
	ballotbox: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'BallotBox',
	}
});

//ProposalSchema.statics.create = function(title, description, sponsors, callback) {
//	this.title = title;
//	this.description = description;
//	this.sponsors = sponsors;
//
//	BallotBox.create(title, function(err, model){
//		if(err) { return callback(err); }
//
//		var sha = crypto.createHash('sha1');
//		sha.write(title+description+model.hash);
//		this.hash = sha.read();
//	});
//
//	this.save(callback);
//};

mongoose.model('Proposal', ProposalSchema);
*/
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BallotBoxSchema = new Schema({
	//hash will be SHA128(ballotbox.yes+ballotbox.no+ballotbox.protest)
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

BallotBoxSchema.statics.create = function(callback) {

	this.yes = generate_burn_address();
	this.no = generate_burn_address();
	this.protest = generate_burn_address();

	this.save(callback);
};

mongoose.model('BallotBox', BallotBoxSchema);

var ProposalSchema= new Schema({
	//hash will be SHA128(proposal.title+proposal.description+proposal.address_hash)
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
});

mongoose.model('Proposal', ProposalSchema);

var ElectionHeaderSchema = new Schema({
	//hash will be SHA128(iterate_and_append(election.proposal.hash)+election.header.previous+election.header.created)
	hash: {
		type: String,
		default: '',
		trim: true,
		required: 'electionheader hash cannot be blank'
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'electionheader title cannot be blank',
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
});

ElectionHeaderSchema.statics.create = function() {

};

mongoose.model('ElectionHeader', ElectionHeaderSchema);


var ElectionSchema = new Schema({
	header: {
		type: Schema.ObjectId,
		ref: 'ElectionHeader',
	},
	proposals: [{type: mongoose.Schema.Types.ObjectId, ref: 'Proposal'}]
});

ElectionSchema.statics.create = function() {

};

mongoose.model('Election', ElectionSchema);


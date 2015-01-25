'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChoiceSchema = new Schema({
    text: {
        type: String,
        default: '',
        trim: true,
        required: 'choice text cannot be blank'
    },
    votes: {
        type: Number,
        default: '',
        trim: true,
    },
});

var ProposalSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    prop: {
        type: String,
        default: '',
        trim: true,
        required: 'proposal question cannot be blank'
    },
    choices: [ChoiceSchema],
    kismet: {
        type: Number,
        default: 0,
    }
});

mongoose.model('Proposal', ProposalSchema);
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	children: {
		type: Schema.ObjectId,
		ref: 'Article',
	},
	edits: {
		type: Schema.ObjectId,
		ref: 'Article',
	},
	address: {
		type: String,
		default: '',
		trim: true,
	}
});

mongoose.model('Article', ArticleSchema);
'use strict';

var settings = require('../../config/wallet');
var bigInt = require('big-integer');
var bitcoin = require('bitcoinjs-lib');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var WalletSchema = new Schema({
    address : {
        type: String,
        default: '1234567890',
    },
    privKey : {
        type: String,
        default: '0987654321'
    }
});

WalletSchema.statics.create_vote_address = function(seed, injection, callback) {

    var key = bitcoin.crypto.sha256(seed);
    var address = key.pub.getAddress().toString();

    var addressArray = address.split('');
    var injectionArray = injection.replace('0','o').replace('O','o').replace('I','1').replace('l','1').substr(0, 10).split('');

    var startIndex = Math.randomInt(3, addressArray.length - 10);

    for (var i = 0; i < injectionArray.length; i++) {
		addressArray[i+startIndex] = injectionArray[i];
	}

	callback(null, address);
};


WalletSchema.statics.create_address = function(seed) {
	var hash = bitcoin.crypto.sha256(seed);
    var d = bigInt.fromBuffer(hash);

    var key = new bitcoin.ECKey(d);
};



mongoose.model('Wallet', WalletSchema);
'use strict';

var mongoose = require('mongoose');
var settings = require('../../config/counterparty');
var https = require('https');
//var Election = mongoose.model('Election');


///////////////////////////////////////////////////////////////////////////////
//TOOLS////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

exports.kismet = function(source, dest, privkey, callback) {
	var amt = 1;
	var currency = 'KSMT';
	this.send(source, dest, amt, currency, privkey, function(err, data) {
		if(err) { return callback(err); }
		callback(null, data);
	});
};

exports.vote = function(source, dest, amt, dividend_asset, privkey, callback) {

	this.send(source, dest, amt, dividend_asset, privkey, function(err, data) {
		if(err) { return callback(err); }
		callback(null, data);
	});
};

exports.setup_election = function(source, election, options, privkey, callback) {
	var quantity = '1000000';
	var divisible = 'false';
	var description = election._id;
	var quantity_per_unit = 1;
	var issuance = '';
	var dividend_asset = '';


	//we have to set up a currency for each proposal
	//for (var i =0; i < election.proposals.length; i++) {
	//	this.issue(source, election.proposals[i], quantity, divisible, description, options, privkey, function(err, data) {
	//		if(err) { return callback(err); }
	//		dividend_asset = data.asset;
	//	});
//
	//	this.dividend(source, 'KSMT', dividend_asset, quantity_per_unit, options, privkey, function(err, data) {
	//		if(err) { return callback(err); }
	//		callback(null, data);
	//	});
	//}
};

exports.read_election = function(ballotbox, callback) {

	var results = { 'yes': '', 'no':'', 'protest':'' };

	this.balance(ballotbox.yes, function(err, data) {
		if(err) { return callback(err); }
		results.yes = data.balance;
		this.balance(ballotbox.no, function(err, data) {
			if(err) { return callback(err); }
			results.no = data.balance;
			this.balance(ballotbox.protest, function(err,data){
				if(err) { return callback(err); }
				results.protest = data.balance;
				callback(null, results);
			});
		});
	});
};


///////////////////////////////////////////////////////////////////////////////
//MODULE///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

exports.send = function(source, dest, amt, currency, privkey, callback) {

	this.create_send(source, dest, amt, currency, function(err, unsigned_tx_hex) {
		if(err) { return callback(err); }

		this.sign_and_broadcast(unsigned_tx_hex, privkey, function(err, data) {
			if(err) { return callback(err); }
			callback(null, data);
		});
	});
};

exports.issue = function(source, asset, quantity, divisible, description, options, privkey, callback) {

	this.create_issuance(source, asset, quantity, divisible, description, options, function(err, unsigned_tx_hex) {
		if(err) { return callback(err); }

		this.sign_and_broadcast(unsigned_tx_hex, privkey, function(err, data) {
			if(err) { return callback(err); }
			callback(null, data);
		});
	});
};

exports.dividend = function(source, asset, dividend_asset, quantity_per_unit, options, privkey, callback) {

	this.create_dividend(source, asset, dividend_asset, quantity_per_unit, options, function(err,unsigned_tx_hex) {
		if(err) { return callback(err); }

		this.sign_and_broadcast(unsigned_tx_hex, privkey, function(err, data) {
			if(err) { return callback(err); }
			callback(null, data);
		});
	});
};

exports.balance = function(address, callback) {

	this.get_balances(address, function(err, data) {
		if(err) { return callback(err); }
		callback(data);
	});
};


///////////////////////////////////////////////////////////////////////////////
//ABSTRACTION  LAYERS//////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var sign_and_broadcast = function(unsigned_tx_hex, privkey, callback) {
	this.sign_tx(unsigned_tx_hex, privkey, function(err, signed_tx_hex) {
		if(err) { return callback(err); }
		this.broadcast_tx(signed_tx_hex, function(err, data) {
			if(err) { return callback(err); }
			callback(null, data);
		});
	});
};

///////////////////////////////////////////////////////////////////////////////
//API CALLS////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var sign_tx = function(unsigned_tx_hex, privkey, callback) {
	var body = {
		'method' : 'sign_tx',
		'params' : {
			'unsigned_tx_hex' : unsigned_tx_hex,
			'privkey' : privkey,
		},
		'jsonrpc' : '2.0',
		'id' : Date.now(),
	};

    this.https_client(body, function(err, signed_tx_hex){
		if(err) { return callback(err); }
		//console.log('data');
		callback(null, signed_tx_hex);
    });
};

var broadcast_tx = function(signed_tx_hex, callback) {
	var body = {
		'method' : 'broadcast_tx',
		'params' : {
			'signed_tx_hex' : signed_tx_hex,
		},
		'jsonrpc' : '2.0',
		'id' : Date.now(),
	};
    this.https_client(body, function(err, data){
		if(err) { return callback(err); }
		//console.log('data');
		callback(null, data);
    });
};

var create_send = function(source, dest, amt, currency, callback) {

	//console.log('create_send')
	var body = {
		'method': 'create_send',
		'params': {
			'source': source,
			'destination': dest,
			'asset': currency,
			'quantity': 100000000,
        },
        'jsonrpc' : '2.0',
        'id': Date.now(),
    };

    this.https_client(body, function(err, data){
		if(err) { return callback(err); }
		//console.log('data');
		callback(null, data);
    });
};

var create_issuance = function(source, asset, quantity, divisible, description, options, callback) {
	var body = {
		'method' : 'broadcast_tx',
		'params' : {
			'source' : source,
			'asset' : asset,
			'quantity' : quantity,
			'divisible' : divisible,
			'description' : description,
		},
		'jsonrpc' : '2.0',
		'id' : Date.now(),
	};

	//for (var i = options.length - 1; i >= 0; i--) {
	//	body.params.add(options[i]);
	//};

    this.https_client(body, function(err, data){
		if(err) { return callback(err); }
		//console.log('data');
		callback(null, data);
    });
};

var create_dividend = function(source, asset, dividend_asset, quantity_per_unit, options, callback) {
	var body = {
		'method' : 'broadcast_tx',
		'params' : {
			'source' : source,
			'asset' : asset,
			'dividend_asset' : dividend_asset,
			'quantity_per_unit' : quantity_per_unit,
		},
		'jsonrpc' : '2.0',
		'id' : Date.now(),
	};

	//for (var i = options.length - 1; i >= 0; i--) {
	//	body.params.add(options[i]);
	//};

    this.https_client(body, function(err, data){
		if(err) { return callback(err); }
		//console.log('data');
		callback(null, data);
    });
};


var get_balances = function(address, callback) {
	var body = {
		'method' : 'broadcast_tx',
		'params' : {
			'filters': {
				'field': 'address',
				'op': '==',
				'value': address
			}
		},
		'jsonrpc' : '2.0',
		'id' : Date.now(),
	};
    this.https_client(body, function(err, data){
		if(err) { return callback(err); }
		//console.log('data');
		callback(null, data);
    });
};


///////////////////////////////////////////////////////////////////////////////
//HTTPS GATEWAY////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var https_client = function(body, callback) {

	var options = settings.requestOptions;
	
	//send request
	var secureRequest = https.request(options, function(response) {
		console.log('https_client: request called back');
		
		if(response.statusCode !== '200'){
			//console.log('HEADERS: ' + JSON.stringify(response.headers));
			return callback('https_client: response error: ' + JSON.stringify(response.statusCode));
		}
		
		response.setEncoding('utf8');
		
		var responseBuff = '';
		
		response.on('data', function (chunk) {
			responseBuff += chunk;
		});

		response.on('end', function() {
			var responseObj = JSON.parse(responseBuff);
			if(responseObj.jsonrpc !== '2.0') {
				console.log('https_client: JSON response unrecognized: ' + responseObj.jsonrpc);
				return callback('https_client: JSON response unrecognized: ' + responseObj.jsonrpc);
			}

			callback(null, responseObj.result);
		});
	});

	var bodyAsString = JSON.stringify(body);

	secureRequest.write(bodyAsString);
	secureRequest.end();
};


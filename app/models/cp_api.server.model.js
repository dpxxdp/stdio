'use strict';

var mongoose = require('mongoose');
var settings = require('../../config/counterparty');
var https = require('https');
//var Election = mongoose.model('Election');


///////////////////////////////////////////////////////////////////////////////
//TOOLS////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//exports.kismet = function(source, dest, privkey, callback) {
//	var amt = 1;
//	var currency = 'KSMT';
//	console.log('cp_api.server.model: sending kismet to' + dest);
//	this.send(source, dest, amt, currency, privkey, function(err, data) {
//		if(err) { return callback(err); }
//		console.log('cp_api.server.model: sent kismet: ' + dest);
//		callback(null, data);
//	});
//};
//
//exports.vote = function(source, dest, amt, dividend_asset, privkey, callback) {
//
//	this.send(source, dest, amt, dividend_asset, privkey, function(err, data) {
//		if(err) { return callback(err); }
//		callback(null, data);
//	});
//};
//
//exports.setup_election = function(source, election, options, privkey, callback) {
//	var quantity = '1000000';
//	var divisible = 'false';
//	var description = election._id;
//	var quantity_per_unit = 1;
//	var issuance = '';
//	var dividend_asset = '';


	//we have to set up a currency for each proposal
	//for (var i =0; i < election.proposals.length; i++) {
	//	this.issue(source, election.proposals[i], quantity, divisible, description, options, privkey, function(err, data) {
	//		if(err) { return callback(err); }
	//		dividend_asset = data.asset;
	//	});
////
	//	this.dividend(source, 'KSMT', dividend_asset, quantity_per_unit, options, privkey, function(err, data) {
	//		if(err) { return callback(err); }
	//		callback(null, data);
	//	});
	//}
//};
//
//exports.read_election = function(ballotbox, callback) {

//	var results = { 'yes': '', 'no':'', 'protest':'' };
//
//	this.balance(ballotbox.yes, function(err, data) {
//		if(err) { return callback(err); }
//		results.yes = data.balance;
//		this.balance(ballotbox.no, function(err, data) {
//			if(err) { return callback(err); }
//			results.no = data.balance;
//			this.balance(ballotbox.protest, function(err,data){
//				if(err) { return callback(err); }
//				results.protest = data.balance;
//				callback(null, results);
//			});
//		});
//	});
//};


///////////////////////////////////////////////////////////////////////////////
//MODULE///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//exports.send = function(source, dest, amt, currency, privkey, callback) {
//	console.log('cp_api.server.model.send: sending kismet to' + dest);
//	this.create_send(source, dest, amt, currency, function(err, unsigned_tx_hex, api) {
//		console.log('cp_api.server.model.send: ERROR: ' + err);
//		if(err) { return callback(err); }
//		console.log('cp_api.server.model.send: created tx:' + unsigned_tx_hex);
//
//		api.sign_and_broadcast(unsigned_tx_hex, privkey, function(err, data) {
//			if(err) { return callback(err); }
//			console.log('cp_api.server.model.send: returned:' + data);
//			callback(null, data);
//		});
//	});
//};
//
//exports.issue = function(source, asset, quantity, divisible, description, options, privkey, callback) {
//
//	this.create_issuance(source, asset, quantity, divisible, description, options, function(err, unsigned_tx_hex, api) {
//		if(err) { return callback(err); }
//
//		api.sign_and_broadcast(unsigned_tx_hex, privkey, function(err, data) {
//			if(err) { return callback(err); }
//			callback(null, data);
//		});
//	});
//};
//
//exports.dividend = function(source, asset, dividend_asset, quantity_per_unit, options, privkey, callback) {
//
//	this.create_dividend(source, asset, dividend_asset, quantity_per_unit, options, function(err,unsigned_tx_hex, api) {
//		if(err) { return callback(err); }
//
//		api.sign_and_broadcast(unsigned_tx_hex, privkey, function(err, data) {
//			if(err) { return callback(err); }
//			callback(null, data);
//		});
//	});
//};
//
//exports.balance = function(address, callback) {
//
//	this.get_balances(address, function(err, data) {
//		if(err) { return callback(err); }
//		callback(data);
//	});
//};


///////////////////////////////////////////////////////////////////////////////
//ABSTRACTION  LAYERS//////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//exports.sign_and_broadcast = function(unsigned_tx_hex, privkey, callback) {
//	//console.log('cp_api.server.model.sign_and_broadcast: with privKey' + privkey);
//	this.sign_tx(unsigned_tx_hex, privkey, function(err, signed_tx_hex, api) {
//		if(err) { return callback(err); }
//		//console.log('cp_api.server.model.sign_and_broadcast: signed tx:' + signed_tx_hex);
//		api.broadcast_tx(signed_tx_hex, function(err, data) {
//			//console.log('cp_api.server.model.sign_and_broadcast: returned data' + data);
//			if(err) { return callback(err); }
//			callback(null, data, this);
//		});
//	});
//};

///////////////////////////////////////////////////////////////////////////////
//API CALLS////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

exports.sign_tx = function(unsigned_tx_hex, privkey, callback) {
	var body = {
		'method' : 'sign_tx',
		'params' : {
			'unsigned_tx_hex' : unsigned_tx_hex,
			'privkey' : privkey,
		},
		'jsonrpc' : '2.0',
		'id' : Date.now(),
	};

	console.log('cp_api.server.model.sign_tx: with body:' + JSON.stringify(body));

    this.https_client(body, function(err, signed_tx_hex){
		if(err) { return callback(err); }
		console.log('cp_api.server.model.sign_tx: signed:' + signed_tx_hex);
		callback(null, signed_tx_hex, this);
    });
};

exports.broadcast_tx = function(signed_tx_hex, callback) {
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
		callback(null, data, this);
    });
};

exports.create_send = function(source, dest, amt, currency, callback) {

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

    this.https_client(body, function(err, data, api){
		if(err) {
			console.log('cp_api.server.model.create_send: https_client called back w/ ERROR: ' + err);
			return callback(err);
		}
		//console.log('cp_api.server.model.create_send: https_client called back w/ data: ' + data);
		callback(null, data, api);
    });
};

exports.create_issuance = function(source, asset, quantity, divisible, description, options, callback) {
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
		callback(null, data, this);
    });
};

exports.create_dividend = function(source, asset, dividend_asset, quantity_per_unit, options, callback) {
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
		callback(null, data, this);
    });
};


exports.get_balances = function(address, callback) {
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
		callback(null, data, this);
    });
};


///////////////////////////////////////////////////////////////////////////////
//HTTPS GATEWAY////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

exports.https_client = function(body, callback) {
	
	var options = settings.requestOptions;
	console.log('cp_api.server.model.https_client: with options:' + JSON.stringify(options));
	//send request
	var secureRequest = https.request(options, function(response) {
		console.log('https_client: request called back with response' + response.statusCode);
		
		if(response.statusCode != '200'){
			//console.log('cp_api.server.model.https_client: ' + JSON.stringify(response.headers));
			return callback(JSON.stringify(response.statusCode));
		}
		
		response.setEncoding('utf8');
		
		var responseBuff = '';
		
		response.on('data', function (chunk) {
			responseBuff += chunk;
		});

		response.on('end', function() {
			var responseObj = JSON.parse(responseBuff);
			if(responseObj.jsonrpc !== '2.0') {
				console.log('cp_api.server.model.https_client: JSON response unrecognized: ' + responseObj.jsonrpc);
				return callback(responseObj.jsonrpc);
			}
			else if(responseObj.error) {
				console.log('cp_api.server.model.https_client: ERR :' + JSON.stringify(responseObj.error));
				return callback(responseObj.error);
			}
			console.log('cp_api.server.model.https_client: JSON response: ' + JSON.stringify(responseObj));
			callback(null, responseObj.result);
		});
	});

	var bodyAsString = JSON.stringify(body);

	secureRequest.write(bodyAsString);
	secureRequest.end();
};


'use strict';

var mongoose = require('mongoose');
var settings = require('../../config/counterparty');
var https = require('https');
//var Election = mongoose.model('Election');

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
		callback(null, signed_tx_hex);
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
    this.https_client(body, function(err, tx_id){
		if(err) { return callback(err); }
		//console.log('data');
		callback(null, tx_id);
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

    this.https_client(body, function(err, data){
		if(err) {
			console.log('cp_api.server.model.create_send: https_client called back w/ ERROR: ' + err);
			return callback(err);
		}
		//console.log('cp_api.server.model.create_send: https_client called back w/ data: ' + data);
		callback(null, data);
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
		callback(null, data);
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
		callback(null, data);
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
		callback(null, data);
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
	console.log("cp trying to send request");

	secureRequest.on('error', function(error){
		console.log("caught an error");
		callback(error);
	});

	secureRequest.write(bodyAsString);
	secureRequest.end();
};

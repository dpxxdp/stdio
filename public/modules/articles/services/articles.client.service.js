'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles')
	.factory('Articles', //the name of the resource Class
	['$resource',
	function($resource) {
		return $resource('articles/:articleId',
		{
			articleId: '@_id',
		},
		{
			update: {
				method: 'PUT'
				},
			kismet: {
				method: 'POST',
				params: {
					jsonrpc:'2.0',
					method:'SEND',
					params:{amt:1},
					id:Date.now,
				}
			}
		});
	}
]);


//Comments service used for communicating with the articles REST endpoints
angular.module('articles')
	.factory('Comments', //the name of the resource Class
	['$resource',
	function($resource) {
		return $resource('comments/:parentId',
		{
			parentId: '@parent',
		});
	}
]);

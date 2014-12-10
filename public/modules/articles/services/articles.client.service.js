'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId',
		{
			articleId: '@_id'
		},
		{
			update:
				{
					method: 'PUT'
				}
				,
			kismet:
				{
					method: 'POST',
					params: {
							jsonrpc:'2.0',
							method:'SEND',
							params:{amt:1},
							id:Date.now()
								}
				}
				
		}
		);
	}
]);

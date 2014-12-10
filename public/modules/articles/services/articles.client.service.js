'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
<<<<<<< HEAD
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
=======
		return $resource('articles/:articleId', { articleId: '@_id'}, {
			update: { method: 'PUT' },
			kismet: { method: 'PUT' },
		});
>>>>>>> 353c946a6d8295b48a92773bd3ce979fa62d0c53
	}
]);

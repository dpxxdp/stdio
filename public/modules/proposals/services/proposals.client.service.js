'use strict';

angular.module('proposals')
	.factory('Proposals',
	['$resource',
	function($resource) {
		return $resource('polls/:pollId',
		{
			proposalId: '@_id',
		},
		{
			vote: { method: 'PUT', params: { pollId: 'polls' }, isArray: true },
		});
	}
]);

//angular.module('proposals')
//	.factory('Comments', //the name of the resource Class
//	['$resource',
//	function($resource) {
//		return $resource('comments/:parentId',
//		{
//			parentId: '@parent',
//		});
//	}
//]);








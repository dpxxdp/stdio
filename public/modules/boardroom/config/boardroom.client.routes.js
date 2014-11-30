'use strict';

// Setting up route
angular.module('boardroom').config(['$stateProvider',
	function($stateProvider) {
		// boardroom state routing
		$stateProvider.
		state('boardroom', {
			url: '/boardroom',
			templateUrl: 'modules/boardroom/views/boardroom.client.view.html'
		});
	}
]);
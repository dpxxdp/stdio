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

		$stateProvider.
		state('proposals', {
			url: '/boardroom/proposals/:id',
			templateUrl: 'modules/boardroom/views/boardroom.client.view.html'
		});

		$stateProvider.
		state('owners', {
			url: '/boardroom/owners',
			templateUrl: 'modules/boardroom/views/boardroom.client.view.html'
		});

	}
]);

'use strict';

// Configuring the Articles module
angular.module('boardroom').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Boardroom', 'boardroom', '/boardroom');
	}
]);
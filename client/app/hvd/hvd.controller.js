'use strict';

angular.module('ictsAppApp')
.controller('HvdCtrl', function ($scope) {

	$scope.submenu = [
	    {
	      	'title': 'Overzicht',
	      	'link': '/hvd/overview',
	      	'icon': 'fa-bar-chart'
	  	},
	  	{
	      	'title': 'Importeren',
	      	'link': '/hvd/import',
	      	'icon': 'fa-upload'
	  	}
	];
});

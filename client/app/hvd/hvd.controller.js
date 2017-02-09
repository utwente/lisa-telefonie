angular.module('ictsAppApp')
.controller('HvdCtrl', function ($scope, $filter, $http, socket, Auth, $modal) {

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
})
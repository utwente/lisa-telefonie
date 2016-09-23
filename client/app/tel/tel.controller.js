'use strict';

angular.module('ictsAppApp')
	.controller('TelCtrl', function ($scope) {
	
	$scope.submenu = [
		{
			'title': 'Overzicht',
			'link': '/tel/dashboard',
			'icon': 'fa-bar-chart'		
		},
		{
			'title': 'Gegevens',
			'link': '/tel/gegevens',
			'icon': 'fa-users',
			'submenu': [
				{
					'title': 'Klantgegevens',
					'link': '/tel/customer'
				},{
					'title': 'Afdelingen',
					'link': '/tel/department'
				},{
					'title': 'Vaste specificaties',
					'link': '/tel/specification'
				}
			]

		},
		{
			'title': 'Invoeren',
			'link': '/tel/import',
			'icon': 'fa-upload',
			'submenu': [
				{
					'title': 'KPN',
					'link': '/tel/kpn'
				},
				{
					'title': 'T-Mobile',
					'link': '/tel/t-mobile'
				},
			]
		},
		{
			'title': 'Uitvoeren',
			'link': '/tel/export',
			'icon': 'fa-download',
			'submenu': [
				{
					'title': 'Dot bestand',
					'link': '/tel/dot'
				},
				{
					'title': 'Specificaties mailen',
					'link': '/tel/email'
				},
			]
		},
		{
			'title': 'Analyse',
			'link': '/tel/analyse',
			'icon': 'fa-search',
			'submenu': [
				{
					'title': 'Analyseer nummer',
					'link': '/tel/analysis'
				},
				{
					'title': 'Data overzicht',
					'link': '/tel/data'
				},
			]
		},
	];

	
  });

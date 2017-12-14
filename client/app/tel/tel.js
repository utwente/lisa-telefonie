'use strict';

angular.module('ictsAppApp')
	.config(['$stateProvider', '$urlRouterProvider',
		function ($stateProvider, $urlRouterProvider) {

			$urlRouterProvider
				.when('/tel', '/tel/dashboard')
				.when('/tel/gegevens', '/tel/customer')
				.when('/tel/import', '/tel/kpn')
				.when('/tel/export', '/tel/dot')
				.when('/tel/analyse', '/tel/analysis');

			$stateProvider
				.state('tel', {
					abstract: true,
					url: '/tel',
					templateUrl: 'app/tel/tel.html',
					controller: 'TelCtrl',
					authenticate: true
				})
					.state('tel.default', {
						url: '/dashboard',
						templateUrl: 'app/tel/dashboard/dashboard.html',
						controller: 'TelDashboardCtrl',
						authenticate: true
					})
					.state('tel.customer', {
						url: '/customer',
						templateUrl: 'app/tel/customer/customer.html',
						controller: 'TelCustomerCtrl',
						authenticate: true
					})
					.state('tel.department', {
						url: '/department',
						templateUrl: 'app/tel/department/department.html',
						controller: 'TelDepartmentCtrl',
						authenticate: true
					})
					.state('tel.specification', {
						url: '/specification',
						templateUrl: 'app/tel/specification/specification.html',
						controller: 'TelSpecificationCtrl',
						authenticate: true
					})
					.state('tel.kpn', {
						url: '/kpn',
						templateUrl: 'app/tel/kpn/kpn.html',
						controller: 'TelKpnCtrl',
						authenticate: true
					})
					.state('tel.t-mobile', {
						url: '/t-mobile',
						templateUrl: 'app/tel/t-mobile/t-mobile.html',
						controller: 'TelTMobileCtrl',
						authenticate: true
					})
					.state('tel.tele2', {
						url: '/tele2',
						templateUrl: 'app/tel/tele2/tele2.html',
						controller: 'Tele2Ctrl',
						authenticate: true
					})
					.state('tel.dot', {
						url: '/dot',
						templateUrl: 'app/tel/dot/dot.html',
						controller: 'TelDotCtrl',
						authenticate: true
					})
					.state('tel.data', {
						url: '/data',
						templateUrl: 'app/tel/data/data.html',
						controller: 'DataCtrl',
						authenticate: true
					})
					.state('tel.email', {
						url: '/email',
						templateUrl: 'app/tel/email/email.html',
						controller: 'EmailCtrl',
						authenticate: true
					})
					.state('tel.analysis', {
						url: '/analysis',
						templateUrl: 'app/tel/analysis/analysis.html',
						controller: 'landlineAnalysis',
						authenticate: true
					});

		}
	]);

 'use strict';

angular.module('ictsAppApp', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'btford.socket-io',
	'ui.router',
	'ui.bootstrap',
	'ngTable',
	'ngTableExport',
	'ngMessages',
	'angular.filter',
  'chart.js',
])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$qProvider',
	function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $qProvider) {
		$qProvider.errorOnUnhandledRejections(true);

		$urlRouterProvider
			.otherwise('/tel');

		$locationProvider.html5Mode(true);
		$httpProvider.interceptors.push('authInterceptor');
	}
])

.factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
	return {
		// Add authorization token to headers
		request: function (config) {
			config.headers = config.headers || {};
			if ($cookieStore.get('token')) {
				config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
			}
			return config;
		},

		// Intercept 401s and redirect you to login
		responseError: function (response) {
			if (response.status === 401) {
				$location.path('/login');
				// remove any stale tokens
				$cookieStore.remove('token');
				return $q.reject(response);
			} else {
				return $q.reject(response);
			}
		}
	};
})

.run(function ($rootScope, $state, $location, Auth) {
	// Redirect to login if route requires auth and you're not logged in
	$rootScope.$on('$stateChangeStart', function (event, next) {
		Auth.isLoggedInAsync(function (loggedIn) {
			if (next.authenticate && !loggedIn) {
				$location.path('/login');
			}
		});
	});

	// Redirect to default page
	$rootScope.$on('$stateChangeStart', function(evt, to, params) {
      if (to.redirectTo) {
        evt.preventDefault();
        $state.go(to.redirectTo, params, {location: 'replace'});
      }
    });

	// a little ugly, but had to add it somewhere...

	// unit to make camelcase!
	String.prototype.toCamel = function() {
	    return this.toLowerCase().replace(/(\ [a-z])/g, function($1){return $1.toUpperCase().replace(' ','');});
	};

	// unit to make normal (from camelcase)!
	String.prototype.toNormal = function() {
	    return this.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^[a-z]/, function(m){ return m.toUpperCase(); });
	};

});

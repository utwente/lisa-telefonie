'use strict';

angular.module('ictsAppApp')
	.controller('landlineAnalysis', function($scope, $http, $timeout, $filter, Morris, morrisDataFormatter) {

		var tMobile;

		$scope.start = true;

		$scope.$watch('data.month', function() {
			if (typeof $scope.data !== 'undefined') {
				$http.get('/api/t_mobile/' + $scope.data.month)
					.success(function(data) {
						console.log('Month loaded');
						$scope.t_mobile = data;
					})
					.error(function(res) {
						console.log('T-Mobile not found...');
					});
			}
		}, true);


		var donut;

		$scope.loadDetails = function(n) {

			// this is input data for the "donut". Donut stuff happens in app/directives/donut
			$scope.details = n;

			// this filter parses the data and adds the costs abroad (filter is in app/filters/data-abroad), moved it there to clean this part up
			$scope.dataAbroad = $filter('data_abroad')(n);

			// this filter parses the data and adds the calls abroad (filter is in app/filters/calls-abroad), moved it there to clean this part up
			$scope.callsAbroad = $filter('calls_abroad')(n);

		}

});

'use strict';

angular.module('ictsAppApp')
	.controller('TelDepartmentDeleteModalCtrl', function ($scope, $http, $modalInstance, department) {
		$scope.department = department;

		$http.get('/api/customers/department/' + department._id).
			success(function(customers){
				if (customers.length < 1) { customers = undefined; }
				$scope.customers = customers;
			});

		$scope.delete = function () {
			$modalInstance.close();
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

	});

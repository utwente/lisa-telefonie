'use strict';

angular.module('ictsAppApp')
	.controller('TelDepartmentDeleteModalCtrl', ['$scope', '$http', '$modalInstance', 'message', 'department',
	function ($scope, $http, $modalInstance, message, department) {

		$scope.department = department;

		$http.get('/api/customers/department/' + department._id)
			.then(function(customers){
				if (customers.data.length < 1) { customers.data = undefined; }
				$scope.customers = customers.data;
			})
			.catch(err => {
				console.log(err);
				message.error('Er ging iets mis bij het verwijderen van de afdeling..');
			});

		$scope.delete = function () {
			$modalInstance.close();
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

	}]);

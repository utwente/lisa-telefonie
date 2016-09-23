'use strict';

angular.module('ictsAppApp')
	.controller('TelDepartmentDeleteModalCtrl', function ($scope, $modalInstance, department) {
		$scope.department = department;

		$scope.delete = function () {
			$modalInstance.close();
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

	});
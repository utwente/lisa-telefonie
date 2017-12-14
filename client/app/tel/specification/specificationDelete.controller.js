'use strict';

angular.module('ictsAppApp')
	.controller('TelSpecificationDeleteModalCtrl', ['$scope', '$modalInstance', 'specification',
	function ($scope, $modalInstance, specification) {
		$scope.specification = specification;

		$scope.delete = function () {
			$modalInstance.close();
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

	}]);

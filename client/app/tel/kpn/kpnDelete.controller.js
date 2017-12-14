'use strict';

angular.module('ictsAppApp')
	.controller('TelKpnDeleteModalCtrl', ['$scope', '$modalInstance', 'record',
	function ($scope, $modalInstance, record) {
		$scope.record = record;

		$scope.delete = function () {
			$modalInstance.close();
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

	}]);

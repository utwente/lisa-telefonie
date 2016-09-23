'use strict';

describe('Controller: TelDepartmentCtrl', function () {
	// load the controller's module
	beforeEach(module('ictsAppApp'));

	var TelDepartmentCtrl, scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope) {
		scope = $rootScope.$new();
		TelDepartmentCtrl = $controller('TelDepartmentCtrl', {
			$scope: scope
		});
	}));

	it('should ...', function () {
		expect(1).toEqual(1);
	});
});
/*jshint -W055 */
/*global Papa */
'use strict';

angular.module('ictsAppApp')
	.controller('TelDepartmentCtrl', ['$scope', '$http', '$filter', 'socket', 'ngTableParams', '$modal', 'message',
	function($scope, $http, $filter, socket, ngTableParams, $modal, message) {
		$scope.departments = [];
		$scope.departmentsLoaded = false;
		$scope.newDepartment = {};
		$scope.today = new Date();

		$scope.$watch('newDepartment.name', function () {
			$scope.newDepartment.name = $filter('uppercase')($scope.newDepartment.name);
		});

		$scope.newDepartmentAccordion = {
			open: false
		};

		$http.get('/api/departments').then(function (departments) {
			$scope.departments = departments.data;
			$scope.departmentsLoaded = true;
			socket.syncUpdates('department', $scope.departments);

		});

		$scope.tableParams = new ngTableParams({}, {
			// debugMode: true,
			total: $scope.departments.length, // length of data
			count: $scope.departments.length, // No pagination
			counts: [], // Hide pagination 'n per page' buttons
		});
		$scope.sort = {
			predicate: 'name',
			reverse: false
		};

		$scope.addDepartment = function (department) {
			if (department === undefined) {
				department = $scope.newDepartment;
			}
			if (department === undefined || department.name === '') {
				return;
			}
			$http.post('/api/departments', {
				name: department.name,
				email: department.email
			}).then(function () {
				$scope.newDepartment = {};
				$scope.addDepartmentForm.$setPristine();
				$scope.addDepartmentForm.$setUntouched();
				message.success('Opslaan afdeling gelukt!');
			}).catch(function (err) {
				console.log(err);
				message.error('Opslaan afdeling niet gelukt..');
			});

		};

		$scope.updateDepartment = function (department) {
			$http.put('/api/departments/' + department._id, department)
				.then(function () {
					department.$edit = false;
					department.updated = true;
					message.success('De afdeling is bijgewerkt!');
				})
				.catch(() => message.error('Bijwerken afdeling niet gelukt..'));
		};
		$scope.reset = function (department) {
			$http.get('/api/departments/' + department._id)
				.then(function (data) {
					department.name = data.name;
					department.email = data.email;
					department.$edit = false;
				})
				.catch(() => message.error('Ophalen afdelingen niet gelukt..'));
		};

		// Delete
		$scope.deleteDepartmentModal = function (department) {
			var modalInstance = $modal.open({
				templateUrl: 'app/tel/department/departmentDelete.modal.html',
				controller: 'TelDepartmentDeleteModalCtrl',
				scope: $scope,
				resolve: {
					department: function () {
						return department;
					}
				}
			});

			modalInstance.result.then(function () {
				$scope.deleteDepartment(department);
			}, function () {
				// Dismissed
			});
		};
		$scope.deleteDepartment = function (department) {
			$http.delete('/api/departments/' + department._id)
				.then(function () {
					message.success('De afdeling is verwijderd!');
				})
				.catch((err) => {
					console.log(err);
					message.error('Er ging iets mis bij het verwijderen van de afdeling');
				});
		};

		$scope.$on('$destroy', function () {
			socket.unsyncUpdates('department');
		});


		$scope.massImport = {
			total: 0,
			finished: 0,
			errors: 0
		};
		$scope.importDepartments = function ($fileContent) {
			$fileContent = $fileContent.replace(/\"/g, '').replace(/,00/g, '');
			var lines = $fileContent.split('\n');
			lines.splice(lines.length - 1, 1);
			var csv = lines.join('\n');
			var csvContent = Papa.parse(csv, {
				delimiter: ';'
			});

			var departments = [];
			var department;
			for (var i = 0; i < csvContent.data.length; i++) {

				department = csvContent.data[i];

				departments[i] = {
					name: department[1],
					email: department[2]
				};
			}

			for (var x = 0; x < departments.length; x++) {
				$scope.addDepartment(departments[x]);
			}

		};
		
	}]);

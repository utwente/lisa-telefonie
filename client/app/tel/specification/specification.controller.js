/*jshint -W055 */
/*global Papa */

'use strict';

angular.module('ictsAppApp')
	.controller('TelSpecificationCtrl', ['$scope', '$http', '$filter', 'socket', 'ngTableParams', '$modal', 'message',
	function ($scope, $http, $filter, socket, ngTableParams, $modal, message) {
		$scope.specifications = [];
		$scope.newSpecification = {
			number: '',
			name: '',
			email: ''
		};
		$scope.today = new Date();

		$scope.newSpecificationAccordion = {
			open: false
		};

		$http.get('/api/specifications').then(function (specifications) {
			$scope.specifications = specifications.data;
			$scope.specificationsLoaded = true;
			socket.syncUpdates('specification', $scope.specifications);

		});

		$scope.tableParams = new ngTableParams({}, {
			// debugMode: true,
			total: $scope.specifications.length, // length of data
			count: $scope.specifications.length, // No pagination
			counts: [], // Hide pagination 'n per page' buttons
		});
		$scope.sort = {
			predicate: 'number',
			reverse: false
		};

		$scope.addSpecification = function (specification) {
			if(specification===undefined) {
				specification = $scope.newSpecification;
			}
			if (specification === undefined || specification.name === '') {
				return;
			}
			$http.post('/api/specifications', {
				number: specification.number,
				name: specification.name,
				email: specification.email
			}).then(function () {
				$scope.newSpecification = {};
        $scope.addSpecificationForm.$setPristine();
        $scope.addSpecificationForm.$setUntouched();
				message.success('Nieuwe persoonlijke specificatie opgeslagen!');
			}).catch(function(err) {
				console.log(err);
				message.error('Er ging iets mis bij het opslaan..');
			});

		};

		$scope.updateSpecification = function (specification) {
			$http.put('/api/specifications/' + specification._id, specification)
				.then(function () {
					specification.$edit = false;
					// $scope.tableParams.reload();
					console.log('saved :) ');
					specification.updated = true;
					//$('#'+specification._id).addClass('blink');
				});
		};
		$scope.reset = function (specification) {
			$http.get('/api/specifications/' + specification._id)
				.then(function (spec) {
					specification.name = spec.data.name;
					specification.email = spec.data.email;
					specification.$edit = false;
				});
		};

		// Delete
		$scope.deleteSpecificationModal = function (specification) {
			var modalInstance = $modal.open({
				templateUrl: 'app/tel/specification/specificationDelete.modal.html',
				controller: 'TelSpecificationDeleteModalCtrl',
				scope: $scope,
				resolve: {
					specification: function () {
						return specification;
					}
				}
			});

			modalInstance.result.then(function () {
				$scope.deleteSpecification(specification);
			}, function () {
				// Dismissed
			});
		};
		$scope.deleteSpecification = function (specification) {
			$http.delete('/api/specifications/' + specification._id)
				.then(function () {
					// $scope.tableParams.reload();
				});
		};

		$scope.$on('$destroy', function () {
			socket.unsyncUpdates('specification');
		});







		/**
		 * Mass import
		 */
		$scope.specificationsLoaded = false;
		$scope.massImport = {
			total: 0,
			finished: 0,
			errors: 0
		};
		$scope.importCustomers = function ($fileContent) {
			$fileContent = $fileContent.replace(/\"/g, '').replace(/,00/g, '');
			var lines = $fileContent.split('\n');
			lines.splice(lines.length - 1, 1);
			var csv = lines.join('\n');
			var csvContent = Papa.parse(csv, {
				delimiter: ';'
			});

			var specifications = [];
			var specification;
			for (var i = 0; i < csvContent.data.length; i++) {

				specification = csvContent.data[i];

				specifications[i] = {
					number: specification[0],
					name: '-',
					email: specification[1]
				};
			}

			for (var x = 0; x < specifications.length; x++) {
				$scope.addSpecification(specifications[x]);
			}

		};




	}]);

'use strict';

angular.module('ictsAppApp')
  .controller('OverviewCtrl', function ($scope, $filter, $http, socket, Auth, $modal) {

      $scope.newHvd = {};

      $scope.hvds = [];
      $scope.hvdsLoaded = false;

      $scope.isLoggedIn = Auth.isLoggedIn;

      // Pagination in controller
      $scope.currentPage = 0;
      $scope.pageSize = 50;
      $scope.setCurrentPage = function(currentPage) {
          $scope.currentPage = currentPage;
      }

      $scope.getNumberAsArray = function (num) {
          return new Array(num);
      };

      $scope.numberOfPages = function() {
          return Math.ceil($scope.filtered.length / $scope.pageSize);
      };

      $scope.$watch('search', function() {
          $scope.currentPage = 0;
      });
      // end pagination

      $http.get('/api/hvd').success(function (hvds) {
          $scope.hvds = hvds;
          $scope.hvdsLoaded = true;
          socket.syncUpdates('hvd', $scope.hvds);
      });

      $scope.addHvd = function (hvd) {
          if (hvd === undefined) {
              hvd = $scope.newHvd;
          }
          if (hvd === undefined || hvd.phoneNumber === '') {
              return;
          }

          if(hvd.phoneNumber.length === 4) {
              hvd.phoneNumber = "3153489" + hvd.phoneNumber;
          }
          $http.post('/api/hvd', {
              phoneNumber: hvd.phoneNumber,
              mediapack: hvd.mediapack,
              mediapackPort: hvd.mediapackPort,
              hvd: hvd.hvd,
              to: hvd.to,
              po: hvd.po,
              location: hvd.location,
              comment: hvd.comment
          }).success(function (data, status, headers, config) {
              $scope.newHvd = {};
          }).error(function (data, status, headers, config) {
              console.log('error saving ');
          });

      };

      $scope.addEditHvd = function (hvd) {
          var modalInstance = $modal.open({
              templateUrl: 'app/hvd/hvdEdit.modal.html',
              controller: 'HvdEditModalCtrl',
              scope: $scope,
              resolve: {
                  hvd: function () {
                      return hvd;
                  }
              }
          })
      };

      $scope.delete = function(hvd) {
          $http.delete('/api/hvd/' + hvd._id )
              .success(function(data) {
              });
      };
    
  });

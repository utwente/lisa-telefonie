'use strict';

angular.module('ictsAppApp')
  .controller('HvdCtrl', function ($scope, $filter, $http, socket, Auth) {

      $scope.newHvd = {};

      $scope.hvds = [];
      $scope.hvdsLoaded = false;

      $scope.isLoggedIn = Auth.isLoggedIn;

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
          $http.post('/api/hvd', {
              phoneNumber: hvd.phoneNumber,
              mediapack: hvd.mediapack,
              mediapackPort: hvd.mediaPackPort,
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

      $scope.delete = function(hvd) {
          // TODO: Not working yet
          $http.delete('/api/hvd/' + hvd._id + '/deactivate')
              .success(function(data) {
              });
      };
    
  });

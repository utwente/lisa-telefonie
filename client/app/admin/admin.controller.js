'use strict';

angular.module('ictsAppApp')
  .controller('AdminCtrl', ['$scope', '$http', 'Auth', 'User', function ($scope, $http, Auth, User) {

    $scope.newUser = {};

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.addUser = function() {
      if (!$scope.newUser){ return; }
      if ($scope.newUser.admin) {
        $scope.newUser.role = 'admin';
      } else {
        $scope.newUser.role = 'user';
      }
      User.save($scope.newUser, function(){
        $scope.users.push($scope.newUser);
        $scope.newUser = {};
      });
    };

    $scope.delete = function(user) {
      User.remove({ id: user._id }, function(){
        angular.forEach($scope.users, function(u, i) {
          if (u === user) {
            $scope.users.splice(i, 1);
          }
        });
      });
    };
  }]);

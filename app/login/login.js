'use strict';

angular.module('myApp')

.controller('LoginCtrl', ['$scope', '$location', function($scope, $location) {
  $scope.login = function() {
    // if ($scope.username === 'astellas' && $scope.password === '123') {
      $location.path('/view1');
    // } else {
    //   $scope.error = 'Wrong username or password';
    // }
  };
}]);

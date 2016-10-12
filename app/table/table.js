'use strict';

angular.module('myApp')

.controller('TableCtrl', ['$scope', function($scope) {
  console.log($scope.filter);
  $scope.criteriaMatch = function(row) {
    // console.log(row);
    var os = row[1];
    var region = row[2];
    var loc = row[3];
    var env = row[4];
    var model = row[5];

    return ($scope.filter.os === 'All' || $scope.filter.os === os) &&
      ($scope.filter.region === 'All' || $scope.filter.region === region) &&
      ($scope.filter.loc === 'All' || $scope.filter.loc === loc) &&
      ($scope.filter.env === 'All' || $scope.filter.env === env) &&
      ($scope.filter.model === 'All' || $scope.filter.model === model);
  };
}]);

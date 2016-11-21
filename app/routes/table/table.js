'use strict';

angular.module('myApp')

.controller('TableCtrl', ['$scope', '$state', 'AuthService', function($scope, $state, AuthService) {
  if (!AuthService.isLoggedIn()) {
    $state.go('login');
  }

  var all = '_All';

  $scope.getClass = function(d, i) {
    var dateString;
    if (i === 1) {
      dateString = $scope.osEol[d];
    } else if (i === 5) {
      dateString = $scope.hwEol[d];
    }
    if (dateString) {
      var date = $scope.convertToDate(dateString);

      if (date < Date.now()) {
        return 'eol-overdue';
      } else if (date < $scope.sixMonths) {
        return 'eol-six-months';
      } else if (date < $scope.twelveMonths) {
        return 'eol-twelve-months';
      } else if (date < $scope.eighteenMonths) {
        return 'eol-eighteen-months';
      } else if (date < $scope.twentyfourMonths) {
        return 'eol-twentyfour-months';
      }
    }
  };

  $scope.criteriaMatch = function(row) {
    var os = row[1];
    var region = row[2];
    var loc = row[3];
    var env = row[4];
    var model = row[5];
    var app = row[6];

    var osEol = $scope.convertToDate($scope.osEol[os]);
    var hwEol = $scope.convertToDate($scope.hwEol[model]);

    return ($scope.filter.os === all || $scope.filter.os === os) &&
      ($scope.filter.region === all || $scope.filter.region === region) &&
      ($scope.filter.loc === all || $scope.filter.loc === loc) &&
      ($scope.filter.env === all || $scope.filter.env === env) &&
      ($scope.filter.model === all || $scope.filter.model === model) &&
      ($scope.filter.app === all || $scope.filter.app === app) &&
      ((osEol > $scope.startDate && osEol < $scope.endDate) ||
        (hwEol > $scope.startDate && hwEol < $scope.endDate));
  };
}]);

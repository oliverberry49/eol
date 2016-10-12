'use strict';

angular.module('myApp')

.controller('HomeCtrl', ['$scope', '$state', '$window', 'DateService', 'AuthService', function($scope, $state, $window, DateService, AuthService) {
  if (!AuthService.isLoggedIn()) {
    $state.go('login');
  }

  $scope.convertToDate = function(dateString) {
    if (dateString) {
      var split = dateString.split('/');
      var date = new Date(split[2], split[1], split[0]);
      return date;
    }
  };

  $scope.getTable = function() {
    $state.transitionTo('home.table');
  };

  $scope.resetFilters = function() {
    $scope.filter = {
      os: "All",
      loc: "All",
      region: "All",
      env: "All",
      model: "All",
      app: "All"
    };
  };

  // Date picker

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  $scope.dateOptions = {
    maxDate: new Date(),
    minDate: new Date(),
  };

  var updateDates = function() {
    $scope.startDate = DateService.getStartDate();
    $scope.endDate = DateService.getEndDate();
    $scope.$apply();
  };

  DateService.registerObserverCallback(updateDates);

  var d3 = $window.d3;
  var headers = ['Host Name', 'OS', 'REGION', 'LOCATION', 'System Classification', 'MODEL']; // 'Application'
  $scope.headers = ['Host Name', 'OS', 'Region', 'Location', 'Environment', 'Model']; // 'Application'
  $scope.allrows = [];
  $scope.rows = [];

  var filterIndexes = ['', 'os', 'region', 'loc', 'env', 'model', 'app'];

  var now = Date.now();
  $scope.sixMonths = new Date(now);
  $scope.sixMonths.setMonth($scope.sixMonths.getMonth() + 6);
  $scope.twelveMonths = new Date(now);
  $scope.twelveMonths.setMonth($scope.twelveMonths.getMonth() + 12);
  $scope.eighteenMonths = new Date(now);
  $scope.eighteenMonths.setMonth($scope.eighteenMonths.getMonth() + 18);
  $scope.twentyfourMonths = new Date(now);
  $scope.twentyfourMonths.setMonth($scope.twentyfourMonths.getMonth() + 24);

  $scope.filterOptions = {
    os: {'All': true},
    region: {'All': true},
    loc: {'All': true},
    env: {'All': true},
    model: {'All': true},
    app: {'All': true}
  };

  d3.csv('dataset.csv', function(d) {
    var row = [];

    for (var i in headers) {
      var header = headers[i];
      var data = d[header];
      if (data) {
        if (header !== 'Host Name') {
          var filter = filterIndexes[i];
          $scope.filterOptions[filter][data] = true;
        }
      } else {
        data = "";
      }
      row.push(data);
    }

    return row;
  }, function(error, rows) {
    if (error) {
      console.log(error);
      return;
    }

    $scope.rows = rows;
  });

  $scope.osEol = {};
  d3.csv('os_eol.csv', function(d) {
    var date = d['EoL or EoS Date'];
    $scope.osEol[d.OS] = date;

    date = $scope.convertToDate(date);
    if (date < $scope.dateOptions.minDate) {
      $scope.dateOptions.minDate = date;
    } else if (date > $scope.dateOptions.maxDate) {
      $scope.dateOptions.maxDate = date;
    }
  }, function(error, rows) {
    if (error) {
      console.log(error);
      return;
    }

    DateService.setStartDate($scope.dateOptions.minDate);
    DateService.setEndDate($scope.dateOptions.maxDate);
  });

  $scope.hwEol = {};
  d3.csv('hw_eol.csv', function(d) {
    var date = d['EoL or EoS Date'];
    $scope.hwEol[d.Model] = date;

    date = $scope.convertToDate(date);
    if (date < $scope.dateOptions.minDate) {
      $scope.dateOptions.minDate = date;
    } else if (date > $scope.dateOptions.maxDate) {
      $scope.dateOptions.maxDate = date;
    }
  }, function(error, rows) {
    if (error) {
      console.log(error);
      return;
    }

    DateService.setStartDate($scope.dateOptions.minDate);
    DateService.setEndDate($scope.dateOptions.maxDate);
  });

  $scope.resetFilters();
  $state.transitionTo('home.dashboard');
}]);

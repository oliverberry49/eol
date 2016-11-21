'use strict';

angular.module('myApp')

.controller('HomeCtrl', ['$scope', '$state', '$window', '$q', 'DateService', 'AuthService', function($scope, $state, $window, $q, DateService, AuthService) {

  $scope.assets = [];

  var headers = ['Host Name', 'OS', 'REGION', 'LOCATION', 'Environment', 'MODEL', 'APPLICATION'];
  $scope.headers = ['Host Name', 'OS', 'Region', 'Location', 'Environment', 'Model', 'Application'];

  // General functions

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

  $scope.logout = function() {
    AuthService.logout();
    $state.go('login');
  };

  $scope.resetFilters();
  $state.transitionTo('home.dashboard');

  // Table functions

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

    return ($scope.filter.os === 'All' || $scope.filter.os === os) &&
      ($scope.filter.region === 'All' || $scope.filter.region === region) &&
      ($scope.filter.loc === 'All' || $scope.filter.loc === loc) &&
      ($scope.filter.env === 'All' || $scope.filter.env === env) &&
      ($scope.filter.model === 'All' || $scope.filter.model === model) &&
      ($scope.filter.app === 'All' || $scope.filter.app === app) &&
      ((osEol > $scope.startDate && osEol < $scope.endDate) ||
        (hwEol > $scope.startDate && hwEol < $scope.endDate));
  };

  $scope.exportRows = function() {
    var deferred = $q.defer();

    d3.csv('dataset.csv', function(d) {
      var criteriaRow = [];

      for (var i in headers) {
        var header = headers[i];
        var data = d[header];
        criteriaRow.push(data);
      }

      if ($scope.criteriaMatch(criteriaRow)) {
        return d;
      }
    }, function(error, rows) {
      if (error) {
        console.log(error);
        deferred.reject(error);
        return;
      }

      var string = d3.csv.format(rows);
      var allRows = d3.csv.parseRows(string);
      deferred.resolve(allRows);
    });

    return deferred.promise;
  };

  $scope.sortBy = function(header) {
    if ($scope.sorted === header) {
      $scope.reverse = !$scope.reverse;
    } else {
      $scope.sorted = header;
      $scope.reverse = false;
    }
    $scope.sortedIndex = $scope.headers.indexOf($scope.sorted);
  };

  $scope.predicate = function(val) {
    if ($scope.sorted) {
      return val[$scope.sortedIndex];
    }
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

  // Generate data for table, filters and dashboard

  var d3 = $window.d3;
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

  var overview = {
    overdue: 0,
    six: 0,
    twelve: 0,
    eighteen: 0,
    twentyfour: 0
  };

  // CSV Utility functions

  var assignDateBuckets = function(date) {
    if (date < Date.now()) {
      overview.overdue++;
    } else if (date < $scope.sixMonths) {
      overview.six++;
    } else if (date < $scope.twelveMonths) {
      overview.twelve++;
    } else if (date < $scope.eighteenMonths) {
      overview.eighteen++;
    } else if (date < $scope.twentyfourMonths) {
      overview.twentyfour++;
    }
  };

  var assignAssets = function() {
    $scope.assets = [
      overview.overdue,
      overview.six,
      overview.twelve,
      overview.eighteen,
      overview.twentyfour
    ];
  };

  // Get CSV files

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
    assignDateBuckets(date);

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

    assignAssets();

    DateService.setStartDate($scope.dateOptions.minDate);
    DateService.setEndDate($scope.dateOptions.maxDate);
  });

  $scope.hwEol = {};
  d3.csv('hw_eol.csv', function(d) {
    var date = d['EoL or EoS Date'];
    $scope.hwEol[d.Model] = date;

    date = $scope.convertToDate(date);
    assignDateBuckets(date);

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

    assignAssets();

    DateService.setStartDate($scope.dateOptions.minDate);
    DateService.setEndDate($scope.dateOptions.maxDate);
  });
}]);

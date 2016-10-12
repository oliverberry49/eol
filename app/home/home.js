'use strict';

angular.module('myApp')

.controller('HomeCtrl', ['$scope', '$state', '$window', function($scope, $state, $window) {

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

  var d3 = $window.d3;
  var headers = ['Host Name', 'OS', 'REGION', 'LOCATION', 'System Classification', 'MODEL']; // 'Application'
  $scope.headers = ['Host Name', 'OS', 'Region', 'Location', 'Environment', 'Model']; // 'Application'
  $scope.allrows = [];
  $scope.rows = [];

  var filterIndexes = ['', 'os', 'region', 'loc', 'env', 'model', 'app'];

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
    console.log($scope.rows);
  });

  $scope.resetFilters();
  $state.transitionTo('home.dashboard');
}]);

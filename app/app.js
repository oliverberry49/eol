'use strict';

angular.module('myApp', [
  'ui.router',
  'ui.bootstrap',
  'ngSanitize',
  'ngCsv'
])

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode({
    enabled: true
  });

  var auth = function($q, $state, $timeout, AuthService) {
    var deferred = $q.defer();

    $timeout(function() {
      if (!AuthService.isLoggedIn()) {
        $state.go('login');
        deferred.reject();
      } else {
        deferred.resolve();
      }
    });

    return deferred.promise;
  };

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'routes/login/login.html',
      controller: 'LoginCtrl'
    })
    .state('home', {
      url: '/home',
      templateUrl: 'routes/home/home.html',
      controller: 'HomeCtrl',
      resolve: {
        auth: auth
      }
    })
    .state('home.dashboard', {
      url: '/dashboard',
      templateUrl: 'routes/dashboard/dashboard.html'
    })
    .state('home.table', {
      url: '/table',
      templateUrl: 'routes/table/table.html'
    });

  $urlRouterProvider
    .otherwise('/login');
});

'use strict';

angular.module('myApp', [
  'ui.router'
])

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode({
    enabled: true
  });

  $urlRouterProvider
    .otherwise('/login');

  $stateProvider.state({
    name: 'login',
    url: '/login',
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });

  $stateProvider.state({
    name: 'view1',
    url: '/view1',
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
});

'use strict';

angular.module('myApp', [
  'ui.router',
  'ui.bootstrap'
])

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode({
    enabled: true
  });

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'login/login.html',
      controller: 'LoginCtrl'
    })
    .state('home', {
      url: '/home',
      templateUrl: 'home/home.html',
      controller: 'HomeCtrl'
    })
    .state('home.dashboard', {
      url: '/dashboard',
      templateUrl: 'dashboard/dashboard.html',
      controller: 'DashboardCtrl'
    })
    .state('home.table', {
      url: '/table',
      templateUrl: 'table/table.html',
      controller: 'TableCtrl'
    });

  $urlRouterProvider
    .otherwise('/home');
});

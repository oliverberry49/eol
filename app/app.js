'use strict';

angular.module('myApp', [
  'ui.router'
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
    .state('view1', {
      url: '/view1',
      templateUrl: 'view1/view1.html',
      controller: 'View1Ctrl'
    });

  $urlRouterProvider
    .otherwise('/view1');
});

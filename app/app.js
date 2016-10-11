'use strict';

angular.module('myApp', [
  'ui.router'
])

.config(function($stateProvider) {
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

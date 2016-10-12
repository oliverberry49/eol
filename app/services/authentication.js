'use strict';

angular.module('myApp')

.factory('AuthService', function() {
  var loggedIn = false;

  var login = function(username, password) {
    loggedIn = username === 'astellas' && password === '123';
    return loggedIn;
  };

  var isLoggedIn = function() {
    return loggedIn;
  };

  return {
    login: login,
    isLoggedIn: isLoggedIn
  };
});

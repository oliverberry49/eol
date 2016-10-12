'use strict';

angular.module('myApp')

.factory('DateService', function() {
  var observerCallbacks = [];

  var startDate = new Date();
  var endDate = new Date();

  //register an observer
  var registerObserverCallback = function(callback) {
    observerCallbacks.push(callback);
  };

  //call this when you know 'foo' has been changed
  var notifyObservers = function() {
    angular.forEach(observerCallbacks, function(callback) {
      callback();
    });
  };

  var setStartDate = function(date) {
    startDate = date;
    notifyObservers();
  };

  var setEndDate = function(date) {
    endDate = date;
    notifyObservers();
  };

  return {
    getStartDate: function() {
      return startDate;
    },
    getEndDate: function() {
      return endDate;
    },
    setStartDate: setStartDate,
    setEndDate: setEndDate,
    registerObserverCallback: registerObserverCallback
  };
});

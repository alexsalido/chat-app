'use strict';

angular.module('chatApp')
  .directive('chips', function () {
    return {
      templateUrl: 'app/dashboard/chips/chips.html',
      restrict: 'E',
	  controller: function ($scope) {
	  },
      link: function (scope, element, attrs) {
      }
    };
  });

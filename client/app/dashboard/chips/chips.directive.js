'use strict';

angular.module('chatApp')
  .directive('chips', function () {
    return {
      templateUrl: 'app/dashboard/chips/chips.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
'use strict';

angular.module('chatApp')
  .directive('searchBox', function () {
    return {
      templateUrl: 'app/dashboard/searchbox/searchbox.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });

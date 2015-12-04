'use strict';

angular.module('chatApp')
  .directive('searchBox', function () {
    return {
      templateUrl: 'app/dashboard/searchbox/searchbox.html',
      restrict: 'E',
	  scope: {
		  src: '='  
	  },
      link: function (scope, element, attrs) {
		  scope.placeholder = attrs.placeholder;
      }
    };
  });

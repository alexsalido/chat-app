'use strict';

angular.module('chatApp')
  .directive('profile', function ($mdSidenav) {
    return {
      templateUrl: 'app/dashboard/profile/profile.html',
      restrict: 'E',
	  controller: function ($scope) {
		  $scope.editStatus = false;
		  
		  $scope.toggleProfileInfo = function () {
			  $mdSidenav('profile-info').toggle()
		  };

		  $scope.changeStatus = function () {

		  };
	  },
      link: function (scope, element, attrs) {
      }
    };
  });

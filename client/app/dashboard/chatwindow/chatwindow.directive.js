'use strict';

angular.module('chatApp')
	.directive('chatWindow', function ($mdSidenav, Auth, socket) {
		return {
			templateUrl: 'app/dashboard/chatwindow/chatwindow.html',
			restrict: 'E',
			replace: true,
			scope: {},
			controller: function ($scope) {
				$scope.me = Auth.getCurrentUser();
				$scope.contacts = $scope.me.contacts;

				$scope.activeTabIndex = 0;

				$scope.toggleContactInfo = function () {
					$mdSidenav('contact-info').toggle()
				};
				// $scope.selected = [$scope.contacts[0]];

				$scope.$on('openChat', function (ev, userId) {
					var item = _.find($scope.contacts, {
						_id: userId
					});
					var index = $scope.contacts.indexOf(item);

					$scope.activeChat = $scope.contacts[index];
				});
			},
			link: function (scope, element, attrs) {}
		}
	});

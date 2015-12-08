'use strict';

angular.module('chatApp')
	.directive('chatInfo', function ($mdDialog) {
		return {
			templateUrl: 'app/dashboard/chatwindow/chatinfo/chatinfo.html',
			restrict: 'EA',
			controller: function ($scope) {

				$scope.close = function () {
					$mdDialog.cancel();
				};

				$scope.showContactList = function (ev) {
					$mdDialog.show({
						template: '<md-dialog aria-label="Add Participant" ng-cloak="ng-cloak" style="width: 30%;">' +
							'<md-toolbar class="md-toolbar-tools">' +
							'<md-button ng-click="close()" class="md-icon-button">' +
							'<md-icon md-svg-src="close" aria-label="Close Contact List"></md-icon>' +
							'</md-button>' +
							'<h1>Add participants</h1>' +
							'</md-toolbar>' +
							'<search-box placeholder="Search for contacts"></search-box>' +
							'<md-divider></md-divider>' +
							'<contact-list requests="false" close="toggleContactList"></contact-list>' +
							'</md-dialog>',
						scope: $scope,
						preserveScope: true,
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose: true
					});
				};
			},
			link: function (scope, element, attrs) {}
		};
	});

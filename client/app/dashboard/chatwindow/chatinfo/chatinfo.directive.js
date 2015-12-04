'use strict';

angular.module('chatApp')
	.directive('chatInfo', function ($mdDialog) {
		return {
			templateUrl: 'app/dashboard/chatwindow/chatinfo/chatinfo.html',
			restrict: 'EA',
			controller: function ($scope) {
				$scope.showContactList = function (ev) {
					$mdDialog.show({
						template: '<md-toolbar class="md-toolbar-tools">' +
							'<md-button ng-click="toggleContactList()" class="md-icon-button">' +
							'<md-icon md-svg-src="assets/svg/back.svg" aria-label="Close Contact List"></md-icon>' +
							'</md-button>' +
							'<h1 class="md-toolbar-tools">Contacts</h1>' +
							'</md-toolbar>' +
							'<search-box placeholder="Search for contacts"></search-box>' +
							'<md-divider></md-divider>' +
							'<contact-list requests="false"></contact-list>',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose: true,
						locals: {
							pending: true,
							toggleContactList: $mdDialog.hide
						},
						bindToController: true
					});
				};
			},
			link: function (scope, element, attrs) {}
		};
	});

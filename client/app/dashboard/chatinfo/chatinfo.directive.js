'use strict';

angular.module('chatApp')
	.directive('chatInfo', function ($mdDialog) {
		return {
			templateUrl: 'app/dashboard/chatinfo/chatinfo.html',
			restrict: 'EA',
			controller: function ($scope) {

				$scope.selected = [];

				$scope.contactsClone = $scope.contacts.slice();

				//add lowercase names to contacts
				(function(contacts) {
					contacts.forEach(function (element) {
						element._lowername = element.name.toLowerCase();
					});
				})($scope.contactsClone);

				$scope.querySearch = function (query) {
					var results = query ?
						$scope.contactsClone.filter(createFilterFor(query)) : [];
					return results;
				};

				function createFilterFor(query) {
					var lowercaseQuery = angular.lowercase(query);
					return function filterFn(contact) {
						console.log(contact);
						return (contact._lowername.indexOf(lowercaseQuery) !== -1);
					};
				}

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
							'<md-content class="md-padding autocomplete" layout="column">' +
								' <md-contact-chips ng-model="selected" md-contacts="querySearch($query)" md-contact-name="name" md-contact-image="img" ' +  'md-contact-email="email" md-require-match="true" md-highlight-flags="i" filter-selected="true" placeholder="Type to add participants">' +
								'</md-contact-chips>' +
							' </md-content>' +
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
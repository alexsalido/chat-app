'use strict';

angular.module('chatApp')
	.directive('chatInfo', function ($mdDialog) {
		return {
			templateUrl: 'app/dashboard/chatinfo/chatinfo.html',
			restrict: 'EA',
			replace: true,
			scope: {
				activeChat: '=src',
				deleteChat: '&delete'
			},
			controller: function ($scope) {
				// $scope.selected = [];
				//
				// $scope.contactsClone = $scope.contacts.slice();
				//
				// //add lowercase names to contacts
				// (function(contacts) {
				// 	contacts.forEach(function (element) {
				// 		element._lowername = element.name.toLowerCase();
				// 	});
				// })($scope.contactsClone);
				//
				// $scope.querySearch = function (query) {
				// 	var results = query ?
				// 		$scope.contactsClone.filter(createFilterFor(query)) : [];
				// 	return results;
				// };
				//
				// function createFilterFor(query) {
				// 	var lowercaseQuery = angular.lowercase(query);
				// 	return function filterFn(contact) {
				// 		console.log(contact);
				// 		return (contact._lowername.indexOf(lowercaseQuery) !== -1);
				// 	};
				// }
				//
				// $scope.close = function () {
				// 	$mdDialog.cancel();
				// };
				//
				// $scope.showContactList = function (ev) {
				// 	$mdDialog.show({
				// 		templateUrl: 'app/dashboard/views/addparticipant.html',
				// 		scope: $scope,
				// 		preserveScope: true,
				// 		parent: angular.element(document.body),
				// 		targetEvent: ev,
				// 		clickOutsideToClose: true
				// 	});
				// };
			},
			link: function (scope, element, attrs) {}
		};
	});

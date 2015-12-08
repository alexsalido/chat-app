'use strict';

angular.module('chatApp')
	.directive('contactList', function ($mdSidenav) {
		return {
			templateUrl: 'app/dashboard/contactlist/contactlist.html',
			restrict: 'E',
			replace: true,
			controller: function ($scope, $element, $attrs, $mdSidenav, $mdDialog) {

				$scope.requests = $attrs.requests || false;

				$scope.pending = [{
					name: 'Chewbacca',
					email: 'chewie@foobar.com',
					img: '/assets/images/profile_5.jpg',
				}];

				$scope.toggleContactList = function () {
					$mdSidenav('contact-list').toggle()
				};

				//Fake contacts
				$scope.contacts = [{
					_id: 1,
					name: 'Joe Perkins',
					username: 'theperks',
					email: 'perks@foobar.com',
					img: 'assets/images/profile_2.jpg',
					newMessage: false,
					active: false,
					online: true,
					status: 'Shooting some Jedi'
				}, {
					_id: 2,
					name: 'Mark Johnson',
					username: 'marksman',
					email: 'mark@foobar.com',
					img: '/assets/images/profile_3.jpg',
					newMessage: true,
					active: false,
					online: true,
					status: 'Just standing there'
				}, {
					_id: 3,
					name: 'Peter Carlson',
					username: 'pita',
					email: 'pita@foobar.com',
					img: '/assets/images/profile_4.jpg',
					newMessage: false,
					active: false,
					online: true,
					status: 'Speaking with Darth Vader'
				}];
			},
			link: function (scope, element, attrs) {
			}
		};
	});

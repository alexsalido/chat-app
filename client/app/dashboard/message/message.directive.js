'use strict';

angular.module('chatApp')
	.directive('message', function () {
		return {
			templateUrl: 'app/dashboard/views/message.html',
			restrict: 'E',
			scope: {
				members: '='
			},
			link: function (scope, element, attrs) {
				var sender = attrs.sender;
				var me = attrs.receiver;

				scope.text = attrs.text;
				
				if (sender === me) {
					element.addClass('me');
				} else {
					element.addClass('them');
					//if conversation is a group
					if (!!scope.members && (sender !== me)) {
						scope.isGroup = true;
						scope.sender = _.find(scope.members, {
							_id: sender
						});
					}

				}
			}
		};
	});

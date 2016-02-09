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
				var isScribble = (attrs.scribble === 'true')

				if (isScribble) {
					var canvas = document.createElement("canvas");
					var context = canvas.getContext('2d');

					// load image from data url
					var imageObj = new Image();
					imageObj.onload = function () {
						context.drawImage(this, 0, 0);
					};

					imageObj.src = attrs.text;
					imageObj.width = 100;
					imageObj.height = 100;
					element.find('scribble').append(imageObj);
				} else {
					scope.text = attrs.text;
				}

				if (!!!sender) {
					element.addClass('server');
				} else if (sender === me) {
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

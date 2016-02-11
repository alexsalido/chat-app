'use strict';

angular.module('chatApp')
	.directive('message', function ($mdDialog) {
		return {
			templateUrl: 'app/dashboard/views/message.html',
			restrict: 'E',
			scope: {
				showAvatar: '=avatar',
				isScribble: '=scribble',
				server: '=',
				sender: '=',
				receiver: '=',
				text: '='
			},
			link: function (scope, element, attrs) {

				if (scope.isScribble) {
					var canvas = document.createElement('canvas');
					var scribble = angular.element(document.createElement('scribble'));
					var context = canvas.getContext('2d');
					var container = element.find('text');

					canvas.setAttribute('width', '500');
					canvas.setAttribute('height', '500');

					// load image from data url
					var imageObj = new Image();
					imageObj.onload = function () {
						context.drawImage(this, 0, 0);
					};

					imageObj.src = scope.text;
					imageObj.width = 80;
					imageObj.height = 80;

					container.addClass('clickable');
					scribble.addClass('scribble').append(imageObj);
					container.removeClass('text').append(scribble);

					container.on('click', function (event) {
						$mdDialog.show({
							controller: function ($scope) {
								$scope.showDialog = false;
								$scope.cancel = function () {
									$mdDialog.cancel();
								}
							},
							templateUrl: 'app/dashboard/views/viewScribble.html',
							parent: angular.element(document.body),
							targetEvent: event,
							clickOutsideToClose: true,
							onComplete: function ($scope) {
								angular.element(document.getElementById('scribble-viewer')).append(canvas);
								$scope.showDialog = true;
							}
						});
					});

					//clean scope.text
					scope.text = '';
				}
				
				if (scope.server) {
					element.addClass('server');
				} else if (scope.sender._id === scope.receiver._id) {
					element.addClass('me');
				} else {
					element.addClass('them');
				}
			}
		};
	});

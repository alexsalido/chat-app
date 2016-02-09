'use strict';

angular.module('chatApp')
	.service('scribble', function () {
		// AngularJS will instantiate a singleton by calling "new" on this function
		var clickX = [];
		var clickY = [];
		var clickDrag = [];
		var clickColor = [];
		var paint;
		var context;
		var canvas;
		var color

		function addClick(x, y, dragging) {
			clickX.push(x);
			clickY.push(y);
			clickDrag.push(dragging);
			clickColor.push(color);
		}

		function redraw() {
			context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
			context.strokeStyle = color || "#000000";
			context.lineJoin = "round";
			context.lineWidth = 5;

			for (var i = 0; i < clickX.length; i++) {
				context.beginPath();
				if (clickDrag[i] && i) {
					context.moveTo(clickX[i - 1], clickY[i - 1]);
				} else {
					context.moveTo(clickX[i] - 1, clickY[i]);
				}
				context.lineTo(clickX[i], clickY[i]);
				context.closePath();
				context.strokeStyle = clickColor[i];
				context.stroke();
			}
		}

		function mouseDown(event) {
			var mouseX = event.layerX - canvas.offsetLeft;
			var mouseY = event.layerY - canvas.offsetTop;
			paint = true;
			addClick(mouseX, mouseY);
			redraw();
		}

		function mouseMove(event) {
			if (paint) {
				addClick(event.layerX - canvas.offsetLeft, event.layerY - canvas.offsetTop, true);
				redraw();
			}
		}

		function mouseUp() {
			paint = false;
		}

		function mouseLeave() {
			paint = false;
		}

		this.setCanvas = function (elementId) {
			var container = document.getElementById(elementId);
			canvas = document.createElement('canvas');
			canvas.setAttribute('width', "500");
			canvas.setAttribute('height', "500");
			canvas.setAttribute('id', 'scribble');
			container.appendChild(canvas);

			if (typeof G_vmlCanvasManager != 'undefined') {
				canvas = G_vmlCanvasManager.initElement(canvas);
			}

			context = canvas.getContext("2d");

			canvas.addEventListener("mousedown", mouseDown);
			canvas.addEventListener("mousemove", mouseMove);
			canvas.addEventListener("mouseup", mouseUp);
		};

		this.setColor = function (_color) {
			color = _color;
		};

		this.clearCanvas = function () {
			clickX = [];
			clickY = [];
			clickDrag = [];
			clickColor = [];
		};

		this.getCanvas = function () {
			return canvas;
		};
	});

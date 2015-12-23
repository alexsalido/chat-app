'use strict';

describe('Directive: profile', function () {

	// load the directive's module and view
	beforeEach(module('chatApp'));
	beforeEach(module('app/dashboard/profile/profile.html'));
	beforeEach(inject(function ($rootScope, $templateCache) {
		$templateCache.put('assets/svg/back.svg', 'client/assets/svg/back.svg');
	}));

	beforeEach(inject(function ($rootScope, $templateCache) {
		$templateCache.put('assets/svg/camera.svg', 'client/assets/svg/back.svg');
	}));

	var scope, $httpBackend, element, directiveScope, compiledEl;

	beforeEach(inject(function ($rootScope, $compile, _$httpBackend_) {

		scope = $rootScope.$new();
		element = angular.element('<profile></profile>');
		compiledEl = $compile(element)(scope);
		$httpBackend = _$httpBackend_;
		scope.$digest();

		$httpBackend.expectPUT('/api/image/123456')
			.respond({
				url: 'dummyImg.jpg',
				info: '123456'
			});
	}));

	it('Testing profile image change', function () {
		scope.changeProfileImage();
		$httpBackend.flush();
		expect(scope.me.img).toBe('dummyImg.jpg');
		expect(true).toBe(true);
	});
});

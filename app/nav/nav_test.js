;(function () {
    'use strict';

    describe('app.nav', function () {

        var httpProvider, authInterceptor;
        var token = 'sample';

        beforeEach(function() {
            module('app.nav', function ($httpProvider) {
                httpProvider = $httpProvider
            });

            inject(function (_authInterceptor_) {
                authInterceptor = _authInterceptor_;
            });
        });

        describe('app.nav.authInterceptor', function () {
            it('should have a definied authInterceptor', function () {
                expect(authInterceptor).toBeDefined();
            });

            it('should have the interceptor as an interceptor', function () {
                expect(httpProvider.interceptors).toContain('authInterceptor');
            });
        });

        describe('app.nav.controller', function () {
            var scope, $location, createController;

            beforeEach(inject(function ($rootScope, $controller, _$location_) {
                $location = _$location_;
                scope = $rootScope.$new();

                createController = function () {
                    return $controller('NavigationController', {
                        '$scope': scope
                    });
                };
            }));

            it('should exist', function () {
                var controller = createController();
                expect(controller).toBeDefined();
            });

            it('should have a method to check if the path is active', function () {
                var controller = createController();
                $location.path('/privacy');
                expect($location.path()).toBe('/privacy');
                expect(controller.isActive('/privacy')).toBe(true);
                expect(controller.isActive('/search')).toBe(false);
            });
        });
    });
})();

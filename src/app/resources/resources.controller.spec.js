(function () {
    'use strict';

    describe('chpl.resources', function () {

        var $log, authService, mock, scope, vm;

        mock = {};
        mock.API_KEY = 'api key';
        mock.token = 'a token here';

        beforeEach(function () {
            module('chpl.loginServices');
            module('chpl.resources', function ($provide) {
                $provide.decorator('authService', function ($delegate) {
                    $delegate.getApiKey = jasmine.createSpy('getApiKey');
                    $delegate.getToken = jasmine.createSpy('getToken');
                    return $delegate;
                });
            });

            inject(function ($controller, $rootScope, _$log_, _authService_) {
                $log = _$log_;
                authService = _authService_;
                authService.getApiKey.and.returnValue(mock.API_KEY);
                authService.getToken.and.returnValue(mock.token);

                scope = $rootScope.$new();
                vm = $controller('ResourcesController', {
                    $scope: scope
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        describe('controller', function () {
            it('should exist', function () {
                expect(vm).toBeDefined();
            });

            it('should load have a swaggerUI at start', function () {
                expect(vm.swaggerUrl.length).toBeGreaterThan(0);
            });

            it('should know what the API Key is', function () {
                expect(vm.API_KEY).toBe(mock.API_KEY);
            });

            it('should know what the token is', function () {
                expect(vm.token).toBe(mock.token);
            });
        });
    });
})();

(function () {
    'use strict';

    describe('chpl.download', function () {

        var $log, authService, mock, scope, vm;

        mock = {};
        mock.API_KEY = 'api key';
        mock.token = 'a token here';

        beforeEach(function () {
            module('chpl.loginServices', 'chpl.download', function ($provide) {
                $provide.decorator('authService', function ($delegate) {
                    $delegate.getApiKey = jasmine.createSpy('getApiKey');
                    $delegate.getToken = jasmine.createSpy('getToken');
                    $delegate.isChplAdmin = jasmine.createSpy('isChplAdmin');
                    $delegate.isOncStaff = jasmine.createSpy('isOncStaff');
                    return $delegate;
                });
            });

            inject(function ($controller, $rootScope, _$log_, _authService_) {
                $log = _$log_;
                authService = _authService_;
                authService.getApiKey.and.returnValue(mock.API_KEY);
                authService.getToken.and.returnValue(mock.token);
                authService.isChplAdmin.and.returnValue(false);
                authService.isOncStaff.and.returnValue(false);

                scope = $rootScope.$new();
                vm = $controller('DownloadController', {
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

            it('should know what the API Key is', function () {
                expect(vm.API_KEY).toBe(mock.API_KEY);
            });

            it('should know what the token is', function () {
                expect(vm.getToken).toBeDefined();
                expect(vm.getToken()).toBe(mock.token);
            });

            it('should know if it should show restricted download files', function () {
                authService.isChplAdmin.and.returnValue(false);
                authService.isOncStaff.and.returnValue(false);
                expect(vm.showRestricted()).toBe(false);

                authService.isChplAdmin.and.returnValue(true);
                authService.isOncStaff.and.returnValue(false);
                expect(vm.showRestricted()).toBe(true);

                authService.isChplAdmin.and.returnValue(false);
                authService.isOncStaff.and.returnValue(true);
                expect(vm.showRestricted()).toBe(true);

                authService.isChplAdmin.and.returnValue(true);
                authService.isOncStaff.and.returnValue(true);
                expect(vm.showRestricted()).toBe(true);
            });
        });
    });
})();

(function () {
    'use strict';

    describe('login directive', function () {

        var $log, $q, authService, el, networkService, vm;

        beforeEach(function () {
            module('chpl.templates', 'chpl.admin', function ($provide) {
                $provide.decorator('authService', function ($delegate) {
                    $delegate.isAuthed = jasmine.createSpy('isAuthed');
                    $delegate.logout = jasmine.createSpy('logout');
                    return $delegate;
                });
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.login = jasmine.createSpy('login');
                    return $delegate;
                });
            });

            inject(function ($compile, _$log_, _$q_, $rootScope, _authService_, _networkService_) {
                $q = _$q_;
                $log = _$log_;
                authService = _authService_;
                authService.isAuthed.and.returnValue(true);
                networkService = _networkService_;
                networkService.login.and.returnValue($q.when({}));

                el = angular.element('<ai-login></ai-login>');

                $compile(el)($rootScope.$new());
                $rootScope.$digest();
                vm = el.isolateScope().vm;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.log('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('should exist', function () {
            expect(vm).toBeDefined();
        });

        it('should have a function to log in', function () {
            expect(vm.login).toBeDefined();
        });

        it('should call networkService.login with correct parameters', function () {
            vm.userName = 'test';
            vm.password = 'password';
            vm.login();
            expect(networkService.login).toHaveBeenCalledWith({userName: 'test', password: 'password'});
        });

        it('should have an error message if login credentials are bad', function () {
            networkService.login.and.returnValue($q.reject({data: {error: 'Invalid username / password'}}));
            vm.login();
            el.isolateScope().$digest();
            expect(vm.message).toBe('Invalid username / password')
        });
    });
})();

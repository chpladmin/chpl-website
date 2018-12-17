(function () {
    'use strict';

    fdescribe('the CHPL Admin Management Controller', function () {

        var $log, $q, authService, networkService, scope, vm;

        beforeEach(function () {
            angular.mock.module('chpl.admin', function ($provide) {
                $provide.decorator('authService', function ($delegate) {
                    $delegate.getFullname = jasmine.createSpy('getFullname');
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    return $delegate;
                });
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getAcbs = jasmine.createSpy('getAcbs');
                    $delegate.getAtls = jasmine.createSpy('getAtls');
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _authService_, _networkService_) {
                $log = _$log_;
                $q = _$q_;
                authService = _authService_;
                networkService = _networkService_;
                authService.getFullname.and.returnValue('fake');
                authService.hasAnyRole.and.returnValue(true);
                networkService.getAcbs.and.returnValue($q.when({acbs: [{id: 0}]}));
                networkService.getAtls.and.returnValue($q.when({atls: [{id: 0}]}));

                scope = $rootScope.$new();
                vm = $controller('AdminController', {
                    $stateParams: {},
                    authService: _authService_,
                    networkService: _networkService_,
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('controller', function () {

            it('should exist', function () {
                expect(vm).toBeDefined();
            });

            it('should know the logged in user\' name', function () {
                expect(vm.getFullname()).toBe('fake');
            });

            it('should have a default screen set up', function () {
                expect(vm.navState.screen).toBe('dpManagement');
            });

            it('should store state of navigation', function () {
                expect(vm.navState).toBeDefined();
            });

            it('should have a function to change subnavigation screens', function () {
                expect(vm.changeSubNav).toBeDefined();
            });

            it('should have a function to register handlers', function () {
                expect(vm.triggerRefresh).toBeDefined();
            });

            it('should add a handler function is one is passed in', function () {
                expect(vm.handlers.length).toBe(0);
                vm.triggerRefresh(function () {});
                expect(vm.handlers.length).toBe(1);
            });

            it('should have a function to trigger handlers', function () {
                expect(vm.refresh).toBeDefined();
            });

            it('should call handler functions when triggered', function () {
                this.aFunc = function () {};
                spyOn(this, 'aFunc');
                vm.triggerRefresh(this.aFunc);
                vm.refresh();
                expect(this.aFunc).toHaveBeenCalled();
            });
        });
    });
})();

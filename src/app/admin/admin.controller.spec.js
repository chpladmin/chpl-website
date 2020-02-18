(function () {
    'use strict';

    describe('the CHPL Admin Management', function () {

        var $controller, $log, $q, $rootScope, authService, networkService, scope, vm;

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

            inject(function (_$controller_, _$log_, _$q_, _$rootScope_, _authService_, _networkService_) {
                $controller = _$controller_;
                $log = _$log_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                authService = _authService_;
                authService.getFullname.and.returnValue('fake');
                authService.hasAnyRole.and.returnValue(false);
                networkService = _networkService_;
                networkService.getAcbs.and.returnValue($q.when({acbs: [{id: 0}]}));
                networkService.getAtls.and.returnValue($q.when({atls: [{id: 0}]}));
                scope = $rootScope.$new();
                vm = $controller('AdminController', {
                    $stateParams: {},
                    authService: authService,
                    networkService: networkService,
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
        });
    });
})();

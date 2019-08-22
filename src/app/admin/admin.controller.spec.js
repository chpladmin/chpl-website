(function () {
    'use strict';

    fdescribe('the CHPL Admin Management', function () {

        var $controller, $log, $rootScope, authService, scope, vm;

        beforeEach(function () {
            angular.mock.module('chpl.admin', function ($provide) {
                $provide.decorator('authService', function ($delegate) {
                    $delegate.getFullname = jasmine.createSpy('getFullname');
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    return $delegate;
                });
            });

            inject(function (_$controller_, _$log_, _$rootScope_, _authService_) {
                $controller = _$controller_;
                $log = _$log_;
                $rootScope = _$rootScope_;
                authService = _authService_;
                authService.getFullname.and.returnValue('fake');
                authService.hasAnyRole.and.returnValue(true);

                scope = $rootScope.$new();
                vm = $controller('AdminController', {
                    $stateParams: {},
                    authService: authService,
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

            describe('on init', () => {
                describe('as ROLE_ADMIN', () => {
                    beforeEach(() => {
                        authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ADMIN') > -1);
                        scope = $rootScope.$new();
                        vm = $controller('AdminController', {
                            $stateParams: {},
                            authService: authService,
                        });
                        scope.$digest();
                    });

                    it('should have state', () => {
                        expect(vm.navState.screen).toBe('dpManagement');
                        expect(vm.navState.dpManagement).toBe('manage');
                    });
                });

                describe('as ROLE_ONC', () => {
                    beforeEach(() => {
                        authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ONC') > -1);
                        scope = $rootScope.$new();
                        vm = $controller('AdminController', {
                            $stateParams: {},
                            authService: authService,
                        });
                        scope.$digest();
                    });

                    it('should have state', () => {
                        expect(vm.navState.screen).toBe('dpManagement');
                        expect(vm.navState.dpManagement).toBe('manage');
                    });
                });

                describe('as ROLE_ACB', () => {
                    beforeEach(() => {
                        authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ACB') > -1);
                        scope = $rootScope.$new();
                        vm = $controller('AdminController', {
                            $stateParams: {},
                            authService: authService,
                        });
                        scope.$digest();
                    });

                    it('should have state', () => {
                        expect(vm.navState.screen).toBe('dpManagement');
                        expect(vm.navState.dpManagement).toBe('upload');
                    });
                });

                describe('as ROLE_ATL', () => {
                    beforeEach(() => {
                        authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ATL') > -1);
                        scope = $rootScope.$new();
                        vm = $controller('AdminController', {
                            $stateParams: {},
                            authService: authService,
                        });
                        scope.$digest();
                    });

                    it('should have state', () => {
                        expect(vm.navState.screen).toBe('userManagement');
                        expect(vm.navState.dpManagement).toBe('upload');
                    });
                });

                describe('as ROLE_CMS_STAFF', () => {
                    beforeEach(() => {
                        authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_CMS_STAFF') > -1);
                        scope = $rootScope.$new();
                        vm = $controller('AdminController', {
                            $stateParams: {},
                            authService: authService,
                        });
                        scope.$digest();
                    });

                    it('should have state', () => {
                        expect(vm.navState.screen).toBeUndefined();
                        expect(vm.navState.dpManagement).toBe('upload');
                    });
                });

                describe('when deep linking to a listing', () => {
                    beforeEach(() => {
                        scope = $rootScope.$new();
                        vm = $controller('AdminController', {
                            $stateParams: {
                                section: 'dpManagement',
                                productId: 3,
                            },
                            authService: authService,
                        });
                        scope.$digest();
                    });

                    it('should have state', () => {
                        expect(vm.navState.screen).toBe('dpManagement');
                        expect(vm.productId).toBe(3);
                    });
                });

                describe('when deep linking to a non reports subsection', () => {
                    beforeEach(() => {
                        scope = $rootScope.$new();
                        vm = $controller('AdminController', {
                            $stateParams: {
                                section: 'dpManagement',
                                subSection: 'upload',
                            },
                            authService: authService,
                        });
                        scope.$digest();
                    });

                    it('should have state', () => {
                        expect(vm.navState.screen).toBe('dpManagement');
                        expect(vm.navState.dpManagement).toBe('upload');
                    });
                });
            });
        });
    });
})();

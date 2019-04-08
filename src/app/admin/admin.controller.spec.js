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
                networkService = _networkService_;
                authService.getFullname.and.returnValue('fake');
                authService.hasAnyRole.and.returnValue(true);
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

            describe('on init', () => {
                describe('as ROLE_ADMIN', () => {
                    beforeEach(() => {
                        authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ADMIN') > -1);
                        scope = $rootScope.$new();
                        vm = $controller('AdminController', {
                            $stateParams: {},
                            authService: authService,
                            networkService: networkService,
                        });
                        scope.$digest();
                    });

                    it('should have state', () => {
                        expect(vm.navState.screen).toBe('dpManagement');
                        expect(vm.navState.dpManagement).toBe('manage');
                        expect(vm.navState.reports).toBe('cp-upload');
                    });
                });

                describe('as ROLE_ONC', () => {
                    beforeEach(() => {
                        authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ONC') > -1);
                        scope = $rootScope.$new();
                        vm = $controller('AdminController', {
                            $stateParams: {},
                            authService: authService,
                            networkService: networkService,
                        });
                        scope.$digest();
                    });

                    it('should have state', () => {
                        expect(vm.navState.screen).toBe('dpManagement');
                        expect(vm.navState.dpManagement).toBe('manage');
                        expect(vm.navState.reports).toBe('cp-upload');
                    });
                });

                describe('as ROLE_ACB', () => {
                    beforeEach(() => {
                        authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ACB') > -1);
                        scope = $rootScope.$new();
                        vm = $controller('AdminController', {
                            $stateParams: {},
                            authService: authService,
                            networkService: networkService,
                        });
                        scope.$digest();
                    });

                    it('should have state', () => {
                        expect(vm.navState.screen).toBe('dpManagement');
                        expect(vm.navState.dpManagement).toBe('upload');
                        expect(vm.navState.reports).toBe('cp-upload');
                    });
                });

                describe('as ROLE_ATL', () => {
                    beforeEach(() => {
                        authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ATL') > -1);
                        scope = $rootScope.$new();
                        vm = $controller('AdminController', {
                            $stateParams: {},
                            authService: authService,
                            networkService: networkService,
                        });
                        scope.$digest();
                    });

                    it('should have state', () => {
                        expect(vm.navState.screen).toBe('atlManagement');
                        expect(vm.navState.dpManagement).toBe('upload');
                        expect(vm.navState.reports).toBe('cp-upload');
                    });
                });

                describe('as ROLE_CMS_STAFF', () => {
                    beforeEach(() => {
                        authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_CMS_STAFF') > -1);
                        scope = $rootScope.$new();
                        vm = $controller('AdminController', {
                            $stateParams: {},
                            authService: authService,
                            networkService: networkService,
                        });
                        scope.$digest();
                    });

                    it('should have state', () => {
                        expect(vm.navState.screen).toBeUndefined();
                        expect(vm.navState.dpManagement).toBe('upload');
                        expect(vm.navState.reports).toBe('cp-upload');
                    });
                });

                describe('when getting reports for a listing', () => {
                    beforeEach(() => {
                        scope = $rootScope.$new();
                        vm = $controller('AdminController', {
                            $stateParams: {
                                section: 'reports',
                                subSection: '',
                                productId: 3,
                            },
                            authService: authService,
                            networkService: networkService,
                        });
                        scope.$digest();
                    });

                    it('should have state', () => {
                        expect(vm.navState.screen).toBe('reports');
                        expect(vm.productId).toBe(3);
                        expect(vm.navState.reports).toBe('');
                    });
                });

                describe('when getting reports not for a listing', () => {
                    beforeEach(() => {
                        scope = $rootScope.$new();
                        vm = $controller('AdminController', {
                            $stateParams: {
                                section: 'reports',
                            },
                            authService: authService,
                            networkService: networkService,
                        });
                        scope.$digest();
                    });

                    it('should have state', () => {
                        expect(vm.navState.screen).toBe('reports');
                        expect(vm.navState.reports).toBe('cp-upload');
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
                            networkService: networkService,
                        });
                        scope.$digest();
                    });

                    it('should have state', () => {
                        expect(vm.navState.screen).toBe('dpManagement');
                        expect(vm.productId).toBe(3);
                        expect(vm.navState.reports).toBe('');
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
                            networkService: networkService,
                        });
                        scope.$digest();
                    });

                    it('should have state', () => {
                        expect(vm.navState.screen).toBe('dpManagement');
                        expect(vm.navState.dpManagement).toBe('upload');
                    });
                });
            });

            describe('with interactions', () => {
                describe('for ACBs', () => {
                    beforeEach(() => {
                        vm.acbs = [
                            {id: 0, name: 'first'},
                            {id: 1, name: 'second'},
                        ];
                    });

                    it('should replace the ACB with a new one', () => {
                        vm.handleAcb({id: 1, name: 'new second'});
                        expect(vm.acbs[0].name).toBe('first');
                        expect(vm.acbs[1].name).toBe('new second');
                    })
                });

                describe('for ATLs', () => {
                    beforeEach(() => {
                        vm.atls = [
                            {id: 0, name: 'first'},
                            {id: 1, name: 'second'},
                        ];
                    });

                    it('should replace the ATL with a new one', () => {
                        vm.handleAtl({id: 1, name: 'new second'});
                        expect(vm.atls[0].name).toBe('first');
                        expect(vm.atls[1].name).toBe('new second');
                    })
                });
            });
        });
    });
})();

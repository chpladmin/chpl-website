(function () {
    'use strict';

    fdescribe('the CHPL Listing Display Controller', function () {

        var $controller, $log, $q, $uibModal, actualOptions, authService, featureFlags, mock, networkService, scope, vm;
        mock = {};
        mock.activity = {};
        mock.productId = 123123;
        mock.products = [{ developer: 'Developer', product: 'Product' }];
        mock.fakeModal = {
            result: {
                then: function (confirmCallback, cancelCallback) {
                    this.confirmCallBack = confirmCallback;
                    this.cancelCallback = cancelCallback;
                }},
            close: function (item) { this.result.confirmCallBack(item); },
            dismiss: function (type) { this.result.cancelCallback(type); },
        };
        mock.fakeModalOptions = {
            component: 'chplListingHistory',
            animation: false,
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
                listing: jasmine.any(Function),
            },
        };

        beforeEach(function () {
            angular.mock.module('chpl.product', function ($provide) {
                $provide.decorator('authService', function ($delegate) {
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    return $delegate;
                });
                $provide.decorator('featureFlags', function ($delegate) {
                    $delegate.isOn = jasmine.createSpy('isOn');
                    return $delegate;
                });
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getListing = jasmine.createSpy('getListing');
                    $delegate.getSingleListingActivityMetadata = jasmine.createSpy('getSingleListingActivityMetadata');
                    return $delegate;
                });
            });
            inject(function (_$controller_, _$log_, _$q_, $rootScope, _$uibModal_, _authService_, _featureFlags_, _networkService_) {
                $controller = _$controller_;
                $log = _$log_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return mock.fakeModal;
                });
                $q = _$q_;
                authService = _authService_;
                authService.hasAnyRole.and.returnValue(false);
                featureFlags = _featureFlags_;
                featureFlags.isOn.and.returnValue(false);
                networkService = _networkService_;
                networkService.getListing.and.returnValue($q.when(mock.products));
                networkService.getSingleListingActivityMetadata.and.returnValue($q.when(mock.activity));

                scope = $rootScope.$new();
                vm = $controller('ProductController', {
                    $scope: scope,
                    $stateParams: {id: mock.productId},
                })
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

        it('should exist', function () {
            expect(vm).toBeDefined();
        });

        describe('loading', function () {
            it('should know what the product id is', function () {
                expect(vm.productId).toEqual(mock.productId);
            });

            it('should find product details on load', function () {
                expect(networkService.getListing).toHaveBeenCalled();
            });

            it('should log an error if the product load doesn\'t work', function () {
                var initialCount = $log.error.logs.length;
                networkService.getListing.and.returnValue($q.reject('error message'));
                vm.loadProduct();
                scope.$digest();
                expect($log.error.logs.length).toBe(initialCount + 1);
            });

            it('should get product history on load', function () {
                expect(networkService.getSingleListingActivityMetadata).toHaveBeenCalled();
            });

            it('should log an error if the product history load doesn\'t work', function () {
                var initialCount = $log.error.logs.length;
                networkService.getSingleListingActivityMetadata.and.returnValue($q.reject('error message'));
                vm.loadProduct();
                scope.$digest();
                expect($log.error.logs.length).toBe(initialCount + 1);
            });

            describe('initial panel options', function () {
                it('should set to criteria by default', function () {
                    expect(vm.initialPanel).toBe('cert');
                });

                it('should be able to be open to surveillance', function () {
                    vm = $controller('ProductController', {
                        $scope: scope,
                        $stateParams: {
                            id: mock.productId,
                            initialPanel: 'surveillance',
                        },
                    })
                    scope.$digest();
                    expect(vm.initialPanel).toBe('surveillance');
                });
            });
        });

        describe('viewing product history', function () {
            it('should have a function to view product history', function () {
                expect(vm.viewProductHistory).toBeDefined();
            });

            it('should create a modal instance when a product history is viewed', function () {
                let listing = {};
                vm.product = listing;
                expect(vm.viewProductHistoryInstance).toBeUndefined();
                vm.viewProductHistory();
                expect(vm.viewProductHistoryInstance).toBeDefined();
                expect($uibModal.open).toHaveBeenCalledWith(mock.fakeModalOptions);
                expect(actualOptions.resolve.listing()).toEqual(listing);
            });

            it('should log that the history was closed', function () {
                var initialCount = $log.info.logs.length;
                vm.viewProductHistory();
                vm.viewProductHistoryInstance.close('closed');
                expect($log.info.logs.length).toBe(initialCount + 1);
            });

            it('should log that the history was closed', function () {
                var initialCount = $log.info.logs.length;
                vm.viewProductHistory();
                vm.viewProductHistoryInstance.dismiss('dismissed');
                expect($log.info.logs.length).toBe(initialCount + 1);
            });
        });

        describe('editing', () => {
            it('should not allow anonymous users to edit', () => {
                expect(vm.canEdit()).toBe(false);
            });

            it('should allow ADMIN to edit', () => {
                authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ADMIN') >= 0);
                expect(vm.canEdit()).toBe(true);
            });

            it('should allow ONC to edit', () => {
                authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ONC') >= 0);
                expect(vm.canEdit()).toBe(true);
            });

            it('should allow ACB to edit', () => {
                authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ACB') >= 0);
                expect(vm.canEdit()).toBe(true);
            });

            it('should not allow ATL to edit', () => {
                authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ATL') >= 0);
                expect(vm.canEdit()).toBe(false);
            });

            it('should not allow CMS to edit', () => {
                authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_CMS_STAFF') >= 0);
                expect(vm.canEdit()).toBe(false);
            });

            it('should not allow DEVELOPER to edit', () => {
                authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_DEVELOPER') >= 0);
                expect(vm.canEdit()).toBe(false);
            });

            describe('with respect to flag:effective-rule-date+1-week', () => {
                beforeEach(() => {
                    featureFlags.isOn.and.callFake(flag => flag === 'effective-rule-date+1-week');
                    vm.product.certificationEdition = {name: '2014'};
                });

                it('should allow ADMIN to edit', () => {
                    authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ADMIN') >= 0);
                    expect(vm.canEdit()).toBe(true);
                });

                it('should allow ONC to edit', () => {
                    authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ONC') >= 0);
                    expect(vm.canEdit()).toBe(true);
                });

                it('should not allow ACB to edit 2014 Edition', () => {
                    authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ACB') >= 0);
                    expect(vm.canEdit()).toBe(false);
                });

                it('should allow ACB to edit non-2014 Edition', () => {
                    vm.product.certificationEdition.name = '2015';
                    authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ACB') >= 0);
                    expect(vm.canEdit()).toBe(true);
                });
            });
        });
    });
})();

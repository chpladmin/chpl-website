(function () {
    'use strict';

    describe('chpl.product.controller', function () {

        var $controller, $log, $q, $uibModal, actualOptions, authService, mock, networkService, scope, vm;
        mock = {};
        mock.activity = {};
        mock.productId = 123123;
        mock.products = [{ developer: 'Developer', product: 'Product' }];
        mock.caps = [];
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
            templateUrl: 'app/product/history/history.html',
            controller: 'ProductHistoryController',
            controllerAs: 'vm',
            animation: false,
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
                activity: jasmine.any(Function),
            },
        };

        beforeEach(function () {
            module('chpl.product', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getCap = jasmine.createSpy('getCap');
                    $delegate.getProduct = jasmine.createSpy('getProduct');
                    $delegate.getSingleCertifiedProductActivity = jasmine.createSpy('getSingleCertifiedProductActivity');
                    return $delegate;
                });
                $provide.decorator('authService', function ($delegate) {
                    $delegate.isAuthed = jasmine.createSpy('isAuthed');
                    return $delegate;
                });
            });
            inject(function (_$controller_, _$log_, _$q_, $rootScope, _$uibModal_, _authService_, _networkService_) {
                $controller = _$controller_;
                $log = _$log_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return mock.fakeModal;
                });
                $q = _$q_;
                networkService = _networkService_;
                networkService.getCap.and.returnValue($q.when(mock.caps));
                networkService.getProduct.and.returnValue($q.when(mock.products));
                networkService.getSingleCertifiedProductActivity.and.returnValue($q.when(mock.activity));
                authService = _authService_;
                authService.isAuthed.and.returnValue(true);

                scope = $rootScope.$new();
                vm = $controller('ProductController', {
                    $scope: scope,
                    $routeParams: {id: mock.productId},
                })
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('should exist', function () {
            expect(vm).toBeDefined();
        });

        describe('loading', function () {
            it('should know what the product id is', function () {
                expect(vm.productId).toEqual(mock.productId);
            });

            it('should know if the user is authenticated on load', function () {
                expect(authService.isAuthed).toHaveBeenCalled();
            });

            it('should find product details on load', function () {
                expect(networkService.getProduct).toHaveBeenCalled();
            });

            it('should log an error if the product load doesn\'t work', function () {
                var initialCount = $log.error.logs.length;
                networkService.getProduct.and.returnValue($q.reject('error message'));
                vm.loadProduct();
                scope.$digest();
                expect($log.error.logs.length).toBe(initialCount + 1);
            });

            it('should get product history on load', function () {
                expect(networkService.getSingleCertifiedProductActivity).toHaveBeenCalled();
            });

            it('should log an error if the product history load doesn\'t work', function () {
                var initialCount = $log.error.logs.length;
                networkService.getSingleCertifiedProductActivity.and.returnValue($q.reject('error message'));
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
                        $routeParams: {
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
                expect(vm.viewProductHistoryInstance).toBeUndefined();
                vm.viewProductHistory();
                expect(vm.viewProductHistoryInstance).toBeDefined();
                expect($uibModal.open).toHaveBeenCalledWith(mock.fakeModalOptions);
                expect(actualOptions.resolve.activity()).toEqual(mock.activity);
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
    });
})();

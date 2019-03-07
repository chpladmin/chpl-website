(() => {
    'use strict';

    fdescribe('the CHPL Listing component', () => {

        var $componentController, $log, $q, $stateParams, $uibModal, actualOptions, ctrl, mock, networkService, scope;
        mock = {};
        mock.activity = {};
        mock.productId = 123123;
        mock.products = [{ developer: 'Developer', product: 'Product' }];
        mock.fakeModal = {
            result: {
                then: (confirmCallback, cancelCallback) => {
                    this.confirmCallBack = confirmCallback;
                    this.cancelCallback = cancelCallback;
                }},
            close: item => { this.result.confirmCallBack(item); },
            dismiss: type => { this.result.cancelCallback(type); },
        };
        mock.fakeModalOptions = {
            templateUrl: 'chpl.listing/history/history.html',
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

        beforeEach(() => {
            angular.mock.module('chpl', 'chpl.listing', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.getProduct = jasmine.createSpy('getProduct');
                    $delegate.getSingleCertifiedProductActivity = jasmine.createSpy('getSingleCertifiedProductActivity');
                    return $delegate;
                });
            });
            inject((_$componentController_, _$log_, _$q_, $rootScope, _$stateParams_, _$uibModal_, _networkService_) => {
                $componentController = _$componentController_;
                $log = _$log_;
                $q = _$q_;
                $stateParams = _$stateParams_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(options => {
                    actualOptions = options;
                    return mock.fakeModal;
                });
                networkService = _networkService_;
                networkService.getProduct.and.returnValue($q.when(mock.products));
                networkService.getSingleCertifiedProductActivity.and.returnValue($q.when(mock.activity));

                scope = $rootScope.$new();
                $stateParams.id = mock.productId;
                ctrl = $componentController('chplListing', {
                    $scope: scope,
                    $stateParams: $stateParams,
                });
                ctrl.$onInit();
            });
        });

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('controller', () => {
            it('should exist', () => {
                expect(ctrl).toBeDefined();
            });

            describe('when loading', () => {
                it('should know what the product id is', () => {
                    expect(ctrl.productId).toEqual(mock.productId);
                });

                it('should find product details on load', () => {
                    expect(networkService.getProduct).toHaveBeenCalled();
                });

                it('should get product history on load', () => {
                    expect(networkService.getSingleCertifiedProductActivity).toHaveBeenCalled();
                });

                it('should be loading', () => {
                    expect(ctrl.loading).toBe(true);
                });

                it('shouldn\'t have data immediately', () => {
                    expect(ctrl.product).toBeUndefined();
                    expect(ctrl.activity).toBeUndefined();
                });

                describe('after getting data', () => {
                    beforeEach(() => {
                        scope.$digest();
                    });

                    it('should be done loading', () => {
                        expect(ctrl.loading).toBe(false);
                    });

                    it('should load product data', () => {
                        expect(ctrl.product).toEqual(mock.products);
                    });

                    it('should load product activity', () => {
                        expect(ctrl.activity).toEqual(mock.activity);
                    });
                });
            });

            describe('wrt initial panel options', () => {
                it('should set to criteria by default', () => {
                    expect(ctrl.initialPanel).toBe('cert');
                });

                it('should be able to be open to surveillance', () => {
                    $stateParams.initialPanel = 'surveillance';
                    ctrl = $componentController('chplListing', {
                        $scope: scope,
                        $stateParams: $stateParams,
                    });
                    ctrl.$onInit();
                    expect(ctrl.initialPanel).toBe('surveillance');
                });
            });
        });

        describe('viewing product history', () => {
            it('should have a function to view product history', () => {
                expect(ctrl.viewProductHistory).toBeDefined();
            });

            it('should resolve modal stuff when product history is viewed', () => {
                ctrl.activity = mock.activity;
                ctrl.viewProductHistory();
                expect($uibModal.open).toHaveBeenCalledWith(mock.fakeModalOptions);
                expect(actualOptions.resolve.activity()).toEqual(mock.activity);
            });
        });
    });
})();

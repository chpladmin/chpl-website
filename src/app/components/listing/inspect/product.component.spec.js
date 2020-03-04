(() => {
    'use strict';

    describe('the product inspection component', () => {
        let $compile, $log, $q, ctrl, el, mock, networkService, scope;

        mock = {
            availableProducts: [
                { productId: 3 },
            ],
            foundProduct: {
                product: 'found',
                productId: 8,
            },
            newProduct: {
                product: 'product value',
            },
            systemProduct: {
                product: 'system',
                productId: 4,
                lastModifiedDate: 33939,
            },
            foundDeveloper: {
                developerId: 2,
            },
            newDeveloper: {
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl.components', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.getProductsByDeveloper = jasmine.createSpy('getProductsByDeveloper');
                    $delegate.getSimpleProduct = jasmine.createSpy('getSimpleProduct');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.getProductsByDeveloper.and.returnValue($q.when({products: mock.availableProducts}));
                networkService.getSimpleProduct.and.returnValue($q.when(mock.systemProduct));

                scope = $rootScope.$new();

                el = angular.element('<ai-inspect-product></ai-inspect-product>');
                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
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

            describe('when a developer and product exist', () => {
                beforeEach(() => {
                    scope.pendingProduct = mock.foundProduct;
                    scope.developer = mock.foundDeveloper;

                    el = angular.element('<ai-inspect-product pending-product="pendingProduct" developer="developer"></ai-inspect-product>');
                    $compile(el)(scope);
                    scope.$digest();
                    ctrl = el.isolateScope().$ctrl;
                });

                it('should know to allow for choice of a product', () => {
                    expect(ctrl.choice).toBe('choose');
                });

                it('should know what the bindings are, and break them from the original', () => {
                    expect(ctrl.pendingProduct).not.toBe(mock.foundProduct);
                    expect(ctrl.pendingProduct).toEqual(mock.foundProduct);
                    expect(ctrl.developer).not.toBe(mock.foundDeveloper);
                    expect(ctrl.developer).toEqual(mock.foundDeveloper);
                });

                it('should get products based on found developer', () => {
                    expect(networkService.getProductsByDeveloper).toHaveBeenCalledWith(mock.foundDeveloper.developerId);
                    expect(ctrl.availableProducts).toEqual(mock.availableProducts);
                });

                it('should get product data based on found product', () => {
                    expect(networkService.getSimpleProduct).toHaveBeenCalledWith(mock.foundProduct.productId);
                    expect(ctrl.systemProduct).toEqual(mock.systemProduct);
                });
            });

            describe('when there\'s no developer id', () => {
                beforeEach(() => {
                    scope.pendingProduct = mock.newProduct;
                    scope.developer = mock.newDeveloper;

                    el = angular.element('<ai-inspect-product pending-product="pendingProduct" developer="developer"></ai-inspect-product>');
                    $compile(el)(scope);
                    scope.$digest();
                    ctrl = el.isolateScope().$ctrl;
                });

                it('should know to create a new product', () => {
                    expect(ctrl.choice).toBe('create');
                });

                it('should not get available products', () => {
                    expect(networkService.getProductsByDeveloper).not.toHaveBeenCalled();
                    expect(ctrl.availableProducts).toBeUndefined();
                });

                it('should not get the system product', () => {
                    expect(networkService.getSimpleProduct).not.toHaveBeenCalled();
                    expect(ctrl.systemProduct).toBeUndefined();
                });
            });

            describe('when selecting a product', () => {
                let selectSpy;

                beforeEach(() => {
                    selectSpy = jasmine.createSpy('selectSpy');
                    scope.pendingProduct = mock.foundProduct;
                    scope.developer = mock.foundDeveloper;
                    scope.selectSpy = selectSpy;

                    el = angular.element('<ai-inspect-product pending-product="pendingProduct" developer="developer" on-select="selectSpy(productId)"></ai-inspect-product>');

                    $compile(el)(scope);
                    scope.$digest();
                    ctrl = el.isolateScope().$ctrl;
                });

                it('should have an onChange function', () => {
                    expect(typeof(ctrl.onSelect)).toEqual('function');
                });

                it('should call the spy', () => {
                    ctrl.onSelect();
                    expect(selectSpy).toHaveBeenCalled();
                });

                it('should set the pendingProduct id', () => {
                    ctrl.productSelect = { productId: 323 };
                    ctrl.select();
                    expect(ctrl.pendingProduct.productId).toBe(323);
                });

                it('should call the callback function', () => {
                    ctrl.productSelect = { productId: 33 };
                    ctrl.select();
                    expect(selectSpy).toHaveBeenCalledWith(33);
                });

                it('should update the systemProduct', () => {
                    const callCount = networkService.getSimpleProduct.calls.count();
                    ctrl.productSelect = { productId: 33 };
                    ctrl.select();
                    scope.$digest();
                    expect(networkService.getSimpleProduct.calls.count()).toBe(callCount + 1);
                });
            });
        });
    });
})();

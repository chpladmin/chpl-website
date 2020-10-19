(() => {
    'use strict';

    describe('the Product Merge component', () => {
        var $compile, $log, $q, $state, ctrl, el, mock, networkService, scope;

        mock = {
            product: {},
            products: [],
            developer: {},
        };

        beforeEach(() => {
            angular.mock.module('chpl.organizations', $provide => {
                $provide.factory('chplProductEditDirective', () => ({}));
                $provide.decorator('networkService', $delegate => {
                    $delegate.getProduct = jasmine.createSpy('getProduct');
                    $delegate.updateProduct = jasmine.createSpy('updateProduct');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _$state_, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                $state = _$state_;
                networkService = _networkService_;
                networkService.getProduct.and.returnValue($q.when(mock.product));
                networkService.updateProduct.and.returnValue($q.when({
                    product: 'a product',
                    productId: 32,
                }));

                scope = $rootScope.$new();
                scope.developer = mock.developer;
                scope.products = { products: mock.products };

                el = angular.element('<chpl-products-merge developer="developer" products="products"></chpl-products-merge>');

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

        describe('template', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should exist', () => {
                expect(ctrl).toBeDefined();
            });
        });

        describe('when a product merge is saved', () => {
            it('should navigate back to the developer on a good response', () => {
                spyOn($state, 'go');
                let product = {
                    productId: 'an id',
                };
                ctrl.developer = { developerId: 'dev ID' };
                ctrl.selectedProducts = [{productId: 1}, {productId: 2}];
                networkService.updateProduct.and.returnValue($q.when({productId: 200}));
                ctrl.merge(product);
                scope.$digest();
                expect($state.go).toHaveBeenCalledWith(
                    'organizations.developers.developer',
                    { developerId: 'dev ID' },
                    { reload: true },
                );
            });

            it('should pass the the merging product data to the network service', () => {
                let product = {
                    productId: 'an id',
                };
                ctrl.product = product;
                ctrl.developer = { developerId: 'dev ID' };
                ctrl.selectedProducts = [{productId: 1}, {productId: 2}];
                networkService.updateProduct.and.returnValue($q.when({productId: 200}));
                ctrl.merge(product);
                expect(networkService.updateProduct).toHaveBeenCalledWith({
                    product: product,
                    productIds: [1, 2, 'an id'],
                    newDeveloperId: 'dev ID',
                });
            });
        });
    });
})();

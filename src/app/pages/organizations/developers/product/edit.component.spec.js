(() => {
    'use strict';

    describe('the Products Edit component', () => {
        var $compile, $log, $q, $rootScope, ctrl, el, mock, networkService, scope;

        mock = {
            product: {
                name: 'a product',
            },
            stateParams: {
                developerId: 22,
                productId: 32,
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl.organizations', $provide => {
                $provide.factory('$stateParams', () => mock.stateParams);
                $provide.factory('chplProductEditDirective', () => ({}));
                $provide.decorator('networkService', $delegate => {
                    $delegate.getProduct = jasmine.createSpy('getProduct');
                    return $delegate;
                });
            });
            inject((_$compile_, _$log_, _$q_, _$rootScope_, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                networkService = _networkService_;
                networkService.getProduct.and.returnValue($q.when(mock.product));

                scope = $rootScope.$new();

                el = angular.element('<chpl-products-edit></chpl-products-edit>');

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

        describe('view', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should exist', () => {
                expect(ctrl).toEqual(jasmine.any(Object));
            });

            describe('during initialization', () => {
                it('should get data', () => {
                    expect(networkService.getProduct.calls.count()).toBe(1);
                });
            });
        });
    });
})();

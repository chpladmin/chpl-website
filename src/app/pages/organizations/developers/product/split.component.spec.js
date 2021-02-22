(() => {
  'use strict';

  describe('the Product Split component', () => {
    var $compile, $log, $q, ctrl, el, mock, networkService, scope;

    mock = {
      developer: {
        developerId: 22,
        products: [{productId: 32}, {productId: 39}, {productId: 44}],
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
          $delegate.updateProduct = jasmine.createSpy('updateProduct');
          return $delegate;
        });
      });

      inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
        $compile = _$compile_;
        $log = _$log_;
        $q = _$q_;
        networkService = _networkService_;
        networkService.updateProduct.and.returnValue($q.when({
          product: 'a product',
          productId: 32,
        }));

        scope = $rootScope.$new();
        scope.developer = mock.developer;

        el = angular.element('<chpl-products-split product="product"></chpl-products-split>');

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
  });
})();

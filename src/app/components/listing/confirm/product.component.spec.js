(() => {
  'use strict';

  describe('the Product Confirmation component', () => {
    let $compile, $log, $q, ctrl, el, mock, networkService, scope;

    mock = {
      listing: {
        product: {
          productId: 1,
          name: 'a product',
        },
      },
      product: {
        name: 'a product',
      },
      products: [{
        name: 'a product',
        productId: 1,
      }],
    };

    beforeEach(() => {
      angular.mock.module('chpl.components', $provide => {
        $provide.decorator('networkService', $delegate => {
          $delegate.getProductsByDeveloper = jasmine.createSpy('getProductsByDeveloper');
          $delegate.getSimpleProduct = jasmine.createSpy('getSimpleProduct');
          $delegate.updateProduct = jasmine.createSpy('updateProduct');

          return $delegate;
        });
      });

      inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
        $compile = _$compile_;
        $log = _$log_;
        $q = _$q_;
        networkService = _networkService_;
        networkService.getProductsByDeveloper.and.returnValue($q.when({}));
        networkService.getSimpleProduct.and.returnValue($q.when({}));
        networkService.updateProduct.and.returnValue($q.when({}));

        scope = $rootScope.$new();
        scope.products = mock.products;
        scope.pending = mock.product;
        scope.uploaded = mock.listing.product;

        el = angular.element('<chpl-confirm-product product="products" pending="pending" uploaded="uploaded"></chpl-confirm-product>');
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

      describe('when saving new product', () => {
        it('should call the network service', () => {
          ctrl.pending = angular.copy(ctrl.uploaded);
          ctrl.saveConfirmingProduct();
          scope.$digest();
          expect(networkService.updateProduct).toHaveBeenCalled();
        });
      });
    });
  });
})();

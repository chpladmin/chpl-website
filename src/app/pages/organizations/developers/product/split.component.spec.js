(() => {
  describe('the Product Split component', () => {
    let $compile;
    let $log;
    let $q;
    let ctrl;
    let el;
    let networkService;
    let scope;

    const mock = {
      developer: {
        developerId: 22,
        products: [{ id: 32 }, { id: 39 }, { id: 44 }],
      },
      stateParams: {
        developerId: 22,
        productId: 32,
      },
    };

    beforeEach(() => {
      angular.mock.module('chpl.organizations', ($provide) => {
        $provide.factory('$stateParams', () => mock.stateParams);
        $provide.factory('chplProductEditDirective', () => ({}));
        $provide.decorator('networkService', ($delegate) => ({
          ...$delegate,
          updateProduct: jasmine.createSpy('updateProduct'),
        }));
      });

      inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
        $compile = _$compile_;
        $log = _$log_;
        $q = _$q_;
        networkService = _networkService_;
        networkService.updateProduct.and.returnValue($q.when({
          product: 'a product',
          id: 32,
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
        console.log(`Debug:\n${$log.debug.logs.map((o) => angular.toJson(o)).join('\n')}`);
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

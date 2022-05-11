(() => {
  describe('chpl.aiCompareWidget', () => {
    let $compile;
    let $localStorage;
    let $log;
    let $rootScope;
    let el;
    let vm;

    const mock = {
      products: [
        { id: 1, name: 'name1', chplProductNumber: undefined },
        { id: 2, name: 'name2', chplProductNumber: undefined },
        { id: 3, name: 'name3', chplProductNumber: undefined },
      ],
    };

    beforeEach(() => {
      angular.mock.module('chpl.components');
      inject((_$compile_, _$localStorage_, _$log_, _$rootScope_) => {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $log = _$log_;
        $localStorage = _$localStorage_;
        delete ($localStorage.compareWidget);

        el = angular.element('<ai-compare-widget></ai-compare-widget>');

        $compile(el)($rootScope.$new());
        $rootScope.$digest();
        vm = el.isolateScope().vm;
      });
    });

    afterEach(() => {
      if ($log.debug.logs.length > 0) {
        /* eslint-disable no-console,angular/log */
        console.log(`Debug:\n${$log.debug.logs.map((o) => angular.toJson(o)).join('\n')}`);
        /* eslint-enable no-console,angular/log */
      }
    });

    it('should be compiled', () => {
      expect(el.html()).not.toEqual(null);
    });

    it('should have isolate scope object with instanciate members', () => {
      expect(vm).toEqual(jasmine.any(Object));
      expect(vm.compareWidget).toEqual(
        { products: [], listingIds: [] },
      );
    });

    describe('adding products to the list', () => {
      it('should have a way to toggle products into the array', () => {
        vm.toggleProduct(mock.products[0].id, mock.products[0].name);
        expect(vm.compareWidget.products).toEqual([mock.products[0]]);
        vm.toggleProduct(mock.products[1].id, mock.products[1].name);
        expect(vm.compareWidget.products).toEqual([mock.products[0], mock.products[1]]);
      });

      it('should have a way to toggle products out of the array', () => {
        vm.toggleProduct(mock.products[0].id, mock.products[0].name);
        expect(vm.compareWidget.products).toEqual([mock.products[0]]);
        vm.toggleProduct(mock.products[0].id, mock.products[0].name);
        expect(vm.compareWidget.products).toEqual([]);
      });
    });

    describe('when products are in the list', () => {
      beforeEach(() => {
        for (let i = 0; i < mock.products.length; i += 1) {
          vm.toggleProduct(mock.products[i].id, mock.products[i].name);
        }
      });

      it('should have a way to clear all the product IDs', () => {
        vm.clearProducts();
        expect(vm.compareWidget.products).toEqual([]);
      });

      it('should know what the listingIds are', () => {
        expect(vm.compareWidget.listingIds).toEqual([1, 2, 3]);
      });

      it('should know what the queryUrl should be', () => {
        expect(vm.queryUrl()).toBe('1&2&3');
      });

      describe('previously compared objects', () => {
        it('should add active products to the previously compared list on save', () => {
          $localStorage.previouslyCompared = [];
          vm.saveProducts();
          expect($localStorage.previouslyCompared).toEqual([1, 2, 3]);
        });
      });
    });

    describe('when listening for the "compare all" event', () => {
      const payload = [
        { name: 'a name', listingId: '1', chplProductNumber: undefined },
        { name: '2nd name', listingId: '2', chplProductNumber: undefined },
      ];
      const products = payload.map((item) => ({ id: item.listingId, name: item.name, chplProductNumber: item.chplProductNumber }));

      it('should put the items in the widget', () => {
        $rootScope.$broadcast('compareAll', payload);
        expect(vm.compareWidget.products).toEqual(products);
      });

      it('should remove any previous items in the widget', () => {
        vm.compareWidget.products = [1, 2];
        $rootScope.$broadcast('compareAll', payload);
        expect(vm.compareWidget.products).toEqual(products);
      });

      it('should get the correct list of listingIds', () => {
        $rootScope.$broadcast('compareAll', payload);
        expect(vm.compareWidget.listingIds).toEqual(['1', '2']);
      });
    });
  });
})();

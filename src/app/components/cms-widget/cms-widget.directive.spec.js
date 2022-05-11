(() => {
  describe('chpl.aiCmsWidget', () => {
    let $compile;
    let $log;
    let $rootScope;
    let el;
    let vm;

    beforeEach(() => {
      angular.mock.module('chpl.components', 'chpl.services');
      inject((_$compile_, $localStorage, _$log_, _$rootScope_) => {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $log = _$log_;

        delete $localStorage.cmsWidget;

        el = angular.element('<ai-cms-widget></ai-cms-widget>');

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
      expect(el.html()).not.toBeNull();
    });

    it('should have isolate scope object with instanciate members', () => {
      expect(vm).toEqual(jasmine.any(Object));
      expect(vm.widget).toEqual({ listingIds: [] });
    });

    describe('adding products to the list', () => {
      it('should have a way to add product IDs to the array', () => {
        vm.addProduct(1);
        expect(vm.widget.listingIds).toEqual([1]);
        vm.addProduct(1);
        expect(vm.widget.listingIds).toEqual([1]);
        vm.addProduct(2);
        expect(vm.widget.listingIds).toEqual([1, 2]);
      });

      it('should call the /search endpoint when a product is added', () => {
        spyOn(vm, 'search');
        vm.addProduct(1);
        expect(vm.search).toHaveBeenCalled();
      });

      it('should not call the /search endpoint when a duplicate product is added', () => {
        vm.widget.listingIds = [1];
        spyOn(vm, 'search');
        vm.addProduct(1);
        expect(vm.search).not.toHaveBeenCalled();
      });
    });

    describe('clearing Product IDs', () => {
      beforeEach(() => {
        vm.widget.listingIds = [1, 2, 3];
      });

      it('should have a way to remove product IDs from the array', () => {
        expect(vm.widget.listingIds).toEqual([1, 2, 3]);
        vm.removeProduct(1);
        expect(vm.widget.listingIds).toEqual([2, 3]);
        vm.removeProduct(1);
        expect(vm.widget.listingIds).toEqual([2, 3]);
      });

      it('should treat coerce strings to numbers as IDs', () => {
        vm.removeProduct('1');
        expect(vm.widget.listingIds).toEqual([2, 3]);
      });

      it('should call the /search endpoint when a product is removed', () => {
        spyOn(vm, 'search');
        vm.removeProduct(1);
        expect(vm.search).toHaveBeenCalled();
      });

      it('should not call the /search endpoint when a product is removed that doesn\'t exist', () => {
        spyOn(vm, 'search');
        vm.removeProduct(4);
        expect(vm.search).not.toHaveBeenCalled();
      });

      it('should have a way to clear all the product IDs', () => {
        vm.clearProducts();
        expect(vm.widget).toEqual({ listingIds: [] });
      });
    });

    it('should have a way to toggle the state of a listingId', () => {
      vm.widget.listingIds = [1, 2, 3];
      vm.toggleProduct(3);
      vm.toggleProduct(4);
      expect(vm.widget.listingIds).toEqual([1, 2, 4]);
    });

    describe('when comparing objects', () => {
      const products = [
        { name: 'a name', listingId: 1 },
        { name: '2nd name', listingId: 2 },
      ];
      const payload = products.map((item) => ({ name: item.name, listingId: `${item.listingId}` }));

      it('should broadcast comparing products', () => {
        spyOn($rootScope, '$broadcast');
        vm.widget.searchResult = {
          products,
        };
        vm.compare();
        expect($rootScope.$broadcast).toHaveBeenCalledWith('compareAll', payload);
      });

      it('should broadcast "close widget"', () => {
        spyOn($rootScope, '$broadcast');
        vm.widget.searchResult = {
          products,
        };
        vm.compare();
        expect($rootScope.$broadcast).toHaveBeenCalledWith('HideWidget');
      });

      it('should broadcast "show compare widget"', () => {
        spyOn($rootScope, '$broadcast');
        vm.widget.searchResult = {
          products,
        };
        vm.compare();
        expect($rootScope.$broadcast).toHaveBeenCalledWith('ShowCompareWidget');
      });
    });
  });
})();

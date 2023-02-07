(function () {
  'use strict';

  describe('chpl.aiCompareWidget', function () {
    var $compile, $localStorage, $log, $rootScope, el, mock, vm;
    mock = {
      products: [
        {id: 1, name: 'name1', chplProductNumber: undefined},
        {id: 2, name: 'name2', chplProductNumber: undefined},
        {id: 3, name: 'name3', chplProductNumber: undefined},
      ],
    };

    beforeEach(function () {
      angular.mock.module('chpl.components');
      inject(function (_$compile_, _$localStorage_, _$log_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $log = _$log_;
        $localStorage = _$localStorage_;
        delete($localStorage.compareWidget);

        el = angular.element('<ai-compare-widget></ai-compare-widget>');

        $compile(el)($rootScope.$new());
        $rootScope.$digest();
        vm = el.isolateScope().vm;
      });
    });

    afterEach(function () {
      if ($log.debug.logs.length > 0) {
        /* eslint-disable no-console,angular/log */
        console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
        /* eslint-enable no-console,angular/log */
      }
    });

    it('should be compiled', function () {
      expect(el.html()).not.toEqual(null);
    });

    it('should have isolate scope object with instanciate members', function () {
      expect(vm).toEqual(jasmine.any(Object));
      expect(vm.compareWidget).toEqual(
        {products: []}
      );
    });

    describe('adding products to the list', function () {
      it('should have a way to toggle products into the array', function () {
        vm.toggleProduct(mock.products[0].id,mock.products[0].name);
        expect(vm.compareWidget.products).toEqual([mock.products[0]]);
        vm.toggleProduct(mock.products[1].id,mock.products[1].name);
        expect(vm.compareWidget.products).toEqual([mock.products[0], mock.products[1]]);
      });

      it('should have a way to toggle products out of the array', function () {
        vm.toggleProduct(mock.products[0].id,mock.products[0].name);
        expect(vm.compareWidget.products).toEqual([mock.products[0]]);
        vm.toggleProduct(mock.products[0].id,mock.products[0].name);
        expect(vm.compareWidget.products).toEqual([]);
      });
    });

    describe('when products are in the list', function () {
      beforeEach(function () {
        for (var i = 0; i < mock.products.length; i++) {
          vm.toggleProduct(mock.products[i].id,mock.products[i].name);
        }
      });
    });
  });
})();

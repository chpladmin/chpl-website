(function () {
    'use strict';

    describe('chpl.aiCompareWidget', function () {
        var $compile, $rootScope, vm, el, $localStorage, $log, mock;
        mock = {
            products: [
                {id: 1, name: 'name1'},
                {id: 2, name: 'name2'},
                {id: 3, name: 'name3'}
            ]
        };

        beforeEach(function () {
            module('chpl.compare-widget');
            inject(function (_$compile_, _$rootScope_, _$log_, _$localStorage_) {
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
                //console.debug("\n Debug: " + $log.debug.logs.join("\n Debug: "));
            }
        });

        it('should be compiled', function () {
            expect(el.html()).not.toEqual(null);
        });

        it('should have isolate scope object with instanciate members', function () {
            expect(vm).toEqual(jasmine.any(Object));
            expect(vm.compareWidget).toEqual(
                {products: [], productIds: []}
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

            it('should have a way to clear all the product IDs', function () {
                vm.clearProducts();
                expect(vm.compareWidget.products).toEqual([]);
            });

            it('should know what the productIds are', function () {
                expect(vm.compareWidget.productIds).toEqual([1,2,3]);
            });

            it('should know what the queryUrl should be', function () {
                expect(vm.queryUrl()).toBe('1&2&3');
            });

            describe('previously compared objects', function () {
                it('should add active products to the previously compared list on save', function () {
                    $localStorage.previouslyCompared = [];
                    vm.saveProducts();
                    expect($localStorage.previouslyCompared).toEqual([1,2,3]);
                });
            });
        });
    });
})();

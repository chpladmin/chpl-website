(function () {
    'use strict';

    describe('chpl.aiCmsWidget', function () {
        var $compile, $log, $rootScope, el, vm;

        beforeEach(function () {
            angular.mock.module('chpl.components', 'chpl.services');
            inject(function (_$compile_, $localStorage, _$log_, _$rootScope_) {
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

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        it('should be compiled', function () {
            expect(el.html()).not.toBeNull();
        });

        it('should have isolate scope object with instanciate members', function () {
            expect(vm).toEqual(jasmine.any(Object));
            expect(vm.widget).toEqual({productIds: []});
        });

        describe('adding products to the list', function () {
            it('should have a way to add product IDs to the array', function () {
                vm.addProduct(1);
                expect(vm.widget.productIds).toEqual([1]);
                vm.addProduct(1);
                expect(vm.widget.productIds).toEqual([1]);
                vm.addProduct(2);
                expect(vm.widget.productIds).toEqual([1,2]);
            });

            it('should call the /search endpoint when a product is added', function () {
                spyOn(vm, 'search');
                vm.addProduct(1);
                expect(vm.search).toHaveBeenCalled();
            });

            it('should not call the /search endpoint when a duplicate product is added', function () {
                vm.widget.productIds = [1];
                spyOn(vm, 'search');
                vm.addProduct(1);
                expect(vm.search).not.toHaveBeenCalled();
            });
        });

        describe('clearing Product IDs', function () {
            beforeEach(function () {
                vm.widget.productIds = [1,2,3];
            });

            it('should have a way to remove product IDs from the array', function () {
                expect(vm.widget.productIds).toEqual([1,2,3]);
                vm.removeProduct(1);
                expect(vm.widget.productIds).toEqual([2,3]);
                vm.removeProduct(1);
                expect(vm.widget.productIds).toEqual([2,3]);
            });

            it('should treat coerce strings to numbers as IDs', function () {
                vm.removeProduct('1');
                expect(vm.widget.productIds).toEqual([2,3]);
            });

            it('should call the /search endpoint when a product is removed', function () {
                spyOn(vm, 'search');
                vm.removeProduct(1);
                expect(vm.search).toHaveBeenCalled();
            });

            it('should not call the /search endpoint when a product is removed that doesn\'t exist', function () {
                spyOn(vm, 'search');
                vm.removeProduct(4);
                expect(vm.search).not.toHaveBeenCalled();
            });

            it('should have a way to clear all the product IDs', function () {
                vm.clearProducts();
                expect(vm.widget).toEqual({productIds: []});
            });
        });

        it('should have a way to toggle the state of a productId', function () {
            vm.widget.productIds = [1,2,3];
            vm.toggleProduct(3);
            vm.toggleProduct(4);
            expect(vm.widget.productIds).toEqual([1,2,4]);
        });

        describe('when comparing objects', () => {
            const products = [
                { name: 'a name', productId: 1 },
                { name: '2nd name', productId: 2 },
            ];
            const payload = products.map((item) => { return { name: item.name, productId: item.productId + ''}; });

            it('should broadcast comparing products', () => {
                spyOn($rootScope, '$broadcast');
                vm.widget.searchResult = {
                    products: products,
                }
                vm.compare();
                expect($rootScope.$broadcast).toHaveBeenCalledWith('compareAll', payload);
            });

            it('should broadcast "close widget"', () => {
                spyOn($rootScope, '$broadcast');
                vm.widget.searchResult = {
                    products: products,
                }
                vm.compare();
                expect($rootScope.$broadcast).toHaveBeenCalledWith('HideWidget');
            });

            it('should broadcast "show compare widget"', () => {
                spyOn($rootScope, '$broadcast');
                vm.widget.searchResult = {
                    products: products,
                }
                vm.compare();
                expect($rootScope.$broadcast).toHaveBeenCalledWith('ShowCompareWidget');
            });
        });
    });
})();

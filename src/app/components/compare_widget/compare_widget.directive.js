(function () {
    'use strict';

    angular.module('chpl.compare-widget')
        .directive('aiCompareWidget', aiCompareWidget)
        .controller('CompareWidgetController', CompareWidgetController);

    /** @ngInject */
    function aiCompareWidget () {
        return {
            bindToController: {
                compareWidget: '=?'
            },
            controller: 'CompareWidgetController',
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {}
        };
    }
    /** @ngInject */
    function CompareWidgetController ($localStorage) {
        var vm = this;

        vm.clearProducts = clearProducts;
        vm.isInList = isInList;
        vm.queryUrl = queryUrl;
        vm.toggleProduct = toggleProduct;

        activate ();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            getWidget();
        }

        function clearProducts () {
            vm.compareWidget = {
                products: [],
                productIds: []
            };
            saveWidget();
        }

        function isInList (id) {
            for (var i = 0; i < vm.compareWidget.products.length; i++) {
                if (vm.compareWidget.products[i].id === id) {
                    return true;
                }
            }
            return false;
        }

        function queryUrl () {
            return vm.compareWidget.productIds.join('&');
        }

        function toggleProduct (id, name) {
            if (vm.isInList(id)) {
                removeProduct(id);
            } else {
                addProduct(id, name);
            }
            vm.compareWidget.productIds = [];
            for (var i = 0; i < vm.compareWidget.products.length; i++) {
                vm.compareWidget.productIds.push(vm.compareWidget.products[i].id);
            }
            saveWidget();
        }

        ////////////////////////////////////////////////////////////////////

        function addProduct (id, name) {
            if (!isInList(id)) {
                vm.compareWidget.products.push({id: id, name: name});
            }
        }

        function getWidget () {
            if ($localStorage.compareWidget) {
                vm.compareWidget = $localStorage.compareWidget;
            } else {
                vm.clearProducts();
            }
        }

        function removeProduct (id) {
            for (var i = 0; i < vm.compareWidget.products.length; i++) {
                if (vm.compareWidget.products[i].id === id || parseInt(vm.compareWidget.products[i].id) === parseInt(id)) {
                    vm.compareWidget.products.splice(i,1);
                }
            }
        }

        function saveWidget () {
            $localStorage.compareWidget = vm.compareWidget;
        }
    }
})();

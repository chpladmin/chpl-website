(function () {
    'use strict';

    angular.module('chpl.components')
        .directive('aiCompareWidget', aiCompareWidget)
        .controller('CompareWidgetController', CompareWidgetController);

    /** @ngInject */
    function aiCompareWidget () {
        return {
            bindToController: {
                compareWidget: '=?',
            },
            controller: 'CompareWidgetController',
            controllerAs: 'vm',
            scope: {},
        };
    }
    /** @ngInject */
    function CompareWidgetController ($localStorage, $log, $scope) {
        var vm = this;

        vm.clearProducts = clearProducts;
        vm.isInList = isInList;
        vm.queryUrl = queryUrl;
        vm.saveProducts = saveProducts;
        vm.toggleProduct = toggleProduct;

        ////////////////////////////////////////////////////////////////////

        this.$onInit = function () {
            getWidget();
            var compareAll = $scope.$on('compareAll', (msg, payload) => {
                vm.clearProducts();
                vm.compareWidget.products = payload;
                vm.compareWidget.productIds = payload.map(item => item.productId + '');
            });
            $scope.$on('$destroy', compareAll);
        }

        function clearProducts () {
            vm.compareWidget = {
                products: [],
                productIds: [],
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

        function saveProducts () {
            var previously = $localStorage.previouslyCompared;
            if (!previously) {
                previously = [];
            }
            for (var i = 0; i < vm.compareWidget.productIds.length; i++) {
                if (previously.indexOf(vm.compareWidget.productIds[i]) === -1) {
                    previously.push(vm.compareWidget.productIds[i]);
                }
            }
            while (previously.length > 20) {
                previously.shift();
            }
            $localStorage.previouslyCompared = previously;
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

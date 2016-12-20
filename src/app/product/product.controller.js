(function () {
    'use strict';

    angular.module('chpl.product')
        .controller('ProductController', ProductController);

    /** @ngInclude */
    function ProductController ($log, $routeParams, $uibModal, commonService, authService) {
        var vm = this;

        vm.loadProduct = loadProduct;
        vm.viewProductHistory = viewProductHistory;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.productId = $routeParams.id;
            vm.isAuthed = authService.isAuthed();
            vm.loadProduct();
        }

        function loadProduct () {
            commonService.getProduct(vm.productId)
                .then(function (data) {
                    vm.product = data;
                }, function (error) {
                    $log.error(error);
                });
            commonService.getSingleCertifiedProductActivity(vm.productId)
                .then(function (data) {
                    vm.activity = data;
                }, function (error) {
                    $log.error(error);
                });
            commonService.getCap(vm.productId)
                .then(function (data) {
                    vm.correctiveActionPlan = data.plans;
                }, function (error) {
                    $log.error (error);
                });
        }

        function viewProductHistory () {
            vm.viewProductHistoryInstance = $uibModal.open({
                templateUrl: 'app/product/product_history.html',
                controller: 'ProductHistoryController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'md',
                resolve: {
                    activity: function () { return vm.activity; }
                }
            });
            vm.viewProductHistoryInstance.result.then(function (response) {
                $log.info(response);
            }, function (result) {
                $log.info(result)
            });
        }
    }
})();

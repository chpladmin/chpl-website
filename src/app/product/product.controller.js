(function () {
    'use strict';

    angular.module('chpl.product')
        .controller('ProductController', ProductController);

    /** @ngInclude */
    function ProductController ($localStorage, $log, $routeParams, $uibModal, authService, networkService, utilService) {
        var vm = this;

        vm.certificationStatus = utilService.certificationStatus;
        vm.loadProduct = loadProduct;
        vm.viewProductHistory = viewProductHistory;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.loading = true;
            vm.productId = $routeParams.id;
            if ($localStorage.previouslyViewed) {
                vm.previouslyViewed = $localStorage.previouslyViewed;

                if (vm.previouslyViewed.indexOf((vm.productId + '')) === -1) {
                    vm.previouslyViewed.push((vm.productId + ''));
                    if (vm.previouslyViewed.length > 20) {
                        vm.previouslyViewed.shift();
                    }
                    $localStorage.previouslyViewed = vm.previouslyViewed;
                }
            } else {
                $localStorage.previouslyViewed = [vm.productId + ''];
            }
            if ($routeParams.initialPanel) {
                vm.initialPanel = $routeParams.initialPanel;
            } else {
                vm.initialPanel = 'cert';
            }

            vm.isAuthed = authService.isAuthed();
            vm.loadProduct();
        }

        function loadProduct () {
            networkService.getProduct(vm.productId)
                .then(function (data) {
                    vm.loading = false;
                    vm.product = data;
                }, function (error) {
                    vm.loading = false;
                    $log.error(error);
                });
            networkService.getSingleCertifiedProductActivity(vm.productId)
                .then(function (data) {
                    vm.activity = data;
                }, function (error) {
                    $log.error(error);
                });
            networkService.getCap(vm.productId)
                .then(function (data) {
                    vm.correctiveActionPlan = data.plans;
                }, function (error) {
                    $log.error(error);
                });
        }

        function viewProductHistory () {
            vm.viewProductHistoryInstance = $uibModal.open({
                templateUrl: 'app/product/history/history.html',
                controller: 'ProductHistoryController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    activity: function () { return vm.activity; },
                },
            });
            vm.viewProductHistoryInstance.result.then(function (response) {
                $log.info(response);
            }, function (result) {
                $log.info(result)
            });
        }
    }
})();

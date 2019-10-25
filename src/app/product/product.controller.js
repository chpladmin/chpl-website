(function () {
    'use strict';

    angular.module('chpl.product')
        .controller('ProductController', ProductController);

    /** @ngInclude */
    function ProductController ($localStorage, $log, $stateParams, $uibModal, authService, featureFlags, networkService, utilService) {
        var vm = this;

        vm.certificationStatus = utilService.certificationStatus;
        vm.canEdit = canEdit;
        vm.hasAnyRole = authService.hasAnyRole;
        vm.loadProduct = loadProduct;
        vm.viewProductHistory = viewProductHistory;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.loading = true;
            vm.productId = $stateParams.id;
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
            if ($stateParams.initialPanel) {
                vm.initialPanel = $stateParams.initialPanel;
            } else {
                vm.initialPanel = 'cert';
            }

            vm.loadProduct();
        }

        function canEdit () {
            if (featureFlags.isOn('effective-rule-date+1-week') && vm.product.certificationEdition.name === '2014') {
                return vm.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']);
            } else {
                return vm.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB']);
            }
        }

        function loadProduct () {
            networkService.getListing(vm.productId)
                .then(function (data) {
                    vm.loading = false;
                    vm.product = data;
                }, function (error) {
                    vm.loading = false;
                    $log.error(error);
                });
            networkService.getSingleListingActivityMetadata(vm.productId)
                .then(function (data) {
                    vm.activity = data;
                }, function (error) {
                    $log.error(error);
                });
        }

        function viewProductHistory () {
            vm.viewProductHistoryInstance = $uibModal.open({
                component: 'chplListingHistory',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    listing: function () { return vm.product; },
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

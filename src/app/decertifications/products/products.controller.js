(function () {
    'use strict';

    angular.module('chpl.decertifications')
        .controller('DecertifiedProductsController', DecertifiedProductsController);

    /** @ngInject */
    function DecertifiedProductsController ($log, commonService) {
        var vm = this;

        vm.loadProducts = loadProducts;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.decertifiedProducts = [];
            vm.displayedProducts = [];
            commonService.getDecertifiedProducts()
                .then(function (result) {
                    vm.decertifiedProducts = result.results;
                    vm.displayedProducts = [].concat(vm.decertifiedProducts);
                    vm.loadProducts();
                }, function (error) {
                    $log.debug(error);
                });
            commonService.getSearchOptions(true)
                .then(function (result) {
                    vm.acbs = result.certBodyNames;
                    vm.statuses = result.certificationStatuses;
                });
        }

        function loadProducts () {
            vm.modifiedDecertifiedProducts = [];
            for (var i = 0; i < vm.decertifiedProducts.length; i++) {
                vm.modifiedDecertifiedProducts.push({
                    acb: vm.decertifiedProducts[i].certifyingBody.name,
                    certificationDate: vm.decertifiedProducts[i].certificationDate,
                    chplProductNumber: vm.decertifiedProducts[i].chplProductNumber,
                    developer: vm.decertifiedProducts[i].developer.name,
                    edition: vm.decertifiedProducts[i].certificationEdition.name,
                    estimatedUsers: vm.decertifiedProducts[i].numMeaningfulUse,
                    id: vm.decertifiedProducts[i].id,
                    product: vm.decertifiedProducts[i].product.name,
                    status: vm.decertifiedProducts[i].certificationStatus.name,
                    version: vm.decertifiedProducts[i].product.version
                });
            }
        }
    }
})();

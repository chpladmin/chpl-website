(function () {
    'use strict';

    angular.module('chpl.decertifications')
        .controller('InactiveCertificationsController', InactiveCertificationsController);

    /** @ngInject */
    function InactiveCertificationsController ($log, commonService) {
        var vm = this;

        vm.loadProducts = loadProducts;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.inactiveProducts = [];
            vm.displayedProducts = [];
            commonService.getInactiveCertifications()
                .then(function (result) {
                    vm.inactiveProducts = result.results;
                    vm.displayedProducts = [].concat(vm.inactiveProducts);
                    vm.loadProducts();
                }, function (error) {
                    $log.debug(error);
                });
            commonService.getMeaningfulUseUsersAccurateAsOfDate()
                .then(function (response) {
                    vm.muuAccurateAsOf = response.accurateAsOfDate;
                });
        }

        function loadProducts () {
            vm.modifiedInactiveProducts = [];
            for (var i = 0; i < vm.inactiveProducts.length; i++) {
                vm.modifiedInactiveProducts.push({
                    acb: vm.inactiveProducts[i].certifyingBody.name,
                    certificationDate: vm.inactiveProducts[i].certificationDate,
                    decertificationDate: vm.inactiveProducts[i].decertificationDate,
                    chplProductNumber: vm.inactiveProducts[i].chplProductNumber,
                    developer: vm.inactiveProducts[i].developer.name,
                    edition: vm.inactiveProducts[i].certificationEdition.name,
                    estimatedUsers: vm.inactiveProducts[i].numMeaningfulUse,
                    id: vm.inactiveProducts[i].id,
                    product: vm.inactiveProducts[i].product.name,
                    status: vm.inactiveProducts[i].certificationStatus.name,
                    version: vm.inactiveProducts[i].product.version
                });
            }
        }
    }
})();

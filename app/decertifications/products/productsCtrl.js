;(function () {
    'use strict';

    angular.module('app.decertifications')
        .controller('DecertifiedProductsController', ['$log', 'commonService', function ($log, commonService) {
            var vm = this;

            vm.loadProducts = loadProducts;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.decertifiedProducts = [];
                vm.displayedProducts = [];
                commonService.getDecertifiedProducts()
                    .then(function (result) {
                        vm.decertifiedProducts = result.data;
                        vm.displayedProducts = [].concat(vm.decertifiedProducts);
                        vm.loadProducts();
                    }, function (error) {
                        // debug
                        vm.decertifiedProducts = [
                            {
                                acb: {name: 'acb1'},
                                certificationDate: new Date('03/19/2013'),
                                chplProductNumber: 'CHP-123123',
                                developer: {name: 'dev 1'},
                                edition: {name: '2014'},
                                estimatedUsers: 4,
                                product: {name: 'prod 1'},
                                status: {name: 'status 1'},
                                version: {name: 'ver 1'}
                            },{
                                acb: {name: 'acb2'},
                                certificationDate: new Date('03/29/2015'),
                                chplProductNumber: '15.01.02.PROD.VER.1.2.1',
                                developer: {name: 'dev 2'},
                                edition: {name: '2015'},
                                estimatedUsers: 8,
                                product: {name: 'prod 2'},
                                status: {name: 'status 2'},
                                version: {name: 'ver 2'}
                            }
                        ];
                        vm.loadProducts();
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
                        acb: vm.decertifiedProducts[i].acb.name,
                        certificationDate: vm.decertifiedProducts[i].certificationDate,
                        chplProductNumber: vm.decertifiedProducts[i].chplProductNumber,
                        developer: vm.decertifiedProducts[i].developer.name,
                        edition: vm.decertifiedProducts[i].edition.name,
                        estimatedUsers: vm.decertifiedProducts[i].estimatedUsers,
                        product: vm.decertifiedProducts[i].product.name,
                        status: vm.decertifiedProducts[i].status.name,
                        version: vm.decertifiedProducts[i].version.name
                    });
                }
            }
        }]);
})();
